from .simple_model import Model, TextField, BooleanField, PrimaryKeyField
import logging

logger = logging.getLogger(__name__)

#
#  Pretend we have good passwords, but it's a demo.
#
try:
    import bcrypt

    def hashpw(password, hashed):
        return bcrypt.hashpw(password, hashed)
    def gensalt():
        return bcrypt.gensalt()
except:
    logger.warning("No Bcrypt - using cleartext passwords")

    def hashpw(password, hashed):
        return password
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
        return hashpw(password, self.password) == self.password

    def set_password(self, passwd):
        self.password = hashpw(passwd, gensalt())

class Todo(Model):
    id        = PrimaryKeyField()
    title     = TextField()
    completed = BooleanField()
