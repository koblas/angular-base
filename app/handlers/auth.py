import tornado.escape
from .base import BaseHandler
from ..route import route

@route("/api/v1/auth")
class AuthApiHandler(BaseHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body) 
        email  = data.get('email', None)
        passwd = data.get('password', None)

        # TODO - validate

        self.finish({'status':'ok', 'data': { 'token' : '123' }})

    def delete(self):
        self.finish({})

@route("/auth/logout")
class LogoutHandler(BaseHandler):
    def get(self):
        self.login(None)
        self.redirect('/')

@route("/auth/login")
class LoginHandler(BaseHandler):
    def get(self):
        email = self.get_argument('email','')
        next = self.get_argument('next','/')

        self.render("auth/login.html", error=None, next=next, email=email)

    def post(self):
        next   = self.get_argument('next','/')
        email  = self.get_argument('email')
        passwd = self.get_argument('password')

        user = None

        try:
            #auth = EmailAuth.get(EmailAuth.email==email)
            if auth.verify_password(passwd):
                user = auth.user
        except EmailAuth.DoesNotExist:
            pass

        if user:
            self.logger.debug("Authentication success for email=%s" % email)
            self.login(user)
            self.redirect(next)
        else:
            self.logger.info("Authentication failed for email=%s" % email)
            self.render("auth/login.html", error=None, next=next, email=email)
