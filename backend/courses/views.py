from django.http import Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import status

from courses.models import Course
from courses.serializers import CourseSerializer


class CourseList(APIView):
    """
    List all courses, or create a new course
    """

    def get(self, request, format=None):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Reponse(serializer.data)

    def post(self, request, format=None):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Reponse(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseDetail(APIView):
    """
    Retrive, update or delete a course instance
    """

    def get_object(self, pk):
        try: 
            return Course.objects.get(pk)
        except Course.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        course = self.get_object(pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        course = self.get_object(pk)
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            Response(serializer.data)
        Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        course = self.get_object(pk)
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)