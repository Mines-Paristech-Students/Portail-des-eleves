from rest_framework import serializers
from datetime import datetime

from courses.models import Course, Form, Question, Rating, Comment, CourseMedia


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        read_only_fields = ("id",)
        fields = read_only_fields + ("name", "form")


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        read_only_fields = ("id", "category")
        fields = read_only_fields + ("label", "required", "archived", "form")


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        read_only_fields = ("id", "date")
        fields = read_only_fields + ("name",)


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ("id", "course", "question", "value", "date")

    def validate_question(self, question):
        if question.category != "R":
            raise serializers.ValidationError(
                "Rating must refer to a 'R' category question"
            )

        return question


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("id", "course", "question", "content")

    def validate_question(self, question):
        if question.category != "C":
            raise serializers.ValidationError(
                "Comment must refer to a 'C' category question"
            )

        return question
