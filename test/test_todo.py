from tornado.httpclient import AsyncHTTPClient, HTTPError
from tornado.testing import AsyncHTTPTestCase, gen_test
from server.application import Application
from tornado import gen

class TodoTest(AsyncHTTPTestCase):
    def get_app(self):
        return Application()

    @gen_test
    def test_auth(self):
        methods = [
            ('GET', 302),
            ('POST', 403),
            ('DELETE', 403),
            ('HEAD', 405),
        ]

        for m, code in methods:
            params = {
                'method': m,
                'follow_redirects' : False,
            }
            if m == 'POST': params['body'] = ""
            response = None
            try:
                response = yield self.http_client.fetch(self.get_url('/api/v1/todo'), **params)
            except HTTPError as e:
                response = e.response
            self.assertEqual(response.code, code, msg="Bad response code - method=%s got=%d expected=%d" % (m, response.code, code))
