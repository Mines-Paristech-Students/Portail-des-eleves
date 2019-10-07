import jwt

from django.conf import settings


def decode_token(token: str) -> dict:
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
        )
    except jwt.exceptions.InvalidSignatureError:
        raise jwt.exceptions.InvalidTokenError(
            "The token signature could not be verified."
        )
    except jwt.exceptions.ExpiredSignatureError:
        raise jwt.exceptions.InvalidTokenError("Expired token.")
    except jwt.exceptions.InvalidTokenError:
        raise jwt.exceptions.InvalidTokenError("Invalid token.")
