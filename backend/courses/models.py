"""
The inspirations is taken from :
https://github.com/bitlabstudio/django-review/blob/master/review/models.py

what needs to be done :
* Add tags
* Find a way so that people only vote once
* Sort people's opinions ?
* Functions to compute averages
* Cache average grade
"""


from django.db import models
from django.db.models.Field import IntegerChoices
from django.utils.text import slugify


class Course(models.Model):
    id = models.SlugField(max_length=128, primary_key=True)
    name = models.CharField(max_length=128)


class Review(models.Model):
    """
    User review

    Attributes
    ----------
    item: Object to review
    content: text of the review
    date: date of the review


    Notes
    -----
    Other fields (grade)
    """


class Rating(models.Model):
    """
    Category-based rating

    Attributes
    ----------
    id : Auto incrementing field 
    review : review the rating belongs to 
    category : name of the review
    value: number given

    Notes
    -----
    You could imagine different kinds of scales
    https://www.questionpro.com/blog/rating-scale/
    """

    class NumericScale(IntegerChoices):
        VERY_UNSATISFIED = 1
        UNSATISFIED = 2
        NEUTRAL = 3
        SATISFIED = 4
        VERY_SATISFIED = 5

    id = models.AutoField(primary_key=True)

    category = models.CharField(max_length=64)

    value = models.IntegerField(choices=NumericScale)

    review = models.ForeignKey(
        Review,
        on_delete=models.SET_NULL,
        null=True,
    )

    commentary = models.CharField(
        max_length=128,
        blank=True,
    )

    class Meta:
        ordering = ['category', 'value']

    def __str__(self):
        return f"{self.category}_{self.review} - {self.value}"
