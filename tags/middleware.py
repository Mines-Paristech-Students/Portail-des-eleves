from django.contrib.auth.middleware import get_user
from django.db.models import Q
from rest_framework.request import Request

from authentication.authentication import JWTCookieAuthentication
from tags.models import Tag


def get_user_jwt(request):
    user = get_user(request)
    if user.is_authenticated:
        return user
    try:
        user_jwt = JWTCookieAuthentication().authenticate(Request(request))
        if user_jwt is not None:
            return user_jwt[0]
    except:
        pass
    print(user)
    return user


class InjectTagFilteringMiddleware:
    hiding_conditions = {
        "association": {"tags__is_hidden": True},
        "event": Q(tags__is_hidden=True) | Q(association__tags__is_hidden=True),
        "file": Q(tags__is_hidden=True)
        | Q(inherited_tags__is_hidden=True)
        | Q(association__tags__is_hidden=True),
        "folder": Q(tags__is_hidden=True)
        | Q(inherited_tags__is_hidden=True)
        | Q(association__tags__is_hidden=True),
        "loanable": Q(tags__is_hidden=True) | Q(library__tags__is_hidden=True),
        "page": Q(tags__is_hidden=True) | Q(association__tags__is_hidden=True),
        "product": Q(tags__is_hidden=True) | Q(association__tags__is_hidden=True),
        "role": Q(tags__is_hidden=True) | Q(association__tags__is_hidden=True),
        # Forum
        "theme": {"tags__is_hidden": True},
        "topic": Q(tags__is_hidden=True) | Q(topic__tags__is_hidden=True),
        "message_forum": Q(tags__is_hidden=True)
        | Q(topic__tags__is_hidden=True)
        | Q(topic__theme__tags__is_hidden=True),
    }

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = get_user_jwt(request)

        if user and user.is_authenticated and not user.show:
            for (model_name, model) in Tag.LINKS.items():
                hiding_condition = self.hiding_conditions[model_name]
                hiding_condition = (
                    Q(**hiding_condition)
                    if not isinstance(hiding_condition, Q)
                    else hiding_condition
                )

                print(model)
                model.objects = model.objects.filter(
                    Q(tags__is_hidden=True) | hiding_condition
                )

            Tag.objects = Tag.objects.filter(is_hidden=True)

        response = self.get_response(request)
        return response
