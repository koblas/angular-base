from .simple_model import Model, TextField, BooleanField, PrimaryKeyField
import logging

logger = logging.getLogger(__name__)

#
#  Pretend we have good passwords, but it's a demo.
#
try:
    import bcrypt
except:
    logger.warning("No Bcrypt - using cleartext passwords")

    class bcrypt:
        @staticmethod
        def hashpw(password, hashed):
            return password

        @staticmethod
        def gensalt():
            return None


#
#  Model classes
#

class User(Model):
    id       = PrimaryKeyField()
    username = TextField()
    email    = TextField()
    password = TextField()
        
    def validate(self, password):
        return bcrypt.hashpw(password, self.password) == self.password

    def set_password(self, passwd):
        self.password = bcrypt.hashpw(passwd, bcrypt.gensalt())

class Todo(Model):
    id        = PrimaryKeyField()
    title     = TextField()
    user_id   = TextField()
    completed = BooleanField()
