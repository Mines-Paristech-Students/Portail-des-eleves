from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from associations.views import AssociationViewSet, EventViewSet, PageViewSet, MarketplaceViewSet, \
    ProductViewSet, TransactionViewSet, LibraryViewSet, FundingViewSet, BalanceView, LoansViewSet, \
    LoanableViewSet, RoleViewSet, ElectionViewSet, CreateBallotView
from associations.views.filesystem import FileViewSet, FolderViewSet, FileSystemView

urlpatterns = []
router = BulkRouter()

# Associations.
router.register(r'associations', AssociationViewSet)

# Elections.
router.register(r'elections', ElectionViewSet)
urlpatterns.append(path('elections/<slug:election_pk>/vote/', CreateBallotView.as_view(), name='vote'))

# Events.
router.register(r'events', EventViewSet)

# Filesystem.
router.register(r'file', FileViewSet)
router.register(r'folder', FolderViewSet)
urlpatterns.append(path('associations/<slug:association_id>/filesystem/root/', FileSystemView.as_view(),
                        name='file-system'))

# Library.
router.register(r'library', LibraryViewSet)
router.register(r'loans', LoansViewSet)
router.register(r'loanables', LoanableViewSet)

# Marketplace.
router.register(r'marketplace', MarketplaceViewSet)
router.register(r'products', ProductViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'funding', FundingViewSet)
urlpatterns += [
    path('marketplace/balance/', BalanceView.as_view(), name='balance-list'),
    path('marketplace/<slug:marketplace_id>/balance/', BalanceView.as_view(), name='balance-list-marketplace'),
    path('marketplace/<slug:marketplace_id>/balance/<slug:user_id>/', BalanceView.as_view(), name='balance-detail'),
]

# Pages.
router.register(r'pages', PageViewSet)

# Roles.
router.register(r'roles', RoleViewSet)

urlpatterns += router.urls
