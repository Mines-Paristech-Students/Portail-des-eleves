from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import News, Page, Role

def _get_role_for_user(user, association):
    qs = Role.objects.filter(user=user, association=association)
    if qs.exists():
        return qs[0]
    return None


class CanEditStaticPage(BasePermission):

    message = 'Editing static page is not allowed.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == 'DELETE':
            page_id = view.kwargs.get('pk', -1)
            try:
                page = Page.objects.get(pk=page_id)
            except Page.DoesNotExist:
                # Let it fail with a Page Not Found Error later
                return True

            asso = page.association
        else:
            try:
                asso = request.data['association']
            except KeyError:
                return False

        role = _get_role_for_user(request.user, asso)
        if not role:
            return False
        return role.static_page

class CanEditNews(BasePermission):

    message = 'Editing news is not allowed.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == 'DELETE':
            news_id = view.kwargs.get('pk', -1)
            try:
                news = News.objects.get(pk=news_id)
            except News.DoesNotExist:
                # Let it fail with a Page Not Found Error later
                return True

            asso = news.association
        else:
            try:
                asso = request.data['association']
            except KeyError:
                return False

        role = _get_role_for_user(request.user, asso)
        if not role:
            return False
        return role.news
