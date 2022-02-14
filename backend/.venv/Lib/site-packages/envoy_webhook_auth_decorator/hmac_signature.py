"""Envoy signature management."""

import sys
import hmac
import hashlib


def generator(api_key, timestamp, token):
    message = '{}{}'.format(timestamp, token)
    if sys.version_info[0] < 3:
        return hmac.new(
            str(api_key),
            msg=message,
            digestmod=hashlib.sha256
        ).hexdigest()
    else:
        return hmac.new(
            bytes(api_key, 'UTF-8'),
            msg=bytes(message, 'UTF-8'),
            digestmod=hashlib.sha256
        ).hexdigest()


def is_valid(api_key, timestamp, token, signature):
    return generator(api_key, timestamp, token) == signature
