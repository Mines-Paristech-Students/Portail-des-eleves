from datetime import date

from rest_framework import exceptions, generics, response, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

from tutorings.models import Tutoring, TutorApplication
from tutorings.serializers import WriteTutoringSerializer, AdminTutoringSerializer, ApplyTutorSerializer, \
    ReadOnlyTutoringSerializer, AdminApplyTutorSerializer
from tutorings.permissions import TutoringPermission, ApplyTutorPermission, ApplicationPermission


class TutoringViewSet(viewsets.ModelViewSet):
    queryset = Tutoring.objects.all()
    serializer_class = ReadOnlyTutoringSerializer
    permission_classes = (TutoringPermission,)

    def get_queryset(self):
        if self.request.user.is_staff:
            # Give access to all the tutorings.
            return Tutoring.objects.all()
        else:
            # Give access to all the published tutorings
            return Tutoring.objects.filter(state="ACCEPTED")

    def get_serializer_class(self):
        if self.action in ("list",):
            return ReadOnlyTutoringSerializer
        elif self.action in ("retrieve",):
            if self.request.user.is_staff:
                return AdminTutoringSerializer
            else:
                return ReadOnlyTutoringSerializer
        elif self.action in ("create",):
            return WriteTutoringSerializer
        elif self.action in ("update", "partial_update"):
            if self.request.user.is_staff:
                return AdminTutoringSerializer
            else:
                return ReadOnlyTutoringSerializer
        else:
            return ReadOnlyTutoringSerializer


class CreateApplyTutorView(generics.CreateAPIView):
    queryset = TutorApplication.objects.all()
    serializer_class = ApplyTutorSerializer
    permission_classes = (ApplyTutorPermission,)

    def get_tutoring_or_404(self, **kwargs):
        request_tutoring = Tutoring.objects.filter(pk=kwargs.get("tutoring_pk"))

        if not request_tutoring.exists():
            raise exceptions.NotFound("Tutoring not found.")

        return request_tutoring[0]

    def create(self, request, *args, **kwargs):
        tutoring = self.get_tutoring_or_404(**kwargs)
        # Serialize the data.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if the tutorings is active.
        if not tutoring.is_active:
            raise exceptions.PermissionDenied("This tutoring is not active.")

        # Check if the tutorings is assigned.
        if tutoring.is_assigned:
            raise exceptions.PermissionDenied("This tutoring is already assigned.")

        # Check if the user has already applied.
        if request.user.id in [
            applicant[0] for applicant in tutoring.applications.values_list("user__id")
        ]:
            raise exceptions.PermissionDenied("You have already applied.")

        # Save the object.
        serializer.save(tutoring=tutoring)
        headers = self.get_success_headers(serializer.data)

        return response.Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def update(self, request, *args, **kwargs):
        tutoring = self.get_tutoring_or_404(**kwargs)

        if request.user.is_staff:
            serializer = AdminApplyTutorSerializer(data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

        else:
            raise exceptions.PermissionDenied("You cannot update this application")
        serializer.save(tutoring=tutoring)
        headers = self.get_success_headers(serializer.data)

        return response.Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class OfferTutoringView(generics.CreateAPIView):
    queryset = Tutoring.objects.all()
    serializer_class = WriteTutoringSerializer
    permission_classes = ()
    authentication_classes = ()


class AssignTutoringView(generics.UpdateAPIView):
    queryset = TutorApplication.objects.all()
    serializer_class = AdminApplyTutorSerializer
    permission_classes = (TutoringPermission,)

    def get_tutoring_or_404(self, **kwargs):
        request_tutoring = Tutoring.objects.filter(pk=kwargs.get("tutoring_pk"))

        if not request_tutoring.exists():
            raise exceptions.NotFound("Tutoring not found.")

        return request_tutoring[0]

    def update(self, request, *args, **kwargs):
        tutoring = self.get_tutoring_or_404(**kwargs)

        if request.user.is_staff:
            serializer = self.get_serializer(data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

        else:
            raise exceptions.PermissionDenied("You cannot update this application")
        serializer.save(tutoring=tutoring)

        return response.Response(
            serializer.data, status=status.HTTP_200_OK,
        )
