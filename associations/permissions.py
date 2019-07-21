from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Association, Library, Marketplace, News, Page, Role, Order, Product, Folder, File


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


class CanEditFiles(BasePermission):
    message = 'Editing files is not allowed.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == 'CREATE':
            if 'association' in request.data:
                association = request.data['association']
            else:
                return False

            role = _get_role_for_user(request.user, association)

            if not role:
                return False

            return role.files

        return True

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        association = None
        if isinstance(obj, File):
            association = obj.association
        elif isinstance(obj, Folder):
            association = obj.association
        else:
            return True

        role = _get_role_for_user(request.user, association)

        if not role or association is None:
            return False

        return role.files


class IsAssociationMember(BasePermission):
    message = "Editing association is not allowed."

    def has_permission(self, request, view):

        if request.method in SAFE_METHODS:
            return True

        user_id = getattr(request.user, 'id')
        association_id = request.data.get('association', None)

        if association_id is not None:
            role = _get_role_for_user(user_id, association_id)
            return role is not None

        return bool(request.user) and bool(request.user.is_authenticated) and bool(request.user.is_admin) and bool(
            request.user.is_staff)

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        if not self.has_permission(request, view):
            return False

        role = False

        if isinstance(obj, Association):
            role = _get_role_for_user(request.user, obj)
        elif isinstance(obj, Library):
            return True
            role = _get_role_for_user(request.user, obj)
        elif isinstance(obj, Marketplace):
            return True
            role = _get_role_for_user(request.user, obj)
        elif isinstance(obj, Role):
            return True
            role = _get_role_for_user(request.user, obj.association)
        elif isinstance(obj, Order):
            return True
            role = _get_role_for_user(request.user, obj.product.marketplace.association)
        elif isinstance(obj, Product):
            return True
            role = _get_role_for_user(request.user, obj.marketplace.association)

        return bool(role)
