from rest_framework.exceptions import ValidationError
from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import User


class ProfileQuestionPermission(BasePermission):
    """
               | Question |
        Admin  | CRUD     |
        Simple | R        |
    """

    message = 'You are not allowed to edit this profile question.'

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_staff


class ProfileAnswerPermission(BasePermission):
    """
               | Own profile | Other profile |
        Admin  | CRUD        | RUD           |
        Simple | CRUD        | R             |
    """

    message = 'You are not allowed to edit this profile answer.'

    def has_permission(self, request, view):
        if request.method in ('POST',):
            user_pk = request.data.get('user', None)
            user_query = User.objects.filter(pk=user_pk)

            if user_query.exists():
                return user_query[0] == request.user
            else:
                raise ValidationError('The specified user does not exist.')

        # Let has_object_permission handle the other request methods.
        return True

    def has_object_permission(self, request, view, answer):
        if request.user.is_staff and request.method not in ('POST',):
            return True

        return request.method in SAFE_METHODS or answer.user == request.user
