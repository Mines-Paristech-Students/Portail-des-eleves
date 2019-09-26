from django.core.exceptions import ObjectDoesNotExist


class BrokenTagLink(ObjectDoesNotExist):
    """ A tag is linked to an object that does not exist """

    pass
