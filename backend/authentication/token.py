import jwt

from django.conf import settings


def decode_token(token: str, verify: bool = True) -> dict:
    """
    Verify a token and return its claims.
    Raise a `jwt.exceptions.InvalidTokenError` if the token cannot be verified.
    """

    try:
        return jwt.decode(
            jwt=token,
            key=settings.JWT_AUTH_SETTINGS["PUBLIC_KEY"],
            algorithms=[settings.JWT_AUTH_SETTINGS["ALGORITHM"]],
            issuer=settings.JWT_AUTH_SETTINGS["ISSUER"],
            audience=settings.JWT_AUTH_SETTINGS["AUDIENCE"],
            verify=verify,
        )
    except jwt.exceptions.InvalidSignatureError:
        raise jwt.exceptions.InvalidTokenError(
            "The token signature could not be verified."
        )
    except jwt.exceptions.ExpiredSignatureError:
        raise jwt.exceptions.InvalidTokenError("Expired token.")
    except jwt.exceptions.InvalidAudienceError:
        raise jwt.exceptions.InvalidTokenError("Invalid audience.")
    except jwt.exceptions.InvalidIssuerError:
        raise jwt.exceptions.InvalidTokenError("Invalid issuer.")
    except jwt.exceptions.InvalidTokenError:
        raise jwt.exceptions.InvalidTokenError("Invalid token.")
