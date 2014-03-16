from tornado.web import authenticated
from ..route import route
from .base import BaseHandler

@route("/")
class IndexHandler(BaseHandler):
    def get(self):
        #self.render("index.html")
        self.render("ngapp.html", ngapp='geartracker')

@route("/(todo|login)")
class ApplicationHandler(BaseHandler):
    def get(self, page):
        #self.render("index.html")
        self.redirect('/#%s' % page)
        #self.render("ngapp.html", ngapp='geartracker')
