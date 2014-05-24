import json
import tornado.escape
from tornado.web import authenticated
from ..base import BaseHandler, api_authenticated
from ...route import route
from ...models import Todo

@route("/api/v1/todo/?(?P<id>[a-zA-Z0-9_-]+)?")
class TodoHandler(BaseHandler):
    @api_authenticated
    def get(self, id=None):
        if id:
            todo = Todo.get(id=id)
            if todo.user_id != self.current_user.id:
                self.finish_err("Not your TODO")
                return
            self.finish_data(todo)
        else:
            params = { 'user_id' : self.current_user.id }
            if self.get_argument('completed', None):
                params['completed'] = (self.get_argument('completed') == 'true')
                
            self.finish_data(Todo.filter(**params))

    @api_authenticated
    def post(self, id=None):
        title = self.get_param('title')

        if title:
            self.finish_data(Todo.create(title=title, completed=False, user_id=self.current_user.id))
        else:
            self.finish_err('Empty Title')

    @api_authenticated
    def put(self, id=None):
        todo = Todo.get(id=id)

        if todo.user_id != self.current_user.id:
            self.finish_err("Not your TODO")
            return
            
        if todo:
            if 'completed' in self.parameters:
                todo.completed = self.get_param('completed')
            if 'title' in self.parameters:
                todo.title = self.get_param('title')
            todo.save()

        self.finish_data(todo)

    @authenticated
    def delete(self, id=None):
        todo = Todo.get(id=id)
        if todo.user_id == self.current_user.id:
            todo.remove()

        self.finish_data()
