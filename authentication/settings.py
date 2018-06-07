from __future__ import unicode_literals

from datetime import timedelta

from django.conf import settings
from django.test.signals import setting_changed
from rest_framework.settings import APISettings

USER_SETTINGS = getattr(settings, 'JWT_AUTH', None)

DEFAULTS = {
    'ACCESS_TOKEN_COOKIE_NAME': 'jwt_access_token',
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'ALGORITHM': 'HS256',
    'SECRET_KEY': settings.SECRET_KEY,
    'USER_ID_CLAIM': 'user',
    'USER_ID_FIELD': 'pseudo',
}

api_settings = APISettings(USER_SETTINGS, DEFAULTS)


def reload_api_settings(*args, **kwargs):
    global api_settings

    setting, value = kwargs['setting'], kwargs['value']

    if setting == 'SIMPLE_JWT':
        api_settings = APISettings(value, DEFAULTS)


setting_changed.connect(reload_api_settings)
