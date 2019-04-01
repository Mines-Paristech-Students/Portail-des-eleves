from django.shortcuts import render
from rest_framework import viewsets, views, generics

from rest_framework import permissions, status
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied
from repartitions.models import Repartition
from repartitions.serializers import RepartitionSerializer
from authentication.authentication import JWTCookieAuthentication
from backend import settings

class RepartitionsViewSet(viewsets.ModelViewSet):
	queryset = Repartition.objects.all()
	serializer_class = RepartitionSerializer
	authentication_classes = [JWTCookieAuthentication]

	def get_queryset(self):
		queryset = Repartition.objects.all()

		user = self.request.user
		if not user.is_admin:
			queryset = queryset.filter(status__gt = 0)
		queryset = queryset.filter(promotion = "P"+str(user.promo))
		return queryset

class RepartitionsCanEdit(generics.GenericAPIView):
	is_prod_mode = settings.is_prod_mode()
	authentication_classes = [JWTCookieAuthentication]
	
	def get(self, request, *args, **kwargs):
		return Response(self.request.user.is_admin,status=status.HTTP_200_OK)