from backend.tests_utils import BaseTestCase

from authentication.models import User


class AuthenticationTestCase(BaseTestCase):
    """Test the authentication logic."""

    fixtures = ("test_authentication.yaml",)

    # These tokens were generated with the private key corresponding to `authentication.keys.public.PUBLIC_KEY`. This
    # private key should be in the `sso` project.
    # One can use the script in the `sso_server` project to generate those tokens, and https://jwt.io/ to debug them.
    # The audience of these tokens is `portail` (it was of course edited in INVALID_AUDIENCE_TOKEN).
    # Except for `VALID_17UNKNOWN_TOKEN`, the user of these tokens is `17simple`.
    # These tokens will expire around 2100.

    # tokens generated with `sso_server.tests.generate_fake_tokens("portail", "17simple")` in the `sso` project.
    tokens = {
        "INVALID_SIGNATURE_TOKEN": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjQ3MjYwMjE5ODQuNzk3MzMzLCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6ImJjOTM4Yzc1NjE4NTRiZTU4MTc4YzZiNzVmNWZjNWNkIiwidXNlciI6IjE3c2ltcGxlIn0.Xu4m9AA3R_y_7RN_7v3rrNq9NQ6f0aeOCTbvQp-HZBR6PhQamhSyAj9vZD05oTLl-ManzDvIXjg8QbKZh3-N0HoO5yWUHtM0CKWJUQ07NptH_VldOtvbc8Fb4Lhzr03ScxtQslaUc6DXraWd3GurDCUGRzw9NT7_VybycofwucjvQjE1gFbjqN7TnxAdb8Tye5w-89ge-1FGZvsqgZyvupScdEe7B15QUe2UTm-RsDDV-RG91B6TBoTduFpTzp3oqzrkwONurKjK929Z-Ndq6AHOP17Cj_SL4R6rxlpVsQ50j0LMODhxwBfIHnQsARiLdwGcThl6LgZLYLfciAAAAA",
        "EXPIRED_TOKEN": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1NzE1NTc5ODQuODY2Mjc2LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjI1NmVkOWM5Mjc3NTQwMDU4MTliOTZkZDkxN2U5NmE5IiwidXNlciI6IjE3c2ltcGxlIn0.CaL4yPQVoV3xxG5mUtPMqS-Qf7wApwOtuFwQSWKqU95-S_AhRwncjn0iLKmrxhQKXSBvDEs5BpReM1EiKQYFVcrDj1g7ajjVL9kvJDnhfg77VL7RnqJjyvtdnctIyK6sZFx_tg1wQcxeXkyvFJs0beR8SkDeZT9cb7G_HERh9CxU_z8KsGSGwOhEf0fotBDDBn-04GCBDCUPsayOhfCfbxSv6ZnbcEthPrv4q6panAm29TlbL9X6rerKScblVyooWg4o-9P0o2tdbNF2HyM1-GnLrUbVC3wsGD-Qo-6MdMYsU6bdrD7WRLaYu_YmKxdH4eT6AIgiqCHnkvWrx4u6FA",
        "INVALID_ISSUER_TOKEN": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjQ3MjYwMjE5ODQuODY2Mjc2LCJpc3MiOiJwaWNoZSIsImF1ZCI6InBvcnRhaWwiLCJqdGkiOiJlYzdiN2IwYWM0ZGY0YmRjODE5ZDNiNmRmYTNjZjhjYyIsInVzZXIiOiIxN3NpbXBsZSJ9.gA1u-m8b-uZlmhYrBdqo1vx1Ggic9XTN-uYiUNbSKuvrsKknE9Gn1JY24DRZjL3Xz_2zoZBAtUxwOYfJvy9GplHEsgSV0_ARDzZ4cAvWqtDpC8Eq6YusZtlN2O9PPStYYgjrgySw0bqEmUa3Vpo9PSPKEggyPq6UO-NkGbAHpLswxc8_jCwqD7795kYHZ0qIw7UKQ_DZAO_C-xnv2hWYlhUHrpk_Hy6Uteoe908ZtVAhB24ZSRor-VsXfP6UepiZ7Ehc20ggm7-mI4yyIbrA865jZldW7CqjRwYyMVoe_dbIBJ2xyzllc2gS_OfwdjcuGQRNVXcToxgvv8cv5v5IWg",
        "INVALID_AUDIENCE_TOKEN": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjQ3MjYwMjE5ODQuODY2Mjc2LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicGljaGUiLCJqdGkiOiI4NGI1NTQzZGE2MDI0ZjU2OGE3YWEwNDJlNWJhYTZkNyIsInVzZXIiOiIxN3NpbXBsZSJ9.M7UpJQ9RwrYSsENFw_iN-ODzBPm3x90GTbjrgnGKvTxexyaA-P_KwE1cHCNdVtWqjQam-Zq88xeD_31jE1Fp7LANsQkA9ACfVuDGsOSrEcCn7yaRRJTkwxShyykI6HnNJS2MznRktOgRYUN-usJj30kNS1p7_ZQnsCYRbWt_frwztdPwlnOishTsipOBTLnmk_h9mUlS9YRNb6gsCw8FaPW3BCu7K9O2YbldpGBhq1iqPx26t2W8VeE6l7IT0soNz-KS0xGxwImuzlDQMkFxxRnnzwpyqDfXoleaZO7iTSCRNqzcae9i3fskMqeLbFrrkIlUmUZjTWz2sA-pNHDjfA",
        "VALID_PICHE_TOKEN": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjQ3MjYwMjE5ODQuODY2Mjc2LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjE4NGM2OTJmNDBhMzQ4M2U5NGY1MDY3MzUzODBhYzIzIiwidXNlciI6InBpY2hlIn0.bNT2NkYYyrrqk551UHQd1HE02T9MRNNsc0M1Gr9bXHQv3bQBhrdTa7ILlcHf4U-rXiVKCh9QpsQZ379-jEUMFWVqSmse17z156Sdk4vQsVGILk660vOwUV_ugyQIXZCbARNTP4FhpXn4GmNMy15zOF2qn1xUw-lPgkEZnxeIuT_eDzFH_8lKjkIthdhBn7jHGiHJ-Kcu2GpOUZd6N44hD3nlAuEgVYRIN4plNFsLq6p-44eXZraF0JebjJa4J0dj-TiQ3e7XsFDjWuwd4K-bkhZF1KfeDQcFMqT7coZIqaC1o88-zQP0n0UYMtjoWVi56wT5Ams3qG_cg_6mOEFrsQ",
        "VALID_17SIMPLE_TOKEN": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjQ3MjYwMjE5ODQuODY2Mjc2LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjJlOTEwN2ZkODc3YjRhOTA4NzdkZGI1Njc4MjczZTc1IiwidXNlciI6IjE3c2ltcGxlIn0.SaCYMt6M-KtuZQdSsKfJN9v7REpeSKJk9noFxZC5A43dyaQYuk-yiakCH_tOGmD45lvvO3mxUd9AgmvSVrDoAhU_ybujWRV30stF00j8tTaD70zncISBLM3vFCTDWpcq1JX6_iXRZsYYA_JsasY-dDwBURVS9b-YvtZj4vFSA3OF87KUmce8PNEJ9MZiuei7NkIYlKhgYXO24Y0D3HhqrFj2DD2okajU2BCsmuCfhd6lJXKsu5l4TG8jNpfc4ao6mmCtJVSOOMtpMgLts6Lg3q9rZqAF2UIYyCgrQ7OajQ2GkkurHGv_in-5FbaLiwI36Cq2XYFOlVsMgwvfw9GuLg",
    }

    def login(self, token: str = ""):
        return self.get(f"/auth/login/?access={token}")

    def logout(self):
        return self.get(f"/auth/logout/")

    def assertIsAuthenticated(self, user_id: str):
        res = self.get("/auth/check/")
        self.assertStatusCode(res, 200)
        self.assertEqual(user_id, res.data["user_id"])

    def assertIsNotAuthenticated(self):
        res = self.get("/auth/check/")
        self.assertStatusCode(res, 401)

    #########
    # LOGIN #
    #########

    def test_cannot_login_without_token(self):
        res = self.get("/auth/login/")
        self.assertStatusCode(res, 403)
        self.assertEqual(
            res.data["detail"],
            "Provide a JWT as the `access` GET parameter.",
            msg=res.data["detail"],
        )

    def test_cannot_login_with_invalid_signature(self):
        res = self.login(self.tokens["INVALID_SIGNATURE_TOKEN"])
        self.assertStatusCode(res, 403)
        self.assertEqual(
            res.data["detail"],
            "The token signature could not be verified.",
            msg=res.data["detail"],
        )

    def test_cannot_login_with_expired_token(self):
        res = self.login(self.tokens["EXPIRED_TOKEN"])
        self.assertStatusCode(res, 403)
        self.assertEqual(res.data["detail"], "Expired token.", msg=res.data["detail"])

    def test_cannot_login_with_invalid_issuer(self):
        res = self.login(self.tokens["INVALID_ISSUER_TOKEN"])
        self.assertStatusCode(res, 403)
        self.assertEqual(res.data["detail"], "Invalid issuer.", msg=res.data["detail"])

    def test_cannot_login_with_invalid_audience(self):
        res = self.login(self.tokens["INVALID_AUDIENCE_TOKEN"])
        self.assertStatusCode(res, 403)
        self.assertEqual(
            res.data["detail"], "Invalid audience.", msg=res.data["detail"]
        )

    def test_cannot_login_with_invalid_user_token(self):
        self.assertFalse(User.objects.filter(pk="piche").exists())
        res = self.login(self.tokens["VALID_PICHE_TOKEN"])
        self.assertStatusCode(
            res, 403
        )  # The user verification is done at the next step, so the cookie is set.
        self.assertIsNotAuthenticated()

    def test_if_valid_user_token_then_authenticated(self):
        self.assertTrue(User.objects.filter(pk="17simple").exists())
        res = self.login(self.tokens["VALID_17SIMPLE_TOKEN"])
        self.assertStatusCode(res, 200)
        self.assertIsAuthenticated("17simple")

    ##########
    # LOGOUT #
    ##########

    def test_logout(self):
        self.assertTrue(User.objects.filter(pk="17simple").exists())
        res = self.login(self.tokens["VALID_17SIMPLE_TOKEN"])
        self.assertStatusCode(res, 200)
        self.assertIsAuthenticated("17simple")

        res = self.logout()
        self.assertStatusCode(res, 200)
        self.assertIsNotAuthenticated()
