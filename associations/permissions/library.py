from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Association, Library, Loan, Loanable
from associations.permissions.base_permissions import extract_id


def get_library(request):
    """
        Parse the URL and the POST data to get the library related to the request.\n
        For instance, when GETting loanables/5/, the method will return the library of the loanable which ID is 5.\n
        Or, if POSTing data to library/ (to create a new library), the method will return the content of the id field
        of the posted data.
    """
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


class LoansPermission(BasePermission):
    """
               | Enabled | Disabled | Not found |\n
        Admin  | CRU     | CRU      | R         |\n
        Simple | CRU     | R        | R         |
    """

    message = 'You are not allowed to edit this loan.'

    def has_permission(self, request, view):
        if request.method in ('DELETE',):
            self.message = 'Loans cannot be deleted.'
            return False

        library = get_library(request)
        if not library:
            # If the library could not be found, give access to the safe methods.
            if request.method in SAFE_METHODS:
                return True
        else:
            role = request.user.get_role(library.association)

            if role and role.library:
                # Library administrator.
                return True
            else:
                if library.enabled:
                    return True
                else:
                    return request.method in SAFE_METHODS

        return False


class IfLibraryAdminThenCRUDElseR(BasePermission):
    """
        Every user has the read permission.\n
        An user has the CRUD permissions iff the user is a library administrator of the edited library.
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
                role = request.user.get_role(request.data['association'])
        else:
            library = get_library(request)

            if library:
                role = request.user.get_role(library.association)

        if role is not None:
            return role.library

        return False


class IfLibraryEnabledThenCRUDElseLibraryAdminOnlyCRUD(BasePermission):
    """
        If the library is enabled, every user has every permission.\n
        If the library is disabled, an user has the write permission iff the user is a library administrator of the
        edited library.
    """
    message = 'You are not allowed to view this library because it is disabled.'

    def has_permission(self, request, view):
        library_in_path = get_library(request)  # Refactor: what we really want is the role.

        if library_in_path:
            if library_in_path.enabled:
                return True
            else:
                role = request.user.get_role(pk=library_in_path.association.id)
                if role is not None:
                    return role.library
        else:
            # There was no library ID in the path. We have to look somewhere else.
            if 'library' in request.path and request.method == 'POST':
                if 'association' in request.data:
                    role = request.user.get_role(request.data['association'])
                    if role is not None:
                        return role.library

            # The library could not be found. Thus, if the method is safe, give the permission.
            if request.method in SAFE_METHODS:
                return True
        return False
