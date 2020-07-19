from django.urls import path

from tutorings.views import TutoringViewSet, CreateApplyTutorView, OfferTutoringView, AssignTutoringView

from rest_framework_bulk.routes import BulkRouter

router = BulkRouter()
router.register(r"", TutoringViewSet)
urlpatterns = [
               path("<int:tutoring_pk>/applytutor/", CreateApplyTutorView.as_view(), name="applytutor"),
               path("offer/", OfferTutoringView.as_view(), name="tutoringsoffer"),
               path("<int:tutoring_pk>/applications/", AssignTutoringView.as_view(), name="tutoringapplications"),

               ] + router.urls
