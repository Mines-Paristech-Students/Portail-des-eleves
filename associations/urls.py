from django.urls import path

from rest_framework_bulk.routes import BulkRouter
from rest_framework_nested import routers

from associations.views import AssociationViewSet, EventViewSet, PageViewSet, MarketplaceViewSet, \
    ProductViewSet, TransactionViewSet, LibraryViewSet, FundingViewSet, BalanceView, LoansViewSet, \
    LoanableViewSet, RoleViewSet, NewsAssociationViewSet, NewsSubscriptionsViewSet, ElectionViewSet
from associations.views.filesystem import FileViewSet, FolderViewSet, FileSystemView

router = BulkRouter()

router.register(r'associations', AssociationViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'marketplace', MarketplaceViewSet)
router.register(r'products', ProductViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'library', LibraryViewSet)
router.register(r'loans', LoansViewSet)
router.register(r'loanables', LoanableViewSet)
router.register(r'funding', FundingViewSet)
router.register(r'file', FileViewSet)
router.register(r'folder', FolderViewSet)

associations_router = routers.NestedSimpleRouter(router, r'associations', lookup='association')
associations_router.register(r'elections', ElectionViewSet)
associations_router.register(r'events', EventViewSet)
associations_router.register(r'news', NewsAssociationViewSet)
associations_router.register(r'pages', PageViewSet)

urlpatterns = [
    path('news/', NewsSubscriptionsViewSet.as_view()),
    path('associations/<slug:association_id>/filesystem/root/', FileSystemView.as_view(), name='file-system'),
    path('marketplace/balance/', BalanceView.as_view(), name='balance-list'),
    path('marketplace/<slug:marketplace_id>/balance/', BalanceView.as_view(), name='balance-list-marketplace'),
    path('marketplace/<slug:marketplace_id>/balance/<slug:user_id>/', BalanceView.as_view(), name='balance-detail'),
] + router.urls + associations_router.urls

"""
    Endpoints:
        * List:     GET     /associations/bde/elections/
        * Retrieve: GET     /associations/bde/elections/1/
        * Create:   POST    /associations/bde/elections/1/
        * Update:   PATCH   /associations/bde/elections/1/
        * Destroy:  DELETE  /associations/bde/elections/1/
        * Vote:     POST    /associations/bde/elections/1/vote/
        * Results:  GET     /associations/bde/elections/1/results/
"""