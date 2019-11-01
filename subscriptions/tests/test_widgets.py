import datetime

from django.db.models import Count, Q

from associations.models import Election, Event, Library, Marketplace, Page
from associations.views.marketplace import compute_balance, BalanceView
from authentication.views import get_birthdays
from backend.tests_utils import WeakAuthenticationBaseTestCase

ALL_USERS = ["17simple", "18simple", "17admin"]
"""A list of user ids covering all the spectrum of roles and permissions."""


class BaseWidgetsTestCase(WeakAuthenticationBaseTestCase):
    # TODO: maybe fixtures are a bad approach because of pk collisions and it would be better to dynamically generate
    # these.
    # Or, create a "giant" fixture which would contain everything without collisions.
    fixtures = [
        "test_authentication.yaml",
        "test_marketplace.yaml",
        "test_birthdays.json",
        "test_library.yaml",
        "test_polls.yaml",
        "test_repartition_api.yaml",
        #        "test_event.yaml",
        "test_page.yaml",
        "test_election.yaml",
    ]

    def endpoint_list_widgets(self):
        return f"/subscriptions/"

    def list_widgets(self):
        return self.get(self.endpoint_list_widgets())

    def endpoint_balance(self):
        return f"/subscriptions/balance/"

    def balance_widget(self):
        return self.get(self.endpoint_balance())

    def endpoint_birthday(self):
        return f"/subscriptions/birthday/"

    def birthday_widget(self):
        return self.get(self.endpoint_birthday())

    def endpoint_library(self, library_id):
        return f"/subscriptions/library/{library_id}/"

    def endpoint_library_bd_tek(self):
        return self.endpoint_library("bd-tek")

    def library_widget(self, library_id):
        return self.get(self.endpoint_library(library_id))

    def library_bd_tek_widget(self):
        return self.library_widget("bd-tek")

    def endpoint_marketplace(self, marketplace_id):
        return f"/subscriptions/marketplace/{marketplace_id}/"

    def endpoint_marketplace_pdm(self):
        return self.endpoint_marketplace("pdm")

    def marketplace_widget(self, marketplace_id):
        return self.get(self.endpoint_marketplace(marketplace_id))

    def marketplace_pdm_widget(self):
        return self.marketplace_widget("pdm")

    def endpoint_poll(self):
        return f"/subscriptions/poll/"

    def poll_widget(self):
        return self.get(self.endpoint_poll())

    def endpoint_repartition(self):
        return f"/subscriptions/repartition/"

    def repartition_widget(self):
        return self.get(self.endpoint_repartition())

    def endpoint_timeline(self):
        return f"/subscriptions/timeline/"

    def timeline_widget(self):
        return self.get(self.endpoint_timeline())

    def endpoint_vote(self):
        return f"/subscriptions/vote/"

    def vote_widget(self):
        return self.get(self.endpoint_vote())


class WidgetsTestCase(BaseWidgetsTestCase):
    widget_names = [
        "balance",
        "birthday",
        "library_bd_tek",
        "marketplace_pdm",
        "poll",
        "repartition",
        "timeline",
        "vote",
    ]

    def test_if_not_logged_in_then_401(self):
        res = self.list_widgets()
        self.assertStatusCode(res, 401)

        for widget_name in self.widget_names:
            res = getattr(self, f"{widget_name}_widget")()
            self.assertStatusCode(res, 401)

    def test_only_get_allowed(self):
        def loop_methods_over_endpoints(status_code=405):
            def loop_methods(endpoint, status_code=405):
                res = self.post(endpoint)
                self.assertStatusCode(res, status_code)
                res = self.patch(endpoint)
                self.assertStatusCode(res, status_code)
                res = self.delete(endpoint)
                self.assertStatusCode(res, status_code)
                res = self.put(endpoint)
                self.assertStatusCode(res, status_code)

            for widget_name in self.widget_names:
                loop_methods(getattr(self, f"endpoint_{widget_name}")(), status_code)

            loop_methods(self.endpoint_list_widgets(), status_code)

        # First try logged out.
        loop_methods_over_endpoints(401)

        for user in ALL_USERS:
            self.login(user)
            loop_methods_over_endpoints(405)

    def test_list_widgets(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.list_widgets()
            self.assertEqual(
                res.data,
                {
                    "main": self.endpoint_timeline(),
                    "mandatory": [
                        self.endpoint_balance(),
                        self.endpoint_birthday(),
                        self.endpoint_poll(),
                        self.endpoint_repartition(),
                        self.endpoint_vote(),
                    ],
                    "optional": [
                        self.endpoint_library_bd_tek(),
                        self.endpoint_marketplace_pdm(),
                    ],
                },
            )

    def test_balance_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.balance_widget()
            self.assertStatusCode(res, 200)
            self.assertEqual(
                res.data,
                [
                    {
                        "balance": compute_balance(user, marketplace.id),
                        "marketplace": marketplace.id,
                        "user": user,
                    }
                    for marketplace in Marketplace.objects.all()
                ],
            )

    def test_birthday_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.birthday_widget()
            self.assertStatusCode(res, 200)
            self.assertEqual(res.data, get_birthdays(None, 7))

    def test_library_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.library_widget("bd-tek")
            self.assertStatusCode(res, 200)
            self.assertEqual(
                res.data,
                {
                    "suggested_loanables": Library.objects.get(pk="bd-tek")
                    .loanables.annotate(
                        number_of_borrow=Count("loans", filter=Q(user=user))
                    )
                    .order_by("-number_of_borrow")
                    .filter(loans_real_return_date__is_null=False)[0:5]
                    .all()
                },
            )

    def test_marketplace_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.marketplace_widget("pdm")
            self.assertStatusCode(res, 200)
            self.assertEqual(
                res.data,
                {
                    "balance": BalanceView.get_balance_in_json("pdm", user),
                    "suggested_products": Marketplace.objects.get(pk="pdm")
                    .products.annotate(
                        number_of_purchases=Count("transaction", filter=Q(buyer=user))
                    )
                    .order_by("-number_of_purchases")
                    .exclude(number_left=0)[0:5]
                    .all(),
                },
            )

    def test_poll_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.poll_widget()
            self.assertStatusCode(res, 200)
            self.assertEqual(res.data, {})

    def test_repartition_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.repartition_widget()
            self.assertStatusCode(res, 200)
            self.assertEqual(res.data, {})  # TODO once repartition widget is written.

    def test_timeline_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.timeline_widget()
            self.assertStatusCode(res, 200)
            self.assertEqual(
                len(res.data),
                Event.objects.filter(
                    ends_at__lt=datetime.datetime.now(),
                    starts_at__gt=datetime.datetime.now(),
                    participants__in=user,
                )
                .order_by("-starts_at")
                .count()
                + Page.objects.order_by("-last_update_date")[0:10].count(),
            )

    def test_vote_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.vote_widget()
            self.assertStatusCode(res, 200)
            self.assertEqual(
                len(res.data),
                Election.objects.filter(registered_voters__id=user).count(),
            )
