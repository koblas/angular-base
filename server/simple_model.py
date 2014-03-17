import os
import uuid
import json
import yaml

"""
  This is called SimpleModel - alas it's not so simple, but in practice it's
  trying to be a very simple abstraction on flat file models
"""

__all__ = [
    'Model',
    'PrimaryKeyField',
    'TextField',
    'BooleanField',
    'IntegerField',
]

#
#
#
class DoesNotExist(Exception): pass
class MultipleObjectsReturned(Exception): pass

#
#
#
class FieldDescriptor(object):
    """ A FieldDescriptor is what's places on the instantiated object """

    def __init__(self, field):
        self.field = field
        self.att_name = self.field.name

    def __get__(self, instance, instance_type=None):
        if instance is not None:
            return instance._data.get(self.att_name)
        return self.field

    def __set__(self, instance, value):
        instance._data[self.att_name] = value

class Field(object):
    """ A field defines a field on a Model Class """

    def add_to_class(self, model_class, name):
        self.name = name
        self.model_class = model_class

        model_class._fields[name] = self

        setattr(model_class, name, FieldDescriptor(self))

class PrimaryKeyField(Field):
    """ Primary Key Field Specifies the name for the primary key """

class TextField(Field):
    pass

class BooleanField(Field):
    pass

# Python 2/3 meta class support
def with_metaclass(meta, base=object):
    return meta("NewBase", (base,), {})

class Backend(object):
    """
      Store records in YAML/JSON files
    """

    def __init__(self, path, cls, format='json'):
        self.loaded = False
        self._items = []
        self._cls = cls
        self.name = cls.__name__.lower()
        self.format = 'yaml'
        self.path = '%s/%s.%s' % (path, self.name, self.format)

    def __iter__(self):
        if not self.loaded:
            self._load()
            self.loaded = True
        for item in self._items:
            yield item

    def append(self, item):
        self._items.append(item)
        self.save()

    def remove(self, key):
        """ Remove a specific ID from the storage and update """
        for idx, t in enumerate(self):
            if t._id == key:
                del self._items[idx]
                break
        self.save()
        
    def _load(self):
        if os.path.exists(self.path):
            with open(self.path, 'r') as stream:
                if self.format == 'json':
                    for line in stream:
                        params = json.loads(line)
                        self._items.append(self._cls(**params))
                elif self.format == 'yaml':
                    items = yaml.load(stream)
                    for item in items or []:
                        self._items.append(self._cls(**item))

    def save(self):
        with open(self.path, 'w') as stream:
            if self.format == 'json':
                for item in self._items:
                    stream.write(json.dumps(item._data))
                    stream.write('\n')
            elif self.format == 'yaml':
                stream.write(yaml.dump([{k:v for k,v in item._data.items()} for item in self._items], default_flow_style=False))

class ModelOptions(object):
    """
      Container to store meta information - like the backend
    """
    def __init__(self, cls, database=None):
        self.model_class = cls
        self.name = cls.__name__.lower()
        self.backend = Backend('./db', cls, format='yaml')

class BaseModel(type):
    """
      Handle the Meta information
    """
    def __new__(cls, name, bases, attrs):
        if not bases:
            return super(BaseModel, cls).__new__(cls, name, bases, attrs)

        meta_options = {}
        cls = super(BaseModel, cls).__new__(cls, name, bases, attrs)
        cls._meta = ModelOptions(cls, **meta_options)
        cls._data = None
        cls._fields = {}
        cls._pk_field = 'id'

        for name, v in cls.__dict__.items():
            if isinstance(v, (Field,)):
                v.add_to_class(cls, name)
            if isinstance(v, PrimaryKeyField):
                cls._pk_field = name

        exc_name = '%sDoesNotExist' % cls.__name__
        cls.DoesNotExist = type(exc_name, (DoesNotExist,), {})

        exc_name = '%sMultipleObjectsReturned' % cls.__name__
        cls.MultipleObjectsReturned = type(exc_name, (MultipleObjectsReturned,), {})

        return cls

class Model(with_metaclass(BaseModel, base=object)):
    """
      A really trivial model class that mimics some Django/peewee but is build for flat files.
    """

    def __init__(self, **kwargs):
        self._data = {}
        self._id = None

        for k, v in kwargs.items():
            if k not in self._fields:
                raise AttributeError("Bad argument: %s" % k)
            self._data[k] = v
            if k == self._pk_field:
                self._id = v

    @classmethod
    def _next_id(cls):
        return str(uuid.uuid4())

    @classmethod
    def get(cls, **params):
        v = cls.filter(**params)
        if not v:
            raise cls.DoesNotExist()
        if len(v) > 1:
            raise cls.MultipleObjectsReturned()
        return v[0]

    @classmethod
    def filter(cls, **params):
        items = list(cls._meta.backend)
        for k, v in params.items():
            items = [item for item in items if item._data[k] == params[k]]
        return items

    @classmethod
    def create(cls, **params):
        item = cls(**params)
        item.save()
        return item

    def remove(self):
        self._meta.backend.remove(self._id)

    def save(self):
        if self._id is None:
            self._data['id'] = self._id = self._next_id()
            self._meta.backend.append(self)
        else:
            self._meta.backend.save()

    def __repr__(self):
        return "<%s[%s] %s>" % (self.__class__.__name__, self._id, 
                                " ".join(["%s=%r" % (k, self._data[k]) for k in self._fields if k != self._pk_field]))

    def to_dict(self):
        """ Return a dict() representation of the data - this is for output serialization """
        return self._data
