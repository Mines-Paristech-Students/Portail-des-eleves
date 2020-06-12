# Generated by Django 2.2.10 on 2020-06-08 16:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]

    operations = [
        migrations.CreateModel(
            name="Course",
            fields=[
                (
                    "id",
                    models.AutoField(primary_key=True, serialize=False, unique=True),
                ),
                ("name", models.CharField(max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name="Form",
            fields=[
                (
                    "id",
                    models.AutoField(primary_key=True, serialize=False, unique=True),
                ),
                ("date", models.DateTimeField(auto_now_add=True)),
                ("name", models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name="Question",
            fields=[
                (
                    "id",
                    models.AutoField(primary_key=True, serialize=False, unique=True),
                ),
                ("label", models.CharField(max_length=64)),
                ("required", models.BooleanField(default=False)),
                ("archived", models.BooleanField(default=False)),
                (
                    "category",
                    models.CharField(
                        choices=[("C", "COMMENT"), ("R", "RATING")],
                        default="C",
                        max_length=1,
                    ),
                ),
                (
                    "form",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="question",
                        to="courses.Form",
                    ),
                ),
            ],
            options={"unique_together": {("form", "label")}},
        ),
        migrations.CreateModel(
            name="Rating",
            fields=[
                (
                    "id",
                    models.AutoField(primary_key=True, serialize=False, unique=True),
                ),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "value",
                    models.SmallIntegerField(
                        choices=[
                            (1, "VERY_UNSATISFIED"),
                            (2, "UNSATISFIED"),
                            (3, "NEUTRAL"),
                            (4, "SATISFIED"),
                            (5, "VERY_SATISFIED"),
                        ]
                    ),
                ),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="rating",
                        to="courses.Course",
                    ),
                ),
                (
                    "question",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="rating",
                        to="courses.Question",
                    ),
                ),
            ],
            options={"ordering": ["-date"]},
        ),
        migrations.CreateModel(
            name="CourseMedia",
            fields=[
                (
                    "id",
                    models.AutoField(primary_key=True, serialize=False, unique=True),
                ),
                ("name", models.CharField(max_length=128)),
                ("uploaded_on", models.DateTimeField(auto_now_add=True)),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("P", "PALUM"),
                            ("N", "NOTES"),
                            ("E", "EXERCICES"),
                            ("O", "OTHER"),
                        ],
                        default="O",
                        max_length=1,
                    ),
                ),
                ("file", models.FileField(upload_to="courses/")),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="coursemedia",
                        to="courses.Course",
                    ),
                ),
                (
                    "uploaded_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="coursemedia",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="course",
            name="form",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="course",
                to="courses.Form",
            ),
        ),
        migrations.AddField(
            model_name="course",
            name="have_voted",
            field=models.ManyToManyField(
                blank=True, related_name="course", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.CreateModel(
            name="Comment",
            fields=[
                (
                    "id",
                    models.AutoField(primary_key=True, serialize=False, unique=True),
                ),
                ("date", models.DateTimeField(auto_now_add=True)),
                ("content", models.CharField(max_length=512)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="comment",
                        to="courses.Course",
                    ),
                ),
                (
                    "question",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="comment",
                        to="courses.Question",
                    ),
                ),
            ],
            options={"ordering": ["-date"]},
        ),
    ]
