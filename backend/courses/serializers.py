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
        read_only_fields = ('id', )
        fields = read_only_fields + ('form', 'label', 'required', 'archived', 'category')


class FormSerializer(serializers.ModelSerializer):
    # Writable nested serializer
    questions = QuestionSerializer(many=True, required=False)
    courses = CourseSerializer(many=True, required=False)

    class Meta:
        model = Form
        read_only_fields = ('id', 'date', )
        fields = read_only_fields + ('name', 'questions', 'courses')

    def create_questions(self, instance, update_questions):
        for question_data in update_questions:
            question_data["form"] = instance
            question = Question.objects.create(**question_data)
            question.save()

    def create_courses(self, instance, update_courses):
        for course_data in update_courses:
            course_data["form"] = instance
            course = Course.objects.create(**course_data)
            course.save()

    def update_questions(self, instance, update_questions):
        for question_data in update_questions:
            question_data["form"] = instance
            Question.objects.filter(id=question_data["id"]).update(**question_data)
            question.save()

    def update_courses(self, instance, update_courses):
        for course_data in update_courses:
            course_data["form"] = instance
            Course.objects.filter(id=course_data["id"]).update(**course_data)
            course.save()

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        course_data = validated_data.pop('courses')

        form = Form.objects.create(**validated_data)

        self.create_questions(form, questions_data)
        self.create_courses(form, course_data)

        return form

    def update(self, instance, validated_data):
        # Issue with required fields ?
        instance.date = datetime.now()
        questions_data = validated_data.get("questions")
        courses_data = validated_data.pop('courses')

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

        update_courses = []
        create_courses = []

        for course in courses_data:
            course = courses_data[0]
            if course.get('id'):
                update_courses.append(course)
            else:
                create_courses.append(course)

        self.create_courses(instance, create_courses)
        self.update_courses(instance, update_courses)

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
