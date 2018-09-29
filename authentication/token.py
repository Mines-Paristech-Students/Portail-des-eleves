from datetime import datetime
from uuid import uuid4

from authentication.backend import TokenBackend
from authentication.settings import api_settings
from authentication.exceptions import TokenError


class Token(object):
    """
    A class which validates and wraps an existing JWT or can be used to build a
    new JWT.
    """

    def __init__(self, token=None, verify=True, longAuth=False):
        """
        !!!! IMPORTANT !!!! MUST raise a TokenError with a user-facing error
        message if the given token is invalid, expired, or otherwise not safe
        to use.
        """

        self.token = token
        self.current_time = datetime.utcnow()
        self.token_backend = TokenBackend()

        # Set up token
        if token is not None:
            # An encoded token was provided, let's decode it
            try:
                self.payload = self.token_backend.decode(token)
            except TokenError:
                raise TokenError('Token is invalid or expired')

            if verify:
                self.verify()
        else:
            # New token.  Skip all the verification steps.
            self.payload = {}

            # Set "exp" claim with default value
            access_token_lifetime = api_settings.ACCESS_TOKEN_LONG_LIFETIME if longAuth else api_settings.ACCESS_TOKEN_LIFETIME
            self.payload['exp'] = int((datetime.utcnow() + access_token_lifetime).timestamp())

            # Set "jti" claim
            self.payload['jti'] = uuid4().hex

    def __repr__(self):
        return repr(self.payload)

    def __getitem__(self, key):
        return self.payload[key]

    def __setitem__(self, key, value):
        self.payload[key] = value

    def __delitem__(self, key):
        del self.payload[key]

    def __contains__(self, key):
        return key in self.payload

    def get(self, key, default=None):
        return self.payload.get(key, default)

    def __str__(self):
        """
        Signs and returns a token as a base64 encoded string.
        """

        return self.token_backend.encode(self.payload)

    def verify(self):
        """
        Performs additional validation steps which were not performed when this
        token was decoded.  This method is part of the "public" API to indicate
        the intention that it may be overridden in subclasses.
        """
        if 'jti' not in self.payload:
            raise TokenError('Token has no jti claim')
        if 'jti' not in self.payload:
            raise TokenError('Token has no exp claim')

        claim_time = datetime.fromtimestamp(self.payload['exp'])
        if claim_time <= datetime.now():
            raise TokenError('Token has expired')

    @classmethod
    def for_user(cls, user, longAuth=False):
        """
        Returns an authorization token for the given user that will be provided
        after authenticating the user's credentials.
        """
        user_id = getattr(user, api_settings.USER_ID_FIELD)
        if not isinstance(user_id, int):
            user_id = str(user_id)

        token = cls(longAuth=longAuth)
        token[api_settings.USER_ID_CLAIM] = user_id

        return token
