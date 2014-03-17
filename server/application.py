import yaml
import tornado.web
import server.handlers
from .route import route
import logging
import os

__config__ = os.path.join(os.path.dirname(__file__), '..', 'settings.yaml')

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

    def build_settings(self, env=None, **params):
        config = {}
        try:
            f = open(__config__, 'r')
            config = yaml.load(f)
            f.close()
        except IOError:
            print('Invalid or missing config file %s' % __config__)
        
        # if no settings, we go away
        if 'settings' not in config:
            raise Exception('No default configuration found')
        
        settings = config['settings']
        if env:
            settings.update(config['extra_settings'][env])
        settings.update(params)

        for k,v in settings.items():
            if k.endswith('_path'):
                settings[k] = settings[k].replace(
                    '__path__',
                    os.path.dirname(__file__)
                )

        return settings

    def __init__(self, env=None, params={}):
        routes = route.get_routes()

        settings = self.build_settings(env, **params)

        super(Application, self).__init__(routes, **settings)
