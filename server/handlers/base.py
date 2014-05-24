import functools
import tornado.escape
from tornado.web import RequestHandler, HTTPError
from ..models import User, Model

class AuthMixin(object):
    COOKIE = 'fxgx'

    def login(self, user, remember=True):
        """Login in to this account"""

        value = self.create_signed_value(self.COOKIE, user.id).decode('utf-8')
        self._current_user = user
        return value

    def get_current_user(self, token=None):
        """Implementation for current_user property"""
        if 'current_user' in self.application.settings:
            return self.application.settings['current_user']

        if token is None:
            hdr = self.request.headers.get('Authorization', None)
            if hdr:
                parts = hdr.split(' ')
                if len(parts) != 2 or parts[0] != 'Basic':
                    return None

                token = parts[1]

        if not token:
            #  FIXME: Use the user_auth cookie - should handle via some promises in Angular
            try:
                import urllib.parse
                token = urllib.parse.unquote(self.get_cookie('user_auth'))
            except:
                pass

        guid = self.get_secure_cookie(self.COOKIE, token)
        if guid:
            try:
                return User.get(id=guid.decode('utf-8'))
            except User.DoesNotExist:
                pass
        print("FAIL")
        return None

class BaseHandler(AuthMixin, RequestHandler):
    """Base handler which all handlers can derrive for common functionality"""

    @property
    def logger(self):
        if not hasattr(self, '_logger'):
            self._logger = logging.getLogger(self.__class__.__module__)
        return self._logger

    @property
    def parameters(self):
        if not hasattr(self, '_param_data_value'):
            self._param_data_value = tornado.escape.json_decode(self.request.body) 
        return self._param_data_value

    def get_param(self, name, default=None):
        v = self.parameters.get(name, default)
        if isinstance(v, str):
            return v.strip()
        return v

    def finish_data(self, data=None):
        if isinstance(data, list) and data and isinstance(data[0], Model):
            data = [d.to_dict() for d in data]
        elif isinstance(data, Model):
            data = data.to_dict()
        self.finish({'status': 'ok', 'data': data})

    def finish_err(self, message):
        self.set_status(404)
        self.finish({'status': 'err', 'emsg': message})

def api_authenticated(method):
    """Decorate methods with this to require that the user be logged in.

    If the user is not logged in, they will be redirected to the configured
    `login url <RequestHandler.get_login_url>`.
    """
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        if not self.current_user:
            raise HTTPError(403)
        return method(self, *args, **kwargs)
    return wrapper
