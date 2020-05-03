from rest_framework import serializers
from datetime import datetime

from courses.models import Course, Form, Question, Rating, Comment, CourseMedia


class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        read_only_fields = ('id', )
        fields = read_only_fields + ("name", "form")


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        read_only_fields = ('id', 'category', 'form')
        fields = read_only_fields + ('label', 'required', 'archived')


class FormSerializer(serializers.ModelSerializer):

    class Meta:
        model = Form
        read_only_fields = ('id', 'date')
        fields = read_only_fields + ('name', )


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ("id", "course", "question", "value", "date")

    def validate_question(self, question):
        if question.category != 'R':
            raise serializers.ValidationError("Comment must refer to a 'C' category question")

        return question


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("id", "course", "question", "content")

    def validate_question(self, question):
        if question.category != 'C':
            raise serializers.ValidationError("Comment must refer to a 'C' category question")

        return question


class MediaSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseMedia
        read_only_fields = ('id', 'uploaded_on', 'file', 'uploaded_by', 'course')
        fields = ('name', 'category') + read_only_fields

    def create(self, validated_data):
        validated_data["uploaded_by"] = self.context["request"].user

        # Create the new file
        file = CourseMedia.objects.create(**validated_data)
        file.save()

        return file
