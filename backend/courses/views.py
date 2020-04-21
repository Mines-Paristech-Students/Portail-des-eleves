from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse


from rest_framework import views
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework import viewsets

from courses.serializers import *
from courses.models import *

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()