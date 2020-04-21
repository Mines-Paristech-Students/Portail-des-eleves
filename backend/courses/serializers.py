from rest_framework import serializers
from datetime import datetime

from courses.models import Course, Form, Question


class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        read_only_fields = ('id', )
        fields = read_only_fields + ("name", "form")


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        read_only_fields = ('id', )
        fields = read_only_fields + ('label', 'required', 'category')


class FormSerializer(serializers.ModelSerializer):
    # Writable nested serializer
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Form
        read_only_fields = ('id', 'date', )
        fields = read_only_fields + ('questions', )

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')

        form = Form.objects.create(**validated_data)

        for question_data in questions_data:
            Question.object.create(form=form, **question_data)

        return form

    def update(self, instance, validated_data):
        instance.date = datetime.now()
        questions = validated_data.get("questions")
        return instance