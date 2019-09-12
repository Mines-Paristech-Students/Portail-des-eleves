from rest_framework.routers import DefaultRouter

from repartitions.views import CampaignView

"""
Routes (all nested under /api/v1):

- /repartitions
    - POST (admin)
    - GET (everyone), only the ones they can participate to
    
- /repartition/<repartition-id>/
    - PATCH (admin)
    - GET (everyone) only if they can participate to it
    - DELETE (admin)

- /repartition/<repartition-id>/propositions
    - POST (admin)
    - GET (everyone)
    
- /repartition/<repartition-id>/propositions/<proposition-id>
    - PATCH (admin)
    - DELETE (admin)
    
    
- /repartition/<repartition-id>/wishes
    - POST (everyone) post ALL the wishes at once
    - GET (everyone) get the wishes they made
    
- /repartition/<repartition-id>/users
    - GET (everyone)
    - POST (admin) set the category of a user & fix them if necessary
    
- /repartition/<repartition-id>/users/<user-id>
    - DELETE (admin) removes a user from the repartition
    
- /repartition/<repartition-id>/status
    - GET (everyone)
    - PATCH (admin) sets the status of the repartition (closed / open / results)
    
- /repartition/<repartition-id>/results
    - GET (admin) show the results
        
- /repartition/<repartition-id>/results/me
    - GET (everyone) show the result if the status is "results"
        
"""

router = DefaultRouter()
router.register(r'campaigns', CampaignView, basename='campaigns')

urlpatterns = [
] + router.urls
