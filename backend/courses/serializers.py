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
    # Writable nested serializer
    questions = QuestionSerializer(many=True, required=False)

    class Meta:
        model = Form
        read_only_fields = ('id', 'date')
        fields = read_only_fields + ('name', 'questions')
        depth = 1

    @staticmethod
    def create_question(question_data):
        question = Question.objects.create(**question_data)
        question.save()

    def create_questions(self, instance, questions_data):
        for question_data in questions_data:
            question_data["form"] = instance
            self.create_question(question_data)

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')

        form = Form.objects.create(**validated_data)

        self.create_questions(form, questions_data)

        return form

    def update(self, instance, validated_data):
        instance.date = datetime.now()
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        return instance


class RatingSerializer(serializers.ModelSerializer):
    """
    TODO : 
    Validator for rating -> Check field type based on the question
    """

    class Meta:
        model = Rating
        fields = ("id", "course", "question", "value", "date")

    def validate_question(self, question):
        if question.category != 'R':
            raise serializers.ValidationError("Comment must refer to a 'C' category question")

        return question


class CommentSerializer(serializers.ModelSerializer):
    """
    TODO : 
    Validator for rating -> Check field type based on the question
    """

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
