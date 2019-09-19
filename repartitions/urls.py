from django.urls import path
from rest_framework_extensions.routers import ExtendedSimpleRouter

from repartitions.views import CampaignView, UserCampaignView, WishesView, get_campaign_results, get_my_campaign_results

"""
Routes (all nested under /api/v1):

- /repartition/campaigns
    - POST (admin)
    - GET (everyone), only the ones they can participate to
    
- /repartition/campaigns/<campaign-id>/
    - PATCH (admin)
    - GET (everyone) only if they can participate to it
    - DELETE (admin)

- /repartition/<campaign-id>/propositions
    - POST (admin)
    - GET (everyone)
    
- /repartition/<campaign-id>/propositions/<proposition-id>
    - PATCH (admin)
    - DELETE (admin)
    
    
- /repartition/<campaign-id>/wishes
    - POST (everyone) post ALL the wishes at once
    - GET (everyone) get the wishes they made
    
- /repartition/<campaign-id>/users
    - GET (everyone)
    - POST (admin) set the category of a user & fix them if necessary
    
- /repartition/<campaign-id>/users/<user-id>
    - DELETE (admin) removes a user from the repartition
    
- /repartition/<campaign-id>/status
    - GET (everyone)
    - PATCH (admin) sets the status of the repartition (closed / open / results)
    
- /repartition/<campaign-id>/results
    - GET (admin) show the results
        
- /repartition/<campaign-id>/results/me
    - GET (everyone) show the result if the status is "results"
        
"""

router = ExtendedSimpleRouter()
router \
    .register(r'campaigns', CampaignView, basename='campaigns') \
    .register(r'users', UserCampaignView, basename='users', parents_query_lookups=['campaign'])

urlpatterns = [
  path('<int:campaign_id>/wishes/', WishesView.as_view()),
  path('<int:campaign_id>/results/', get_campaign_results),
  path('<int:campaign_id>/results/me', get_my_campaign_results)
] + router.urls
