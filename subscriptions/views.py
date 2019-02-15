
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from associations.models import Association
from subscriptions.models import Widget, WidgetSubscription, AssociationSubscription

@api_view(['GET'])
def get_widgets(request):
    widgets = Widget.objects.all()
    ws = WidgetSubscription.objects.filter(user=request.user)

    returned_dict = {
        "widgets": []
    }
    for w in widgets:
        try:
            displayed = ws.get(widget=w).displayed
        except WidgetSubscription.DoesNotExist:
            displayed = True
        finally:
            returned_dict['widgets'].append({
                'name': w.name,
                'displayed': displayed
            })

    return Response(returned_dict)

@api_view(['GET'])
def get_associations(request):
    associations = Association.objects.all()
    ass_s = AssociationSubscription.objects.filter(user=request.user)

    returned_dict = {
        "associations": []
    }
    for ass in associations:
        try:
            subscribed = ass_s.get(association=ass).subscribed
        except AssociationSubscription.DoesNotExist:
            subscribed = True
        finally:
            returned_dict['associations'].append({
                'name': ass.id,
                'displayed_name': ass.name,
                'subscribed': subscribed
            })

    return Response(returned_dict)

@api_view(['POST'])
def set_subscriptions(request):
    associations = request.data.get('associations')
    widgets = request.data.get('widgets')
    if not (isinstance(associations, list) and isinstance(widgets, list)):
        raise ValidationError("widgets and associations are required as list")

    for ass in associations:
        if not isinstance(ass, dict) or 'name' not in ass or 'subscribed' not in ass:
            raise ValidationError("Association %s must be a dict with keys 'name' and 'subscribed' " % ass)
        if not Association.objects.filter(id=ass['name']).exists():
            raise ValidationError("Association %s does not exist" % ass['name'])

    for widg in widgets:
        if not isinstance(widg, dict) or 'name' not in widg or 'displayed' not in widg:
            raise ValidationError("Widget %s must be a dict with keys 'name' and 'displayed'" % widg)
        if not Widget.objects.filter(name=widg['name']).exists():
            raise ValidationError("Widget %s does not exist" % widg['name'])

    # Validation is now over

    for ass in associations:
        a, created = AssociationSubscription.objects.get_or_create(
            user=request.user,
            association=Association(id=ass['name']),
            defaults={'subscribed': ass['subscribed']}
        )
        if not created:
            a.subscribed = ass['subscribed']
            a.save()

    for widg in widgets:
        print(widg)
        w, created = WidgetSubscription.objects.get_or_create(
            user=request.user,
            widget=Widget(name=widg['name']),
            defaults={'displayed': widg['displayed']}
        )
        if not created:
            w.displayed = widg['displayed']
            w.save()

    return Response()
