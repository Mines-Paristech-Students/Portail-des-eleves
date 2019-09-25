from rest_framework.exceptions import NotFound, ValidationError

from associations.models import Association, Role


def check_permission_from_post_data(request, permission_name, allow_staff=False):
    """This function looks into `request.data` if an 'association' field is present. If so, it returns True iff
    `request.user` has the requested permission in the related association. The global administrators can be allowed
    if the corresponding parameter is set to True.

    The function raises a 400 if the association field is not present, and a 404 if the requested association does
    not exist."""

    if permission_name not in Role.PERMISSION_NAMES:
        raise ValueError(f'The requested permission {permission_name} does not exist.')

    association_id = request.data.get('association', None)

    if association_id is None:
        raise ValidationError('The `association` field was not found in the POST data.')

    association_query = Association.objects.filter(pk=association_id)

    if association_query.exists():
        role = request.user.get_role(association_query[0])
        return (role and getattr(role, permission_name)) or (allow_staff and request.user.is_staff)

    raise NotFound(f'The Association {association_id} does not exist.')
