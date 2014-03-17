#! /usr/bin/env python
# *-* coding: utf8 *-*

__author__ = 'David Koblas'
__email__ = 'david@koblas.com'
__date__ = '2014-03-01'
__appname__ = 'app.py'
__version__ = 0.1
__config__ = 'settings.yaml'

import optparse
import yaml

import logging
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.auth
import tornado.autoreload
import tornado.options
from server.application import Application


import os
import sys

tornado.options.define('port', type=int, default=9000, help='server port number (default: 9000)')
tornado.options.define('user', type=int, default=None, help='User to fake')
tornado.options.define('debug', type=bool, default=False, help='run in debug mode with autoreload (default: False)')
tornado.options.define('version', default=None, help='Version settings (default: production)')

if __name__ == '__main__':
    tornado.options.parse_command_line()

    options = tornado.options.options
    
    try:
        f = open(__config__, 'r')
        config = yaml.load(f)
        f.close()
    except IOError:
        print('Invalid or missing config file %s' % __config__)
    
    # if no settings, we go away
    if 'settings' not in config:
        print('No default configuration found')
        sys.exit(1)
    
    if options.version and options.version in config['extra_settings']:
        settings = dict(
            config['settings'],
            **config['extra_settings'][options.version]
        )
    else:
        settings = config['settings']

    if options.debug:
        settings['debug'] = options.debug
    if options.user:
        settings['current_user'] = options.user

    for k,v in settings.items():
        if k.endswith('_path'):
            settings[k] = settings[k].replace(
                '__path__',
                os.path.dirname(__file__)
            )
    
    server = tornado.httpserver.HTTPServer(Application(settings))
    server.listen(config['port'])
    logging.info("Server started on %d" % config['port'])
    tornado.ioloop.IOLoop.instance().start()
