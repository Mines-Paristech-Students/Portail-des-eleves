from django.core.exceptions import ObjectDoesNotExist


class BrokenTagLink(ObjectDoesNotExist):
    def __init__(self):
        super(BrokenTagLink, self).__init__(
            "A tag was linked to an object which does not exist."
        )
