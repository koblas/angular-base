# Learning Angular

Fundamentally this is a project I'm working on to learn agular without a whole ton of legacy.  Though I'm also thinking
it's useful to understand the bits and pieces to make a meaningful and useful application.

Ideas that are incorporated:

* Using the Authorized HTTP rather than raw cookies for authentication 
    http://www.frederiknakstad.com/2013/01/21/authentication-in-single-page-applications-with-angular-js/
* Restangular - Used meta data wrapped response
    https://github.com/mgonto/restangular
* Promise based auth

## Notable things

There is an interesting model abstraction for flat files in app/simple_model.py - need to figure out the docs


## TODO

* Add some docstrings to the Python code
* unittest harness for python
* unittest for angular
* Cleanup the default templates - maybe a bit more functional
* Use a token refresh mechansim if auth expires...


## TODO - simple_model.py

What's the line between simple, useful and too complex.

* Add basic field validation/casting to the model
