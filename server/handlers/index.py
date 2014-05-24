from tornado.web import authenticated
from ..route import route
from .base import BaseHandler

@route("/(.*)")
class IndexHandler(BaseHandler):
    def get(self, page):
        if page:
            self.redirect('/#%s' % page)
        else:
            self.render("ngapp.html")
