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

    def create_questions(self, instance, update_questions):
        for question_data in update_questions:
            question_data["form"] = instance
            question = Question.objects.create(**question_data)
            question.save()

    def update_questions(self, instance, update_questions):
        for question_data in update_questions:
            question_data["form"] = instance
            question = Question.objects.get(
                    pk=question_data["id"], 
                    form__pk=question_data["form"]
                )
            question.label = question_data["label"]
            question.save()

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')

        form = Form.objects.create(**validated_data)

        self.create_questions(form, questions_data)

        return form

    def update(self, instance, validated_data):
        """
        Because of issues with nested representations
        * Questions can not be updated with that function
        * The logic is moved to the view itself
        """
        # Issue with required fields ?
        instance.date = datetime.now()
        questions_data = validated_data.get("questions")

        update_questions = []
        create_questions = []

        for question in questions_data:
            print(question.keys())
            assert(question.pop('label'))
            if question.get("id"):
                question.pop("category")
                update_questions.append(question)
            else:
                create_questions.append(question)

        self.create_questions(instance, create_questions)
        self.update_questions(instance, update_questions)

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
        read_only_fields = ("id", )
        fields = read_only_fields + ('value', )
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Rating.objects.all(),
                fields=['question', 'course']
            )
        ]

    def validate(self, data):
        """Check that the answer type is correct"""
        super(serializers.ModelSerializer, self).validate(data)

        if not Question.objects.filter(id=data["question"]).category == 'R':
            raise serializers.ValidationError("Rating must refer to a 'R' category question")


class CommentSerializer(serializers.ModelSerializer):
    """
    TODO : 
    Validator for rating -> Check field type based on the question
    """

    class Meta:
        model = Comment
        read_only_fields = ("id", )
        fields = read_only_fields + ('content', )
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Comment.objects.all(),
                fields=['question', 'course']
            )
        ]

    def validate(self, data):
        """Check that the answer type is correct"""
        super(serializers.ModelSerializer, self).validate(data)

        if not Question.objects.filter(id=data["question"]).category == 'C':
            raise serializers.ValidationError("Comment must refer to a 'C' category question")


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
