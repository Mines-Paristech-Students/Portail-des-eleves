import re

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Association, Library, Marketplace, News, Page, Role, Order, Product, Folder, File, Loan, \
    Loanable


def _get_role_for_user(user, association):
    qs = Role.objects.filter(user=user, association=association)
    if qs.exists():
        return qs[0]
    return None


def extract_id(base, string):
    """
        Extracts the characters between the two slashes (/) following base in string.
        :return the id if found, None otherwise.
    """
    # +* is not greedy.
    match = re.search(f'{base}/(.+?)/', string)

    if match:
        return match.group(1)

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


class CanManageMarketplace(BasePermission):
    message = 'Marketplace management is not allowed.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == 'CREATE':
            if 'marketplace' in request.data:
                org_id = request.data['marketplace']
            elif 'association' in request.data:
                org_id = request.data["association"]
            else:
                return False

            role = _get_role_for_user(request.user, org_id)
            if not role:
                return False
            return role.marketplace or role.is_admin

        return False

    def has_object_permission(self, request, view, obj):

        if isinstance(obj, Marketplace):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.id)
        elif isinstance(obj, Order):
            raise Exception(obj, request)
            if obj.buyer == request.user and request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.product.marketplace.id)
        elif isinstance(obj, Product):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.marketplace.id)
        else:
            raise Exception("Object {} is not supported (yet)".format(obj.__class__))

        if not role:
            return False

        return role.marketplace or role.is_admin


class OrderPermission(BasePermission):
    message = 'You cannot act on this order.'

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Marketplace):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.id)
        elif isinstance(obj, Order):
            if obj.buyer == request.user and request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.product.marketplace.id)
        elif isinstance(obj, Product):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.marketplace.id)
        else:
            raise Exception("Object {} is not supported (yet)".format(obj.__class__))

        if not role:
            return False

        return role.marketplace or role.is_admin


class CanManageLibrary(BasePermission):
    message = 'Library management is not allowed.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == 'CREATE':
            if 'library' in request.data:
                org_id = request.data['library']
            elif 'association' in request.data:
                org_id = request.data["association"]
            else:
                return False

            role = _get_role_for_user(request.user, org_id)

            if not role:
                return False

            return role.library or role.is_admin

        return True

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Library):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.association.id)
        elif isinstance(obj, Loan):
            if obj.user == request.user and request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.loanable.library.id)
        elif isinstance(obj, Loanable):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.library.association.id)
        else:
            raise Exception("Object {} is not supported (yet)".format(obj.__class__))

        if not role:
            return False

        return role.library or role.is_admin


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


class IsAssociationAdminOrReadOnly(BasePermission):
    """
    Every user has the read permission.\n
    An user has the write permission iff the user is an administrator of the edited association. The edited association
    is inferred from either an 'association' field in request.data or the content of request.path.
    """

    message = 'You are not allowed to edit this association because you are not an administrator of this association.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.user is not None:
            association_id = None

            # The case of 'roles/' is an exception.
            if 'roles' in request.path:
                role_id = extract_id('roles', request.path)
                if role_id:
                    association_id = Role.objects.get(id=role_id).association
            elif 'associations' in request.path:
                association_id = extract_id('associations', request.path)
            elif 'association' in request.data:
                association_id = request.data['association']

            if association_id is not None:
                try:
                    association = Association.objects.get(id=association_id)
                    role = request.user.get_role(association)
                    if role is not None:
                        return role.is_admin
                except ObjectDoesNotExist:
                    pass

        return False


class LibraryPermission(BasePermission):
    def get_library(self, request):
        if request.user is not None:
            library_id = None

            try:
                if 'library' in request.data:
                    library_id = request.data['library']

                if 'loanable' in request.data:
                    library_id = Loanable.objects.get(id=request.data['loanable']).library.id

                if 'loans' in request.path:
                    loan_id = extract_id('loans', request.path)
                    if loan_id:
                        library_id = Loan.objects.get(id=loan_id).loanable.library.id

                if 'loanables' in request.path:
                    loanable_id = extract_id('loanables', request.path)
                    if loanable_id:
                        library_id = Loanable.objects.get(id=loanable_id).library.id

                if 'library' in request.path:
                    library_id = extract_id('library', request.path)
            except ObjectDoesNotExist:
                pass

            if library_id is not None:
                library = None

                try:
                    library = Library.objects.get(id=library_id)
                except ObjectDoesNotExist:
                    pass

                return library

        return None


class IsLibraryAdminOrReadPostPatchOnly(LibraryPermission):
    message = 'You are not allowed to edit this library because you are not an administrator of this library.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.method in ('POST', 'PATCH'):
            return True

        return IsLibraryAdminOrReadOnly().has_permission(request, view)


class IsLibraryAdminOrReadOnly(LibraryPermission):
    """
        Every user has the read permission.\n
        An user has the write permission iff the user is a library administrator of the edited library.
        The edited library is inferred from either a 'library' field in request.data or the content of request.path.
    """

    message = 'You are not allowed to edit this library because you are not an administrator of this library.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        role = None

        # Tricky case: when one creates a new library. In that case, the library object does not exist yet. We have to
        # use an association parameter to check the roles.
        if 'library' in request.path and request.method == 'POST':
            if 'association' in request.data:
                role = request.user.get_role(Association.objects.get(pk=request.data['association']))
        else:
            library = self.get_library(request)

            if library:
                role = request.user.get_role(library.association)

        if role is not None:
            return role.library

        return False


class IsLibraryEnabledOrLibraryAdminOnly(LibraryPermission):
    """
        If the library is enabled, every user has every permission.\n
        If the library is disabled, an user has the write permission iff the user is a library administrator of the
        edited library.
        The edited library is inferred from either a 'library' field in request.data or the content of request.path.
    """
    message = 'You are not allowed to view this library because it is disabled.'

    def has_permission(self, request, view):
        library_in_path = self.get_library(request)  # Refactor: what we really want is the role.

        if library_in_path:
            if library_in_path.enabled:
                return True
            else:
                role = request.user.get_role(Association.objects.get(pk=library_in_path.association.id))
                if role is not None:
                    return role.library
        else:
            # There was no library ID in the path. We have to look somewhere else.
            if 'library' in request.path and request.method == 'POST':
                if 'association' in request.data:
                    role = request.user.get_role(Association.objects.get(pk=request.data['association']))
                    if role is not None:
                        return role.library

            # The library could not be found. Thus, if the method is safe, give the permission.
            if request.method in SAFE_METHODS:
                return True
        return False
