import json
import tornado.escape
from tornado.web import authenticated
from ..base import BaseHandler
from ...route import route
from ...models import Todo

@route("/api/v1/todo/?(?P<id>[a-zA-Z0-9_-]+)?")
class TodoHandler(BaseHandler):
    @authenticated
    def get(self, id=None):
        if id:
            self.finish_data(Todo.get(id).serialize())
        else:
            params = {}
            if self.get_argument('completed', None):
                params['completed'] = (self.get_argument('completed') == 'true')
                
            self.finish_data([t.serialize() for t in Todo.find(**params)])

    @authenticated
    def post(self, id=None):
        title = self.get_param('title')

        if title:
            self.finish_data(Todo.create(title=title, completed=False).serialize())
        else:
            self.finish_err('Empty Title')

    @authenticated
    def put(self, id=None):
        todo = Todo.get(id)
            
        if todo:
            if 'completed' in self.parameters:
                todo.completed = self.get_param('completed')
            if 'title' in self.parameters:
                todo.title = self.get_param('title')
            todo.save()

        self.finish_data(todo.serialize())

    @authenticated
    def delete(self, id=None):
        todo = Todo.get(id)
        todo.remove()

        self.finish_data()
