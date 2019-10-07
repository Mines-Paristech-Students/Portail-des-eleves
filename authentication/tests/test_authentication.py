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

    INVALID_SIGNATURE_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1NzEwMDMwNjAuMjM4ODQxLCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjVjY2FjMTg2MmJjODRiZmM5NTc0NTgwZTJjNGY2ZjE2IiwidXNlciI6IjE3c2ltcGxlIn0.Eeum3p-UTy_rVQOGuCknmWwKb8vqlX4j72ldn3wsO87kOrVqYD_ywAp5QVeaIqzTxP2-9VHMmUUncOSlaYocPG8mN4bOSrrmpc_BmNB9UuNw0T87YDk5N2ZhQmt_xvacCx9zYqy5Z_br_JwEq3rblzglC9o51vp0KQqohrEDaUlCJkL5xhGQunT-Dt1-3Xf5CUj8KNzwM2XxUD-RwJFrsTAGDgXYtDojwXDvt8vJZrvq5sEi1woCgHrftZxfun0gXudQ0ZjcCSF05hQOYaAUX4EDgLo3LjOfUylR9BI6D-7qBC2rSXVly4P3t0ewgie3I3ZciTstoPkAEDdCcq7ZZA"
    EXPIRED_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1Njk1MzQyNjAuNTM4NTIxLCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjVjY2FjMTg2MmJjODRiZmM5NTc0NTgwZTJjNGY2ZjE2IiwidXNlciI6IjE3c2ltcGxlIn0.WCgXyiorv6nYN135ENwz_N9w7xkTpWuIr_Hx5xxPNs3wNU7ni7VdfQ61bP1TcFbSkyAkpmnJUVEXPyfd8SEroRxKbtszoVc5JWZ7LP12en1qrkWG1goszxzZoA2WGzHoQFOZG5brW4YL97miT_Xzdin-s2m2Y41d4R2UJ107B3uu5Gx-aguXtfMdZ9lPPOrYf-QpcVp8erMrbE2sAL5WWBjfbzPaa8NFSNTveI5wSkpHRvV5QKv6aDAF4zKxzwr3F7u6UTcTa8yOwHAcsVA6ZZWnjALsg3mUDL8wzE4MyydW27BkRlA3kpwcFtqi-HhVckTYVLIlpiKbIdKlMht6_Q"
    INVALID_ISSUER_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1NzEwMDMwNjAuNTQxNTEsImlzcyI6InBpY2hlIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjVjY2FjMTg2MmJjODRiZmM5NTc0NTgwZTJjNGY2ZjE2IiwidXNlciI6IjE3c2ltcGxlIn0.VWhqK7ZpnJFtTCevlxE5_potHNhOIF3Gj_z-LK67XMVhUbZm5gP3gR33sNie-PJKEw9QIor4-hxI9goPq24NiHLsG9SiyLde5SGEC1dGD3UR225ikTIOIoUldzCc3tlD8MW6kAXVYEyh9idMfiZ63RWGPuqbjl-b6zqKy19BALcR2I9WMH0-u6DrOwilIzAwCQ1CZFCCPTLhrPoKoz3U3dMmQllXlZUJHvK4wrf8P7cpogMby86jvtIezn5Xoo_wzStfIWIX64KK9lqnrrJZj-03L8aU6d6VYFbpUvsDYbXOU9VeGCfwTlsjI8uOuHNmB4sr1MznPkhuWFSI8K4U_g"
    INVALID_AUDIENCE_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1NzEwMDMwNjAuNTQ0NTU5LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpQSIsImp0aSI6IjVjY2FjMTg2MmJjODRiZmM5NTc0NTgwZTJjNGY2ZjE2IiwidXNlciI6IjE3c2ltcGxlIn0.dC1qZMIrimzApihsztyiAFNwILqLumjJF_ra234WFbuWY2T83t5TD89qZcXGD83kfRRUhM10jQqW9LdLcQUHzHVGFNsbH5d70sr1T7WwMRJQ3gMZtRJdhz9lFyiSZUlH01tyoCPgn8pkPeHs1yLKWrfspqvl8Mix5z-eLP7Xo1HFr_7AFeZ0iH3gzYOcnHoSmtlz6bQd2GysWPRMLN1oYiyULpRLH0x0_P8_2Zu13ZSFC2kdx6ijhvc0iq1eOKjuy6OCLmIE3erSeUABC-ISZK9EikHuSRKKwhCiJPwxWvV6EONkysVbcOQkp_aTT0EDvwOAMiqIXZhGF_Lhnywy5Q"
    VALID_17SIMPLE_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1NzEwMDMwNjAuNTYyODA1LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjVjY2FjMTg2MmJjODRiZmM5NTc0NTgwZTJjNGY2ZjE2IiwidXNlciI6IjE3c2ltcGxlIn0.gG6rB5Wb-1Ehas6Jvm83oFMH1WZY3fKio00wywnSWHjtmx2gYD6HQ6sLNs-Mj8WYl3LylDF2CRNFXh9gOhnkgL2wgbppkAfrfRqcJeC9X875Ssv49BtCX8rdcz2Qy98i_xZv1yF-_vVls3W5hP_8K7wFNsrsPX5pcFXYI7TBcKaiLpaeIEUT_zfud6CdiR9K6GWXVSGmCHj9x2UbfDQbeX3LoSrD6Ud0PlVtMXSm4eyH7eCaleV-FKowZkZ8C63SuFeVF9guJ8KSbBkrsQvzSBQ6Hw_gDLZYcO2sR3dTf1j0ebMW50k3SgSbcyg15gq1aO0cNiwO73Jo2POsqHg6Aw"
    VALID_17UNKNOWN_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1NzEwMDQzODYuNjY1Njg3LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjVjY2FjMTg2MmJjODRiZmM5NTc0NTgwZTJjNGY2ZjE2IiwidXNlciI6IjE3dW5rbm93biJ9.a-ojYLWfVfPf1VdZN6WPWC-ADGKtY9WaifFYUX2HxrrkI0GqPujeld-vpeEAseEvArEu2zw0ElrD5x7g8a7SsWXpIn-e86Nz8z-eGY-5toig9bsuR2PkutW0Ql0GDfki-YjN9w3U3QH4ZDqFbGYXdJiYLeU-jCEmrno80reYa7vMLnsWAQvQsoMQFQORPcRCHKDn8hKm_tDHIp6EztWiMroaQ364QHGL7NfJFzdeS6VH-owLhBFQpk_YuSP5xhrRObLuNh-_GO18TTYtx_tHSzTTepyluUHdsIDkTAD8WopK6-ytls5gT3tgswKiBz4O6Vd1i1Q67ULij-hW-6YFsA"

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

    def test_if_no_token_then_cannot_login(self):
        res = self.get("/auth/login/")
        self.assertStatusCodeIn(res, [401, 403])
        self.assertEqual(
            res.data["detail"],
            "Provide a JWT as the `access` GET parameter.",
            msg=res.data["detail"],
        )

    def test_if_invalid_signature_token_then_cannot_login(self):
        res = self.login(self.INVALID_SIGNATURE_TOKEN)
        self.assertStatusCodeIn(res, [401, 403])
        self.assertEqual(
            res.data["detail"],
            "The token signature could not be verified.",
            msg=res.data["detail"],
        )

    def test_if_expired_token_then_cannot_login(self):
        res = self.login(self.EXPIRED_TOKEN)
        self.assertStatusCodeIn(res, [401, 403])
        self.assertEqual(res.data["detail"], "Expired token.", msg=res.data["detail"])

    def test_if_invalid_issuer_token_then_cannot_login(self):
        res = self.login(self.INVALID_ISSUER_TOKEN)
        self.assertStatusCodeIn(res, [401, 403])
        self.assertEqual(res.data["detail"], "Invalid issuer.", msg=res.data["detail"])

    def test_if_invalid_audience_token_then_cannot_login(self):
        res = self.login(self.INVALID_AUDIENCE_TOKEN)
        self.assertStatusCodeIn(res, [401, 403])
        self.assertEqual(
            res.data["detail"], "Invalid audience.", msg=res.data["detail"]
        )

    def test_if_invalid_user_token_then_not_authenticated(self):
        self.assertFalse(User.objects.filter(pk="17unknown").exists())
        res = self.login(self.VALID_17UNKNOWN_TOKEN)
        self.assertStatusCode(
            res, 200
        )  # The user verification is done at the next step, so the cookie is set.
        self.assertIsNotAuthenticated()

    def test_if_valid_user_token_then_authenticated(self):
        self.assertTrue(User.objects.filter(pk="17simple").exists())
        res = self.login(self.VALID_17SIMPLE_TOKEN)
        self.assertStatusCode(res, 200)
        self.assertIsAuthenticated("17simple")

    ##########
    # LOGOUT #
    ##########

    def test_logout(self):
        self.assertTrue(User.objects.filter(pk="17simple").exists())
        res = self.login(self.VALID_17SIMPLE_TOKEN)
        self.assertStatusCode(res, 200)
        self.assertIsAuthenticated("17simple")

        res = self.logout()
        self.assertStatusCode(res, 200)
        self.assertIsNotAuthenticated()
