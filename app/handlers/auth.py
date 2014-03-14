import tornado.escape
from .base import BaseHandler
from ..route import route
from ..models import User

@route("/api/v1/auth")
class AuthApiHandler(BaseHandler):
    def register_handler(self):
        username = self.get_param('params', {}).get('username')
        email    = self.get_param('email', None)
        password = self.get_param('password', None)

        if not username or not email or not password:
            self.finish_err("Missing argument - username, email or password")
            return

        users = User.find(email=email)
        if users:
            self.finish_err("Existing User")
            return

        user = User.create(username=username, email=email, password=password)
        token = self.login(user)

        self.finish_data({'token':token})

    def login_handler(self):
        email  = self.get_param('email', None)
        passwd = self.get_param('password', None)
        token  = self.get_param('token', None)

        # TODO - validate
        user = None
        if token:
            user = self.get_current_user(token=token)
            if not user:
                # Invalid token - expire
                self.finish_data()
                return
        elif not email or not passwd:
            self.finish_err("Missing email or password")
            return
        else:
            users = User.find(email=email)
            if not users:
                self.finish_err("Email/Password doesn't match")
                return
            user = users[0]
            if not user.validate(passwd):
                self.finish_err("Email/Password doesn't match")
                return

        token = self.login(user)

        self.finish_data({'token':token})

    def post(self):
        if self.get_argument('register', False):
            return self.register_handler()
        self.login_handler()

    def delete(self):
        self.finish_data({})
