#! /usr/bin/env python
# *-* coding: utf8 *-*

__author__ = 'David Koblas'
__email__ = 'david@koblas.com'
__date__ = '2014-03-01'
__appname__ = 'app.py'
__version__ = 0.1
__config__ = 'settings.yaml'

import optparse

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
    
    params = { }
    env = None

    if options.version:
        env = options.version
    if options.debug:
        params['debug'] = options.debug
    if options.user:
        params['current_user'] = options.user

    app = Application(env, params=params)
    server = tornado.httpserver.HTTPServer(app)
    server.listen(app.settings.get('port',8000))
    logging.info("Server started on %d" % app.settings.get('port',8000))
    tornado.ioloop.IOLoop.instance().start()
