from django.db import models
from django.utils.text import slugify
from django.db.models import Avg

from authentication.models import User

from django.db.utils import cached_property


NUMERIC_SCALE = (
    (1, ('VERY_UNSATISFIED')),
    (2, ('UNSATISFIED')),
    (3, ('NEUTRAL')),
    (4, ('SATISFIED')),
    (5, ('VERY_SATISFIED')),
)

QUESTION_CATEGORY = (
    ('C', ('COMMENT')),
    ('R', ('RATING')),
)


class Form(models.Model):
    id = models.AutoField(unique=True, primary_key=True)

    date = models.DateTimeField(auto_now_add=True)

    name = models.CharField(max_length=64)


class Course(models.Model):
    id = models.AutoField(unique=True, primary_key=True)

    name = models.CharField(max_length=128)

    form = models.ForeignKey(
        Form,
        related_name="course",
        on_delete=models.SET_NULL,
        blank=True, null=True,
    )

    have_voted = models.ManyToManyField(
        User,
        related_name="course",
        blank=True, 
    )

    @cached_property
    def stats(self):
        query = self.rating\
            .filter(question__form=self.form, question__archived=False)\
            .values('question__id')\
            .annotate(Avg('value'))\
            .values('value__avg', 'question__label', 'question__id')\
            .order_by('question__id')

        def histogram(questionId):
            values = {}
            for value in range(1, 6):
                values[value] = \
                    self.rating\
                        .filter(question__id=questionId, value=value)\
                        .count()
            return values

        return [
            {
                "id": question["question__id"],
                "label": question["question__label"],
                "average": question["value__avg"],
                # values doesn't group for integers
                "histogram": histogram(question["question__id"]),
            }
            for question in query
        ]

class CourseMedia(models.Model):
    id = models.AutoField(primary_key=True, unique=True)

    name = models.CharField(max_length=128)

    uploaded_on = models.DateTimeField(auto_now_add=True)

    category = models.CharField(max_length=64)

    file = models.FileField(upload_to='courses/')

    uploaded_by = models.ForeignKey(
        User,
        related_name="coursemedia",
        on_delete=models.CASCADE,
    )

    course = models.ForeignKey(
        Course,
        related_name="coursemedia",
        on_delete=models.CASCADE,
    )


class Question(models.Model):

    # TODO add test
    class Meta:
        unique_together = [['form', 'label']]

    id = models.AutoField(primary_key=True, unique=True)

    label = models.CharField(max_length=64)

    required = models.BooleanField(default=False)

    # Archived field is used to keep old data, while ensuring that it is deprecated
    archived = models.BooleanField(default=False)

    category = models.CharField(
        max_length=1,
        choices=QUESTION_CATEGORY,
        default="C"
    )

    form = models.ForeignKey(
        Form,
        related_name="question",
        on_delete=models.CASCADE,
        blank=True, null=True,
    )

class Rating(models.Model):
    id = models.AutoField(primary_key=True, unique=True)

    date = models.DateTimeField(auto_now_add=True)

    value = models.SmallIntegerField(choices=NUMERIC_SCALE)

    question = models.ForeignKey(
        Question,
        related_name="rating",
        on_delete=models.CASCADE,
    )

    course = models.ForeignKey(
        Course,
        related_name="rating",
        on_delete=models.CASCADE,
    )

    class Meta:
        ordering = ["-date"]


class Comment(models.Model):
    id = models.AutoField(primary_key=True, unique=True)

    date = models.DateTimeField(auto_now_add=True)

    content = models.CharField(max_length=64)

    question = models.ForeignKey(
        Question,
        related_name="comment",
        on_delete=models.CASCADE,
    )

    course = models.ForeignKey(
        Course,
        related_name="comment",
        on_delete=models.CASCADE,
    )

    class Meta:
        ordering = ["-date"]
