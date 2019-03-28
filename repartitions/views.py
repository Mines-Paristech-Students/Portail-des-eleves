from django.shortcuts import render
from rest_framework import viewsets, views

from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from repartitions.models import Repartition
from repartitions.serializers import RepartitionSerializer

# Create your views here.

class RepartitionsViewSet(viewsets.ModelViewSet):
	queryset = Repartition.objects.all()
	serializer_class = RepartitionSerializer
	def get_queryset(self):
		queryset = Repartition.objects.all()

		user = self.request.user
		if(user is None) :
			raise PermissionDenied("User is not connected")
		queryset = queryset.filter(promotion = "P"+str(user.promo))
		return queryset