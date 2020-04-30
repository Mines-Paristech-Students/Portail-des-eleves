from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class DefaultResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response(
            {
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "results": data,
            }
        )


class SmallResultsSetPagination(DefaultResultsSetPagination):
    page_size = 10
    max_page_size = 100
