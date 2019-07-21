from django.conf.urls import url, include
from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from repartitions.views import RepartitionsViewSet, RepartitionsCanEdit, RepartitionsChangeVoeux, RepartitionsStartCampaignView, RepartitionsStopCampaignView

urlpatterns = [path('canEdit', RepartitionsCanEdit.as_view(), name="canEdit"),
path('changeVoeux', RepartitionsChangeVoeux.as_view(), name="changeVoeux"), 
path('', RepartitionsViewSet.as_view(), name=""),
path('<int:rid>', RepartitionsViewSet.as_view(), name=""),
path('startCampaign', RepartitionsStartCampaignView.as_view(), name="startCampaign"),
path('stopCampaign', RepartitionsStopCampaignView.as_view(), name="stopCampaign")]