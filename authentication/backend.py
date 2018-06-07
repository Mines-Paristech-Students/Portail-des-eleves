import jwt
from authentication.exceptions import TokenError
from authentication.settings import api_settings


class TokenBackend(object):

    def __init__(self):
        self.algorithm = api_settings.ALGORITHM
        self.secret_key = api_settings.SECRET_KEY

    def encode(self, payload):
        """
        Returns an encoded token for the given payload dictionary.
        """
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        return token.decode('utf-8')

    def decode(self, token):
        """
        Performs a validation of the given token and returns its payload
        dictionary.

        Raises a `TokenBackendError` if the token is malformed, if its
        signature check fails, or if its 'exp' claim indicates it has expired.
        """
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm], verify=True)
        except jwt.InvalidTokenError:
            raise TokenError('Token is invalid or expired')
