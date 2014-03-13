from ..base import BaseHandler
from ...route import route

PHONES = [
     {'id': 1, 'name': 'Nexus S', 'snippet': 'Fast just got faster with Nexus S.'},
     {'id': 2, 'name': 'Motorola XOOM™ with Wi-Fi', 'snippet': 'The Next, Next Generation tablet.'},
     {'id': 3, 'name': 'MOTOROLA XOOM™', 'snippet': 'The Next, Next Generation tablet.'},
     {'id': 4, 'name': 'iPhone', 'snippet': 'Another phone'},
]

@route("/api/v1/phone")
class PhoneHandler(BaseHandler):
    def get(self):
        self.finish({
            'status': 'ok',
            'data' : PHONES
        })
