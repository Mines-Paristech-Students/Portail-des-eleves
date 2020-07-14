from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from associations.views import (
    AssociationViewSet,
    EventViewSet,
    PageViewSet,
    MarketplaceViewSet,
    ProductViewSet,
    TransactionViewSet,
    LibraryViewSet,
    FundingViewSet,
    BalanceView,
    LoansViewSet,
    LoanableViewSet,
    RoleViewSet,
)
from associations.views.election import VoterViewSet, ElectionViewSet, ChoiceViewSet
from associations.views.media import MediaViewSet, get_media_uploaded_on_bounds
from associations.views import set_association_logo
from subscriptions.views.widget_balance import widget_balance_view

urlpatterns = []
router = BulkRouter()

# Associations.
router.register(r"associations", AssociationViewSet)

# Elections.
router.register(r"elections", ElectionViewSet)
router.register(r"choices", ChoiceViewSet)
router.register(r"voters", VoterViewSet)

# Events.
router.register(r"events", EventViewSet)

# Medias.
router.register(r"media", MediaViewSet)
urlpatterns += [
    path("media/<association_pk>/upload_bounds", get_media_uploaded_on_bounds)
]

# Library.
router.register(r"library", LibraryViewSet)
router.register(r"loans", LoansViewSet)
router.register(r"loanables", LoanableViewSet)

# Marketplace.
router.register(r"marketplace", MarketplaceViewSet)
router.register(r"products", ProductViewSet)
router.register(r"transactions", TransactionViewSet)
router.register(r"fundings", FundingViewSet)
urlpatterns += [
    path("associations/<association_pk>/image", set_association_logo),
    path("marketplace/balance/", widget_balance_view, name="balance-list"),
    path(
        "marketplace/<slug:marketplace_id>/balance/",
        BalanceView.as_view(),
        name="balance-list-marketplace",
    ),
    path(
        "marketplace/<slug:marketplace_id>/balance/<slug:user_id>/",
        BalanceView.as_view(),
        name="balance-detail",
    ),
]

# Pages.
router.register(r"pages", PageViewSet)

# Roles.
router.register(r"roles", RoleViewSet)

urlpatterns += router.urls
