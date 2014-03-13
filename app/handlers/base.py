from tornado.web import RequestHandler

class AuthMixin(object):
    COOKIE = 'kik'

    def login(self, user, remember=True):
        """Login in to this account"""

        if not user:
            self.clear_cookie(self.COOKIE)
        else:
            if remember:
                self.set_secure_cookie(self.COOKIE, str(user.id), expires_days=366)
            else:
                self.set_secure_cookie(self.COOKIE, str(user.id), expires_days=None)
        self._current_user = user

    def get_current_user(self, cookie=None):
        """Implementation for current_user property"""
        if 'current_user' in self.application.settings:
            return True

        guid = self.get_secure_cookie(self.COOKIE, cookie)
        if guid:
            try:
                user = User.get(id=guid)
                if user.role == 'admin':
                    return user
            except User.DoesNotExist:
                pass
        return None

class BaseHandler(AuthMixin, RequestHandler):
    """Base handler which all handlers can derrive for common functionality"""

    @property
    def logger(self):
        if not hasattr(self, '_logger'):
            self._logger = CustomAdapter(logging.getLogger(self.__class__.__module__), self)
        return self._logger
