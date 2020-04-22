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

    def create_questions(self, instance, update_questions):
        for question_data in update_questions:
            question_data["form"] = instance
            Question.objects.create(**question_data)

    def update_questions(self, instance, update_questions):
        for question_data in update_questions:
            question_data["form"] = instance
            Question.objects.filter(id=question_data["id"]).update(**question_data)


    def create(self, validated_data):
        questions_data = validated_data.pop('questions')

        form = Form.objects.create(**validated_data)

        self.create_questions(form, questions_data)

        return form

    def update(self, instance, validated_data):
        # Issue with required fields ?
        instance.date = datetime.now()
        questions_data = validated_data.get("questions")

        update_questions = []
        create_questions = []

        for question in questions_data:
            question = questions_data[0]
            if question.get('id'):
                update_questions.append(question)
            else:
                create_questions.append(question)

        self.create_questions(instance, create_questions)
        self.update_questions(instance, update_questions) 
        return instance