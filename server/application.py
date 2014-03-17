import tornado.web
import server.handlers
from .route import route
import logging
import os

logger = logging.getLogger(__name__)

class RawModule(tornado.web.UIModule):
    def render(self, path):
        template_path = self.handler.get_template_path()

        fullpath = os.path.join(template_path, path)

        with open(fullpath) as stream:
            return stream.read()
        return None
    

class Application(tornado.web.Application):
    def raw_file(self, handler, path):
        template_path = handler.get_template_path()

        fullpath = os.path.join(template_path, path)

        with open(fullpath) as stream:
            return stream.read()
        return None

    def __init__(self, settings):
        routes = route.get_routes()
        # routes.extend([(r"/(.+)", RedirectHandler)])

        #settings['ui_methods'] = {
        #    'raw_file' : self.raw_file
        #}
        settings['ui_modules'] = {
            'Raw' : RawModule
        }

        super(Application, self).__init__(routes, **settings)

