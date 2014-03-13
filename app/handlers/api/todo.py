import json
import tornado.escape
from ..base import BaseHandler
from ...route import route

class Todo(dict):
    MAX_ID = 0
    TODOS = []

    def __init__(self, title=None, completed=False):
        self['id'] = self._next_id()
        self['completed'] = completed
        self['title'] = title

    @classmethod
    def _next_id(cls):
        cls.MAX_ID += 1
        return cls.MAX_ID

    @classmethod
    def get(cls, id):
        for t in cls.TODOS:
            if t['id'] == id:
                return t
        return None

    @classmethod
    def find(cls, **params):
        todos = cls.TODOS
        if 'completed' in params:
            todos = [t for t in todos if t['completed'] == params['completed']]
        return todos

    @classmethod
    def create(cls, **params):
        todo = cls(title=params.get('title',''), completed=params.get('completed', False))
        cls.TODOS.append(todo)
        return todo

    def remove(self):
        for idx, t in enumerate(self.TODOS):
            if t['id'] == id:
                del self.TODOS[idx]
                break
        return None
        

@route("/api/v1/todo/?(?P<id>\d+)?")
class TodoHandler(BaseHandler):
    MAX_ID = 0
    TODOS = [ ]

    def get(self, id=None):
        if id:
            self.finish({
                'status': 'ok',
                'data' : Todo.get(int(id))
            })
        else:
            params = {}
            if self.get_argument('completed', None):
                params['completed'] = (self.get_argument('completed') == 'true')
                
            self.finish({
                'status': 'ok',
                'data' : Todo.find(**params)
            })

    def post(self, id=None):
        data = tornado.escape.json_decode(self.request.body) 

        if data and data['title']:
            self.finish({
                'status': 'ok',
                'data' : Todo.create(title=data['title'])
            })
        else:
            self.set_status(404)
            self.finish({
                'status': 'err',
                'message': 'Empty Title'
            });

    def put(self, id=None):
        data = tornado.escape.json_decode(self.request.body) 
        todo = Todo.get(int(id))
            
        if todo:
            if 'completed' in data:
                todo['completed'] = data['completed']
            if 'title' in data:
                todo['title'] = data['title']

        self.finish({
            'status': 'ok',
            'data' : todo
        })

    def delete(self, id=None):
        todo = Todo.get(int(id))
        todo.remove()

        self.finish({
            'status': 'ok',
        })
