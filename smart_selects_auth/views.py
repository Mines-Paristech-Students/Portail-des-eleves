from django.views.decorators.cache import never_cache
from smart_selects import views

from authentication.authentication import JWTCookieAuthentication


@never_cache
def filterchain(request, *args, **kwargs):
    auth = JWTCookieAuthentication()
    auth.authenticate(request)  # Throw exception if user is not authenticated
    return views.filterchain(request, *args, **kwargs)


@never_cache
def filterchain_all(request, *args, **kwargs):
    auth = JWTCookieAuthentication()
    auth.authenticate(request)  # Throw exception if user is not authenticated
    return views.filterchain_all(request, *args, **kwargs)
