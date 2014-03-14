import uuid

class SimpleModel(dict):
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            if k not in self.FIELDS:
                raise AttributeError("Bad argument: %s" % k)
            self[k] = v

        self.id = self._next_id()
        self['id'] = self.id

    @classmethod
    def _next_id(cls):
        return str(uuid.uuid4())

    @classmethod
    def get(cls, id):
        for t in cls.ITEMS:
            if t.id == id:
                return t
        return None

    @classmethod
    def find(cls, **params):
        items = cls.ITEMS
        for k, v in params.items():
            items = [t for t in items if t[k] == params[k]]
        return items

    @classmethod
    def create(cls, **params):
        item = cls(**params)
        cls.ITEMS.append(item)
        return item

    def remove(self):
        for idx, t in enumerate(self.ITEMS):
            if t.id == id:
                del self.ITEMS[idx]
                break
        return None

class User(SimpleModel):
    ITEMS  = []
    FIELDS = ('username', 'email', 'password')

    def validate(self, password):
        return self['password'] == password

class Todo(SimpleModel):
    ITEMS  = []
    FIELDS = ('title', 'completed')
