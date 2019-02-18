from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Association, Library, Marketplace, News, Page, Role, Order, Product

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

class IsAssociationMember(BasePermission):

    message = "Editing association is not allowed."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_admin and request.user.is_staff)

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if not self.has_permission(request, view):
            return False

        if isinstance(obj, Association):
            role = _get_role_for_user(request.user, obj)
        elif isinstance(obj, Library):
            import pdb; pdb.set_trace()
            role = _get_role_for_user(request.user, obj)
        elif isinstance(obj, Marketplace):
            import pdb; pdb.set_trace()
            role = _get_role_for_user(request.user, obj)
        elif isinstance(obj, Role):
            role = _get_role_for_user(request.user, obj.association)
        elif isinstance(obj, Order):
            role = _get_role_for_user(request.user, obj.product.marketplace.association)
        elif isinstance(obj, Product):
            role = _get_role_for_user(request.user, obj.marketplace.association)
        else:
            import pdb; pdb.set_trace()
        return bool(role)
