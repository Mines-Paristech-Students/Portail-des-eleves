from django.db import models
from django.utils.text import slugify

from authentication.models import User


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


class Course(models.Model):
    id = models.AutoField(unique=True, primary_key=True)

    name = models.CharField(max_length=128)

    form = models.ForeignKey(
        Form,
        related_name="course",
        on_delete=models.CASCADE,
        blank=True, null=True,
    )

    have_voted = models.ManyToManyField(
        User,
        related_name="course",
        blank=True,
    )


class CourseMedia(models.Model):
    name = models.CharField(max_length=128, unique=True)

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
    id = models.AutoField(primary_key=True, unique=True)

    label = models.CharField(max_length=64)

    required = models.BooleanField(default=False)

    # Archived field is used to keep old data, while ensuring that it is deprecated
    archived = models.BooleanField(default=False)

    category = models.CharField(
        max_length=1,
        choices=QUESTION_CATEGORY,
        default='C'
    )

    form = models.ForeignKey(
        Form,
        related_name="question",
        on_delete=models.CASCADE,
    )


class Rating(models.Model):
    id = models.AutoField(primary_key=True, unique=True)

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


class Comment(models.Model):
    id = models.AutoField(primary_key=True, unique=True)

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
