"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 2.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os
import sys
from datetime import timedelta

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
from os.path import join

import environ

env = environ.Env()
environ.Env.read_env()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG")

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")
CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = ["http://localhost:5000","http://localhost:3000"]

AUTH_USER_MODEL = "authentication.User"

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_extensions",
    "django_filters",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "authentication",
    "associations",
    "polls",
    "subscriptions",
    "tags",
    "repartitions",
    "courses",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "authentication.authentication.JWTCookieAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS": "api.paginator.DefaultResultsSetPagination",
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
        "tags.filters.hidden_tags.HasHiddenTagFilter",
    ),
}

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "backend.wsgi.application"

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("DATABASE_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("DATABASE_NAME", os.path.join(BASE_DIR, "db.sqlite3")),
        "USER": os.environ.get("DATABASE_USER", "user"),
        "PASSWORD": os.environ.get("DATABASE_PASSWORD", "password"),
        "HOST": os.environ.get("DATABASE_HOST", "localhost"),
        "PORT": os.environ.get("DATABASE_PORT", "5432"),
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = "/assets/"
STATIC_ROOT = os.path.join(BASE_DIR,"assets")
STATICFILES_DIRS = (join(BASE_DIR,"medias" ,"assets"),)

USE_DJANGO_JQUERY = True
JQUERY_URL = False

MEDIA_ROOT = join(BASE_DIR,"..", "medias")
MEDIA_URL = "/medias/"

if len(sys.argv) > 1 and sys.argv[1] == "test":
    MEDIA_ROOT = join(MEDIA_ROOT, "tests")

# Customized settings.

SHOW_TO_FIRST_YEAR_STUDENTS = False

# JWT authentication settings.

JWT_AUTH_SETTINGS = {
    # Can be set to False by the tests to bypass the signature verification.
    "VERIFY_SIGNATURE": True,
    # Algorithm.
    # The keys can be generated by following the instructions at
    # https://rietta.com/blog/openssl-generating-rsa-key-from-command/.
    "ALGORITHM": "RS256",
    "PUBLIC_KEY": env.str("JWT_PUBLIC_KEY", multiline=True),
    # GET parameter for the token.
    "GET_PARAMETER": "access",
    # Cookie.
    "ACCESS_TOKEN_COOKIE_NAME": "jwt_access",
    # Life time.
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
    # Claims.
    "AUDIENCE": "portail",
    "ISSUER": "sso_server",  # The allowed issuer.
    "USER_ID_CLAIM_NAME": "user",
}


def is_prod_mode():
    return DEBUG is False

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="https://d5f3cb06dec94abe96e16bf57cd0c812@o417831.ingest.sentry.io/5319435",
    integrations=[DjangoIntegration()],

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)