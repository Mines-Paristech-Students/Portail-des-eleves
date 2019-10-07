import jwt

from authentication.settings import API_SETTINGS


def decode_token(token: str) -> dict:
    """
        Verify a token and return its claims.
        Raise a `jwt.exceptions.InvalidTokenError` if the token cannot be verified.
    """

    try:
        return jwt.decode(
            jwt=token,
            key=API_SETTINGS["PUBLIC_KEY"],
            algorithms=[API_SETTINGS["ALGORITHM"]],
            issuer=API_SETTINGS["ISSUER"],
            audience=API_SETTINGS["AUDIENCE"],
        )
    except jwt.exceptions.InvalidSignatureError:
        raise jwt.exceptions.InvalidTokenError(
            "The token signature could not be verified."
        )
    except jwt.exceptions.ExpiredSignatureError:
        raise jwt.exceptions.InvalidTokenError("Expired token.")
    except jwt.exceptions.InvalidTokenError:
        raise jwt.exceptions.InvalidTokenError("Invalid token.")
