from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from associations.models import Group
from associations.models.association import Association
from associations.serializers import AssociationsShortSerializer, AssociationsSerializer, GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get_queryset(self):
        queryset = Group.objects.all()
        association_name = self.request.query_params.get('association', None)
        if association_name is not None:
            queryset = queryset.filter(association=association_name)
        return queryset

    @action(detail=False, methods=['post', 'patch'])
    def batch_add_update(self, request):
        try:
            groups_data = request.data.pop('groups')
        except KeyError:
            raise ValidationError("Field groups is missing")
        if not isinstance(groups_data, list):
            raise ValidationError("Field groups must be a list")
        try:
            association_pk = request.data.pop('association')
        except KeyError:
            raise ValidationError("Field association is missing")

        try:
            association = Association.objects.get(pk=association_pk)
        except Association.DoesNotExist:
            raise ValidationError("Assocation '{}' does not exist".format(association_pk))

        groups_id_to_add_or_update = set()
        for group_data in groups_data:
            try:
                group = Group.objects.get(pk=group_data.pop("id"))
            except (KeyError, Group.DoesNotExist):
                group = None

            if group is None:
                # Creating a new group
                group_serializer = GroupSerializer(data=group_data)
                group_serializer.is_valid(raise_exception=True)
                new_group = group_serializer.create(group_data)
                groups_id_to_add_or_update.add(new_group.id)
                association.groups.add(new_group)
            else:
                # Updating an existing group
                group_serializer = GroupSerializer(group, data=group_data)
                group_serializer.is_valid(raise_exception=True)
                group_serializer.save()
                groups_id_to_add_or_update.add(group.id)



        for group in association.groups.all():
            if group.id not in groups_id_to_add_or_update:
                group.delete() # Removes the group from the DB and the cascade will remove it from the association

        association_serializer = AssociationsSerializer(association)

        return Response(association_serializer.data)


class AssociationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows association to be viewed or edited.
    """
    queryset = Association.objects.all()
    serializer_class = AssociationsSerializer

    action_serializers = {
        'retrieve': AssociationsSerializer,
        'list': AssociationsShortSerializer,
    }

    def get_serializer_class(self):

        if hasattr(self, 'action_serializers'):
            if self.action in self.action_serializers:
                return self.action_serializers[self.action]

        return super(AssociationViewSet, self).get_serializer_class()
