from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Loanable, Library
from associations.permissions.utils import check_permission_from_post_data


class LibraryPermission(BasePermission):
    """
                      | Enabled | Disabled |
        Library admin | CRUD    | CRUD     |
        User          | R       |          |
    """

    message = 'You are not allowed to edit this library.'

    def has_permission(self, request, view):
        if request.method in ('POST',):
            return check_permission_from_post_data(request, 'library')

        return True

    def has_object_permission(self, request, view, library):
        role = request.user.get_role(library.association)

        if role and role.library:  # Library administrator.
            return True
        else:
            return library.enabled and request.method in SAFE_METHODS


class LoanablePermission(BasePermission):
    """
                      | Enabled | Disabled |
        Library admin | CRUD    | CRUD     |
        User          | R       |          |
    """

    message = 'You are not allowed to edit this loanable.'

    def has_permission(self, request, view):
        if request.method in ('POST',):
            library_pk = request.data.get('library', None)
            library_query = Library.objects.filter(pk=library_pk)

            if library_query.exists():
                role = request.user.get_role(library_query[0].association)
                return role and role.library

        return True

    def has_object_permission(self, request, view, loanable):
        role = request.user.get_role(loanable.library.association)

        if role and role.library:  # Library administrator.
            return True
        else:
            return loanable.library.enabled and request.method in SAFE_METHODS


class LoansPermission(BasePermission):
    """
               | Library enabled | Library disabled |
        Admin  | CRU             | CRU              |
        Simple | CRU             | R                |

        An user can only read and update their own loans in enabled libraries.
    """

    message = 'You are not allowed to edit this loan.'

    def has_permission(self, request, view):
        # Forbid the DELETE method and check the POST method, where we have to go through the POSTed data to find a
        # reference to a Loanable.
        # If the loanable does not exist, return True so the view can handle the error.

        if request.method in ('DELETE',):
            self.message = 'Loans cannot be deleted.'
            return False
        elif request.method in ('POST',):
            loanable_pk = request.data.get('loanable', None)
            loanable_query = Loanable.objects.filter(pk=loanable_pk)

            if loanable_query.exists():
                library = loanable_query[0].library
                role = request.user.get_role(library.association)

                # Either the library is enabled or the user is a library administrator.
                return library.enabled or (role and role.library)

        return True

    def has_object_permission(self, request, view, loan):
        role = request.user.get_role(loan.loanable.library.association)

        if role and role.library:  # Library administrator.
            return True
        else:
            return loan.loanable.library.enabled and loan.user == request.user
