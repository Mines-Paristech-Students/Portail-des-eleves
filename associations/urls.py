from django.urls import path

from rest_framework_bulk.routes import BulkRouter

from associations.views import AssociationViewSet, PageViewSet, NewsViewSet, MarketplaceViewSet, \
    ProductViewSet, TransactionViewSet, LibraryViewSet, FundingViewSet, BalanceView, LoansViewSet, \
    LoanableViewSet, RoleViewSet
from associations.views.filesystem import FileViewSet, FolderViewSet, FileSystemView

router = BulkRouter()

router.register(r'associations', AssociationViewSet)
router.register(r'pages', PageViewSet)
router.register(r'news', NewsViewSet)
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

urlpatterns = [
    path('associations/<slug:association_id>/filesystem/root/', FileSystemView.as_view(), name='file-system'),
    path('marketplace/balance/', BalanceView.as_view(), name='balance-list'),
    path('marketplace/<slug:marketplace_id>/balance/', BalanceView.as_view(), name='balance-list-marketplace'),
    path('marketplace/<slug:marketplace_id>/balance/<slug:user_id>/', BalanceView.as_view(), name='balance-detail'),
] + router.urls
