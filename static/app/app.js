(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app;

app = angular.module('iqvine', ['restangular', 'ui.router', 'ngCookies']);

angular.element(document).ready(function() {
  return angular.bootstrap(document, ['iqvine']);
});

require('./services/auth');

require('./controllers/main');

require('./controllers/todo');

require('./controllers/auth');

app.config(function($stateProvider) {
  return $stateProvider.state('app', {
    url: '',
    abstract: true,
    views: {
      container: {
        template: require('../partials/layout.html')
      },
      footer: {
        template: require('../partials/footer.html')
      },
      header: {
        controller: 'HeaderController',
        template: require('../partials/header.html')
      }
    }
  });
});

app.config(function(RestangularProvider, $stateProvider, $urlRouterProvider) {
  RestangularProvider.setBaseUrl('/api/v1');
  RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
    var newResponse;
    if (operation === "getList") {
      return newResponse = response.data;
    } else {
      return newResponse = response.data;
    }
  });
  return $urlRouterProvider.otherwise("/");
});

app.run(function($rootScope, $state, $location, AuthService) {
  return $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    var href;
    if (toState.authenticate && !AuthService.isAuthenticated()) {
      href = $state.href(toState, toParams);
      $state.transitionTo("login", {
        next: $location.path()
      });
      return event.preventDefault();
    }
  });
});


},{"../partials/footer.html":9,"../partials/header.html":10,"../partials/layout.html":12,"./controllers/auth":2,"./controllers/main":3,"./controllers/todo":4,"./services/auth":5}],2:[function(require,module,exports){
var app;

app = angular.module('iqvine');

app.config(function($stateProvider) {
  return $stateProvider.state('app.auth', {
    abstract: true,
    url: "/auth",
    template: '<ui-view/>'
  }).state('app.auth.register', {
    url: "/register?next",
    views: {
      'content@app': {
        template: require("../../partials/auth/register.html"),
        controller: "RegisterController",
        authenticate: false
      }
    }
  }).state('app.auth.login', {
    url: "/login?next",
    views: {
      'content@app': {
        template: require("../../partials/auth/login.html"),
        controller: "LoginController",
        authenticate: false
      }
    }
  }).state('app.auth.logout', {
    url: "/logout",
    views: {
      'content@app': {
        template: "<div></div>",
        controller: "LogoutController",
        authenticate: false
      }
    }
  });
});

app.controller('LoginController', function($scope, $location, AuthService, $stateParams) {
  var _ref;
  $scope.email = "";
  $scope.error = "";
  $scope.next = ((_ref = $stateParams.params) != null ? _ref.next : void 0) || '/';
  return $scope.login = function() {
    if (!$scope.email) {
      $scope.error = "Invalid Email Address";
      return;
    }
    if (!$scope.password) {
      $scope.error = "Invalid Password";
      return;
    }
    return AuthService.login($scope.email, $scope.password).then(function() {
      return $location.path($scope.next);
    })["catch"](function(err) {
      return console.log("Auth Error", err);
    });
  };
});

app.controller('RegisterController', function($scope, $location, AuthService, $stateParams) {
  var _ref;
  $scope.password = "";
  $scope.username = "";
  $scope.email = "";
  $scope.error = "";
  $scope.next = ((_ref = $stateParams.params) != null ? _ref.next : void 0) || '/';
  return $scope.register = function() {
    if (!$scope.email) {
      $scope.error = "Invalid Email Address";
      return;
    }
    if (!$scope.username) {
      $scope.error = "Invalid Username";
      return;
    }
    if (!$scope.password) {
      $scope.error = "Invalid Password";
      return;
    }
    return AuthService.register($scope.email, $scope.password, {
      username: $scope.username
    }).then(function() {
      return $location.path($scope.next);
    })["catch"](function(err) {
      return $scope.error = err;
    });
  };
});


},{"../../partials/auth/login.html":6,"../../partials/auth/register.html":7}],3:[function(require,module,exports){
var app;

app = angular.module('iqvine');

app.config(function($stateProvider) {
  $stateProvider.state('app.index_', {
    url: '',
    views: {
      'content@app': {
        template: require('../../partials/index.html'),
        controller: "IndexController",
        authenticate: false
      }
    }
  });
  return $stateProvider.state('app.index', {
    url: '/',
    views: {
      'content@app': {
        template: require('../../partials/index.html'),
        controller: "IndexController",
        authenticate: false
      }
    }
  });
});

app.controller('IndexController', function($scope, $state, AuthService) {
  if (AuthService.isAuthenticated()) {
    return $state.go('app.dashboard');
  }
});

app.controller('HeaderController', function($scope, AuthService, $location) {
  $scope.auth = AuthService;
  return $scope.logout = function() {
    AuthService.logout();
    return $location.path('/');
  };
});


},{"../../partials/index.html":11}],4:[function(require,module,exports){
var app;

app = angular.module('iqvine');

app.config(function($stateProvider) {
  return $stateProvider.state('app.dashboard', {
    url: '/dash',
    views: {
      'content@app': {
        template: require('../../partials/dashboard.html'),
        controller: "DashboardController",
        authenticate: true
      }
    }
  }).state('app.todo', {
    url: '/todo',
    views: {
      'content@app': {
        template: require('../../partials/todo.html'),
        controller: "TodoController",
        authenticate: true
      }
    }
  });
});

app.controller('DashboardController', function($scope, Restangular) {
  return true;
});

app.controller('TodoController', function($scope, Restangular) {
  var Todo;
  $scope.todos = [];
  $scope.loaded = false;
  Todo = Restangular.all('todo');
  Todo.getList().then(function(todos) {
    $scope.loaded = true;
    return $scope.todos = todos;
  });
  $scope.addTodo = function(title) {
    if (title) {
      return Todo.post({
        'title': title
      }).then(function(todo) {
        $scope.newTodoTitle = '';
        if (todo) {
          return $scope.todos.push(todo);
        }
      }, function(err) {
        return alert(err.data.message || "an error occurred");
      });
    }
  };
  $scope.changeCompleted = function(todo) {
    return todo.put().then(null, function(err) {
      return alert(err.data.message || (err.errors && err.errors.completed) || "an error occurred");
    });
  };
  return $scope.removeCompletedItems = function() {
    return $scope.todos.forEach(function(todo) {
      if (!todo.completed) {
        return;
      }
      return todo.remove().then(function() {
        return $scope.todos = _.without($scope.todos, todo);
      }, function(err) {
        return alert(err.data.message || (err.errors && err.errors.completed) || "an error occurred");
      });
    });
  };
});


},{"../../partials/dashboard.html":8,"../../partials/todo.html":13}],5:[function(require,module,exports){
var app;

app = angular.module('iqvine');

app.service('AuthService', function(Restangular, $q, $cookies, $state) {
  var Auth, auth_cookie, self;
  Auth = Restangular.all('auth');
  auth_cookie = 'user_auth';
  self = this;
  self.authenticated = false;
  self.name = null;
  if ($cookies[auth_cookie]) {
    this.authenticated = true;
    Auth.post({
      token: $cookies[auth_cookie]
    }).then(function(auth) {
      if (auth && auth.token) {
        return Restangular.setDefaultHeaders({
          Authorization: 'Basic ' + auth.token
        });
      } else {
        delete $cookies[auth_cookie];
        self.authenticated = false;
        return $state.transitionTo("index");
      }
    });
  }
  return {
    isAuthenticated: function() {
      return self.authenticated;
    },
    login: function(email, password) {
      var deferred;
      deferred = $q.defer();
      Auth.post({
        email: email,
        password: password
      }).then(function(auth) {
        if (auth.token) {
          self.authenticated = true;
          $cookies[auth_cookie] = auth.token;
          Restangular.setDefaultHeaders({
            Authorization: 'Basic ' + auth.token
          });
          return deferred.resolve("ok");
        } else {
          return deferred.reject("unknown");
        }
      }, function(err) {
        return deferred.reject(err.data.emsg);
      });
      return deferred.promise;
    },
    logout: function() {
      self.authenticated = false;
      delete $cookies[auth_cookie];
      return Restangular.setDefaultHeaders({
        Authorization: 'Basic ' + 'INVALID'
      });
    },
    register: function(email, password, params) {
      var deferred;
      deferred = $q.defer();
      Auth.post({
        email: email,
        password: password,
        params: params
      }, {
        register: true
      }).then(function(auth) {
        if (auth.token) {
          self.authenticated = true;
          $cookies[auth_cookie] = auth.token;
          Restangular.setDefaultHeaders({
            Authorization: 'Basic ' + auth.token
          });
          return deferred.resolve("ok");
        } else {
          return deferred.reject("unknown");
        }
      }, function(err) {
        return deferred.reject(err.data.emsg);
      });
      return deferred.promise;
    }
  };
});


},{}],6:[function(require,module,exports){
module.exports = '  <form class="form-horizontal" role="form" ng-submit="login()">\n    <input type="hidden" name="next" value="{{next}}"/>\n      <div class="form-group {% if error %}error{% end %}">\n        <label class="col-sm-2 control-label" for="email">Email</label>\n        <div class="col-sm-4">\n          <input type="text" class="form-control" name="email" id="email" ng-model="email">\n          <span ng-hide class="help-inline">{{ error }}</span>\n        </div>\n      </div>\n\n      <div class="form-group">\n        <label class="col-sm-2 control-label" for="password">Password</label>\n        <div class="col-sm-4">\n          <input type="password" class="form-control" name="password" ng-model="password" id="password">\n        </div>\n      </div>\n\n    <div class="form-group">\n      <button type="submit" class="col-sm-offset-3 col-sm-2 btn btn-primary">Login</button>\n    </div>\n </form>\n';
},{}],7:[function(require,module,exports){
module.exports = '  <form class="form-horizontal" role="form" ng-submit="register()">\n    <input type="hidden" name="next" value="{{next}}"/>\n      <div class="form-group">\n        <label class="col-sm-2 control-label" for="username">Username</label>\n        <div class="col-sm-4">\n          <input type="text" class="form-control" name="username" id="email" ng-model="username">\n          <span ng-hide class="help-inline">{{ error }}</span>\n        </div>\n      </div>\n\n      <div class="form-group {% if error %}error{% end %}">\n        <label class="col-sm-2 control-label" for="email">Email</label>\n        <div class="col-sm-4">\n          <input type="text" class="form-control" name="email" id="email" ng-model="email">\n          <span ng-hide class="help-inline">{{ error }}</span>\n        </div>\n      </div>\n\n      <div class="form-group">\n        <label class="col-sm-2 control-label" for="password">Password</label>\n        <div class="col-sm-4">\n          <input type="password" class="form-control" name="password" ng-model="password" id="password">\n        </div>\n      </div>\n\n    <div class="form-group">\n      <button type="submit" class="col-sm-offset-3 col-sm-2 btn btn-primary">Register</button>\n    </div>\n </form>\n';
},{}],8:[function(require,module,exports){
module.exports = '  <div class="container">\n    This is your dashboard!\n    <a ui-sref="app.todo">Edit your Todo\'s</a>\n  </div>\n';
},{}],9:[function(require,module,exports){
module.exports = '<div></div>\n';
},{}],10:[function(require,module,exports){
module.exports = '<div class="navbar navbar-default navbar-static-top" role="navigation">\n  <div class="container">\n    <!-- Brand and toggle get grouped for better mobile display -->\n    <div class="navbar-header">\n      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">\n        <span class="sr-only">Toggle navigation</span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n      </button>\n      <a class="navbar-brand" href="/">Edit</a>\n    </div>\n\n    <!-- Collect the nav links, forms, and other content for toggling -->\n    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\n      <ul class="nav navbar-nav" ng-if="auth.isAuthenticated()">\n        <li><a class="active" href="#/todo">Todo</a></li>\n      </ul>\n      <div class="navbar-right">\n        <ul class="nav navbar-nav navbar-right">\n          <li ng-if="auth.isAuthenticated()"><a ng-click="logout()">Logout</a></li>\n          <li ng-if="!auth.isAuthenticated()"><a ui-sref="app.auth.register">Register</a></li>\n          <li ng-if="!auth.isAuthenticated()"><a ui-sref="app.auth.login">Login</a></li>\n        </ul>\n      </div>\n      <div class="col-xs-5 col-sm-4 pull-right" ng-if="auth.isAuthenticated()">\n        <!--\n        <form class="navbar-form" role="search" method="POST" action="/search">\n          <div class="input-group">\n            <input type="text" class="form-control" placeholder="Search Here" name="term" id="search"/>\n            <span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>\n          </div>\n        </form>\n        -->\n      </div>\n    </div><!-- /.navbar-collapse -->\n  </div><!-- /.container-fluid -->\n</div>\n';
},{}],11:[function(require,module,exports){
module.exports = '  <div class="container">\n  You\'re not logged in - \n    <a class="btn btn-primary" ui-sref="app.auth.login">Login</a>\n    or\n    <a class="btn btn-primary" ui-sref="app.auth.register">Register</a>\n  </div>\n';
},{}],12:[function(require,module,exports){
module.exports = '<div ui-view="content"></div>\n';
},{}],13:[function(require,module,exports){
module.exports = '  <div class="container">\n    <h1>Todos</h1>\n    <p id="empty" ng-hide="todos.length || !loaded">You don\'t have any todos! Add one now:</p>\n    <ul id="todos" class="list-unstyled">\n      <li ng-repeat="todo in todos">\n        <label class="checkbox">\n          <input type="checkbox" ng-model="todo.completed" ng-change="changeCompleted(todo)" />\n          {{todo.title}}\n        </label>\n      </li>\n    </ul>\n    <form class="form-inline">\n      <input id="todo-title" class="form-control" type="text" ng-model="newTodoTitle" />\n      <button id="add-btn" class="btn btn-success" ng-click="addTodo(newTodoTitle)">Add</button>\n    </form>\n    <p>\n      <a href id="remove-completed-btn" ng-click="removeCompletedItems()">Remove completed items</a>\n    </p>\n  </div>\n';
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9rb2JsYXMvcmVwb3MvZWRpdC9jbGllbnQvYXBwL2FwcC5jb2ZmZWUiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L2FwcC9jb250cm9sbGVycy9hdXRoLmNvZmZlZSIsIi9Vc2Vycy9rb2JsYXMvcmVwb3MvZWRpdC9jbGllbnQvYXBwL2NvbnRyb2xsZXJzL21haW4uY29mZmVlIiwiL1VzZXJzL2tvYmxhcy9yZXBvcy9lZGl0L2NsaWVudC9hcHAvY29udHJvbGxlcnMvdG9kby5jb2ZmZWUiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L2FwcC9zZXJ2aWNlcy9hdXRoLmNvZmZlZSIsIi9Vc2Vycy9rb2JsYXMvcmVwb3MvZWRpdC9jbGllbnQvcGFydGlhbHMvYXV0aC9sb2dpbi5odG1sIiwiL1VzZXJzL2tvYmxhcy9yZXBvcy9lZGl0L2NsaWVudC9wYXJ0aWFscy9hdXRoL3JlZ2lzdGVyLmh0bWwiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L3BhcnRpYWxzL2Rhc2hib2FyZC5odG1sIiwiL1VzZXJzL2tvYmxhcy9yZXBvcy9lZGl0L2NsaWVudC9wYXJ0aWFscy9mb290ZXIuaHRtbCIsIi9Vc2Vycy9rb2JsYXMvcmVwb3MvZWRpdC9jbGllbnQvcGFydGlhbHMvaGVhZGVyLmh0bWwiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L3BhcnRpYWxzL2luZGV4Lmh0bWwiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L3BhcnRpYWxzL2xheW91dC5odG1sIiwiL1VzZXJzL2tvYmxhcy9yZXBvcy9lZGl0L2NsaWVudC9wYXJ0aWFscy90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QUFJLENBQUMsS0FBaEM7V0FBOUIsQ0FIQSxDQUFBO2lCQUlBLFFBQVEsQ0FBQyxPQUFULENBQWlCLElBQWpCLEVBTEo7U0FBQSxNQUFBO2lCQU9JLFFBQVEsQ0FBQyxNQUFULENBQWdCLFNBQWhCLEVBUEo7U0FENkU7TUFBQSxDQUFqRixFQVNFLFNBQUMsR0FBRCxHQUFBO2VBQ0UsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUF6QixFQURGO01BQUEsQ0FURixDQUZBLENBQUE7YUFjQSxRQUFRLENBQUMsUUFmSDtJQUFBLENBL0JQO0dBQVAsQ0F4QnVCO0FBQUEsQ0FBM0IsQ0FGQSxDQUFBOzs7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUEiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFwcCA9IGFuZ3VsYXIubW9kdWxlICdpcXZpbmUnLCBbJ3Jlc3Rhbmd1bGFyJywgJ3VpLnJvdXRlcicsICduZ0Nvb2tpZXMnXVxuXG5hbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLnJlYWR5ICgpIC0+IGFuZ3VsYXIuYm9vdHN0cmFwKGRvY3VtZW50LCBbJ2lxdmluZSddKVxuXG5yZXF1aXJlKCcuL3NlcnZpY2VzL2F1dGgnKVxucmVxdWlyZSgnLi9jb250cm9sbGVycy9tYWluJylcbnJlcXVpcmUoJy4vY29udHJvbGxlcnMvdG9kbycpXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2F1dGgnKVxuXG4jXG4jICBTZXQgdGhlIGxheW91dFxuI1xuYXBwLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpIC0+XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAnLFxuICAgICAgICAgICAgdXJsOiAnJ1xuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWVcbiAgICAgICAgICAgIHZpZXdzOlxuICAgICAgICAgICAgICAgIGNvbnRhaW5lcjpcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnRpYWxzL2xheW91dC5odG1sJylcbiAgICAgICAgICAgICAgICBmb290ZXI6XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuLi9wYXJ0aWFscy9mb290ZXIuaHRtbCcpXG4gICAgICAgICAgICAgICAgaGVhZGVyOlxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSGVhZGVyQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnRpYWxzL2hlYWRlci5odG1sJylcbiAgICAgICAgKVxuXG4jXG4jICBSZXN0YW51Z2xhciBzZXR1cFxuI1xuYXBwLmNvbmZpZyAoUmVzdGFuZ3VsYXJQcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgLT5cbiAgICBSZXN0YW5ndWxhclByb3ZpZGVyLnNldEJhc2VVcmwoJy9hcGkvdjEnKVxuXG4gICAgUmVzdGFuZ3VsYXJQcm92aWRlci5zZXRSZXNwb25zZUV4dHJhY3RvciAocmVzcG9uc2UsIG9wZXJhdGlvbiwgd2hhdCwgdXJsKSAtPlxuICAgICAgICAgICAgIyAgVGhpcyBpcyBhIGdldCBmb3IgYSBsaXN0XG4gICAgICAgICAgICBpZiBvcGVyYXRpb24gaXMgXCJnZXRMaXN0XCIgXG4gICAgICAgICAgICAgICAgIyAgSGVyZSB3ZSdyZSByZXR1cm5pbmcgYW4gQXJyYXkgd2hpY2ggaGFzIG9uZSBzcGVjaWFsIHByb3BlcnR5IG1ldGFkYXRhIHdpdGggb3VyIGV4dHJhIGluZm9ybWF0aW9uXG4gICAgICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgICBlbHNlIFxuICAgICAgICAgICAgICAgICMgIFRoaXMgaXMgYW4gZWxlbWVudFxuICAgICAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgIyAgVW5tYXRjaGVkIFVSTCBzdGF0ZVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpXG5cbmFwcC5ydW4gKCRyb290U2NvcGUsICRzdGF0ZSwgJGxvY2F0aW9uLCBBdXRoU2VydmljZSkgLT5cbiAgICAkcm9vdFNjb3BlLiRvbiBcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykgLT5cbiAgICAgICAgaWYgdG9TdGF0ZS5hdXRoZW50aWNhdGUgJiYgIUF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpXG4gICAgICAgICAgICAjICBVc2VyIGlzbuKAmXQgYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgaHJlZiA9ICRzdGF0ZS5ocmVmKHRvU3RhdGUsIHRvUGFyYW1zKVxuICAgICAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhcImxvZ2luXCIsIHsgbmV4dDogJGxvY2F0aW9uLnBhdGgoKSB9KVxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuIiwiYXBwID0gYW5ndWxhci5tb2R1bGUoJ2lxdmluZScpXG5cbmFwcC5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKSAtPlxuICAgICMgIFN0YXRlc1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmF1dGgnLCB7XG4gICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZVxuICAgICAgICAgICAgdXJsOiBcIi9hdXRoXCJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHVpLXZpZXcvPidcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhcHAuYXV0aC5yZWdpc3RlcicsIHtcbiAgICAgICAgICAgIHVybDogXCIvcmVnaXN0ZXI/bmV4dFwiXG4gICAgICAgICAgICB2aWV3czpcbiAgICAgICAgICAgICAgICAnY29udGVudEBhcHAnOlxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZShcIi4uLy4uL3BhcnRpYWxzL2F1dGgvcmVnaXN0ZXIuaHRtbFwiKVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIlJlZ2lzdGVyQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0ZTogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhcHAuYXV0aC5sb2dpbicsIHtcbiAgICAgICAgICAgIHVybDogXCIvbG9naW4/bmV4dFwiXG4gICAgICAgICAgICB2aWV3czpcbiAgICAgICAgICAgICAgICAnY29udGVudEBhcHAnOlxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZShcIi4uLy4uL3BhcnRpYWxzL2F1dGgvbG9naW4uaHRtbFwiKVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkxvZ2luQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0ZTogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhcHAuYXV0aC5sb2dvdXQnLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2xvZ291dFwiXG4gICAgICAgICAgICAjIHRlbXBsYXRlOiByZXF1aXJlKFwiLi4vLi4vcGFydGlhbHMvYXV0aC9sb2dvdXQuaHRtbFwiKVxuICAgICAgICAgICAgdmlld3M6XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzpcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdj48L2Rpdj5cIlxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkxvZ291dENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICBhdXRoZW50aWNhdGU6IGZhbHNlXG4gICAgICAgIH0pXG5cbmFwcC5jb250cm9sbGVyICdMb2dpbkNvbnRyb2xsZXInLCAoJHNjb3BlLCAkbG9jYXRpb24sICBBdXRoU2VydmljZSwgJHN0YXRlUGFyYW1zKSAtPlxuICAgICRzY29wZS5lbWFpbCA9IFwiXCJcbiAgICAkc2NvcGUuZXJyb3IgPSBcIlwiXG4gICAgJHNjb3BlLm5leHQgID0gJHN0YXRlUGFyYW1zLnBhcmFtcz8ubmV4dCB8fCAnLydcblxuICAgICRzY29wZS5sb2dpbiA9ICgpIC0+XG4gICAgICAgIGlmICEkc2NvcGUuZW1haWxcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiSW52YWxpZCBFbWFpbCBBZGRyZXNzXCJcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICEkc2NvcGUucGFzc3dvcmRcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiSW52YWxpZCBQYXNzd29yZFwiXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbigkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZClcbiAgICAgICAgICAgIC50aGVuICgpIC0+ICRsb2NhdGlvbi5wYXRoKCRzY29wZS5uZXh0KVxuICAgICAgICAgICAgLmNhdGNoIChlcnIpIC0+IGNvbnNvbGUubG9nKFwiQXV0aCBFcnJvclwiLCBlcnIpXG5cbmFwcC5jb250cm9sbGVyICdSZWdpc3RlckNvbnRyb2xsZXInLCAoJHNjb3BlLCAkbG9jYXRpb24sIEF1dGhTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIC0+XG4gICAgJHNjb3BlLnBhc3N3b3JkID0gXCJcIlxuICAgICRzY29wZS51c2VybmFtZSA9IFwiXCJcbiAgICAkc2NvcGUuZW1haWwgPSBcIlwiXG4gICAgJHNjb3BlLmVycm9yID0gXCJcIlxuICAgICRzY29wZS5uZXh0ICA9ICRzdGF0ZVBhcmFtcy5wYXJhbXM/Lm5leHQgfHwgJy8nXG5cbiAgICAkc2NvcGUucmVnaXN0ZXIgPSAoKSAtPlxuICAgICAgICBpZiAhJHNjb3BlLmVtYWlsXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIkludmFsaWQgRW1haWwgQWRkcmVzc1wiXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgaWYgISRzY29wZS51c2VybmFtZVxuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJJbnZhbGlkIFVzZXJuYW1lXCJcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBpZiAhJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIkludmFsaWQgUGFzc3dvcmRcIlxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIHsgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSB9KVxuICAgICAgICAgICAgLnRoZW4gKCkgLT4gJGxvY2F0aW9uLnBhdGgoJHNjb3BlLm5leHQpXG4gICAgICAgICAgICAuY2F0Y2ggKGVycikgLT4gJHNjb3BlLmVycm9yID0gZXJyXG4iLCJhcHAgPSBhbmd1bGFyLm1vZHVsZSgnaXF2aW5lJyk7XG5cbmFwcC5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKSAtPlxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmluZGV4XycsIHtcbiAgICAgICAgICAgIHVybDogJycsXG4gICAgICAgICAgICB2aWV3czpcbiAgICAgICAgICAgICAgICAnY29udGVudEBhcHAnOlxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vLi4vcGFydGlhbHMvaW5kZXguaHRtbCcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiSW5kZXhDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgYXV0aGVudGljYXRlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2FwcC5pbmRleCcsIHtcbiAgICAgICAgICAgIHVybDogJy8nLFxuICAgICAgICAgICAgdmlld3M6XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzpcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uLy4uL3BhcnRpYWxzL2luZGV4Lmh0bWwnKVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkluZGV4Q29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0ZTogZmFsc2VcbiAgICAgICAgfSk7XG5cbmFwcC5jb250cm9sbGVyICdJbmRleENvbnRyb2xsZXInLCAoJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKSAtPlxuICAgIGlmIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpXG5cbmFwcC5jb250cm9sbGVyICdIZWFkZXJDb250cm9sbGVyJywgKCRzY29wZSwgQXV0aFNlcnZpY2UsICRsb2NhdGlvbikgLT5cbiAgICAkc2NvcGUuYXV0aCA9IEF1dGhTZXJ2aWNlO1xuICAgICRzY29wZS5sb2dvdXQgPSAoKSAtPlxuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiIsImFwcCA9IGFuZ3VsYXIubW9kdWxlKCdpcXZpbmUnKTtcblxuYXBwLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpIC0+XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xuICAgICAgICAgICAgdXJsOiAnL2Rhc2gnXG4gICAgICAgICAgICB2aWV3czpcbiAgICAgICAgICAgICAgICAnY29udGVudEBhcHAnOlxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vLi4vcGFydGlhbHMvZGFzaGJvYXJkLmh0bWwnKVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkRhc2hib2FyZENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICBhdXRoZW50aWNhdGU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhcHAudG9kbycsIHtcbiAgICAgICAgICAgIHVybDogJy90b2RvJ1xuICAgICAgICAgICAgdmlld3M6XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzpcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uLy4uL3BhcnRpYWxzL3RvZG8uaHRtbCcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiVG9kb0NvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICBhdXRoZW50aWNhdGU6IHRydWVcbiAgICAgICAgfSk7XG5cbmFwcC5jb250cm9sbGVyICdEYXNoYm9hcmRDb250cm9sbGVyJywgKCRzY29wZSwgUmVzdGFuZ3VsYXIpIC0+IHRydWVcblxuYXBwLmNvbnRyb2xsZXIgJ1RvZG9Db250cm9sbGVyJywgKCRzY29wZSwgUmVzdGFuZ3VsYXIpIC0+XG4gICAgJHNjb3BlLnRvZG9zID0gW107XG4gICAgJHNjb3BlLmxvYWRlZCA9IGZhbHNlO1xuXG4gICAgVG9kbyA9IFJlc3Rhbmd1bGFyLmFsbCgndG9kbycpXG5cbiAgICBUb2RvLmdldExpc3QoKS50aGVuKFxuICAgICAgICAodG9kb3MpIC0+XG4gICAgICAgICAgICAkc2NvcGUubG9hZGVkID0gdHJ1ZVxuICAgICAgICAgICAgJHNjb3BlLnRvZG9zID0gdG9kb3NcbiAgICApXG5cbiAgICAkc2NvcGUuYWRkVG9kbyA9ICh0aXRsZSkgLT5cbiAgICAgICAgICAgIGlmICh0aXRsZSlcbiAgICAgICAgICAgICAgICBUb2RvLnBvc3Qoeyd0aXRsZSc6IHRpdGxlIH0pLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICh0b2RvKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5ld1RvZG9UaXRsZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvZG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRvZG9zLnB1c2godG9kbyk7XG4gICAgICAgICAgICAgICAgICAgICwgKGVycikgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGVydChlcnIuZGF0YS5tZXNzYWdlIHx8IFwiYW4gZXJyb3Igb2NjdXJyZWRcIik7XG4gICAgICAgICAgICAgICAgKVxuXG4gICAgJHNjb3BlLmNoYW5nZUNvbXBsZXRlZCA9ICh0b2RvKSAtPlxuICAgICAgICB0b2RvLnB1dCgpLnRoZW4obnVsbCwgKGVycikgLT5cbiAgICAgICAgICAgIHJldHVybiBhbGVydChlcnIuZGF0YS5tZXNzYWdlIHx8IChlcnIuZXJyb3JzICYmIGVyci5lcnJvcnMuY29tcGxldGVkKSB8fCBcImFuIGVycm9yIG9jY3VycmVkXCIpO1xuICAgICAgICApXG5cbiAgICAkc2NvcGUucmVtb3ZlQ29tcGxldGVkSXRlbXMgPSAoKSAtPlxuICAgICAgICAkc2NvcGUudG9kb3MuZm9yRWFjaCgodG9kbykgLT5cbiAgICAgICAgICAgIGlmICghdG9kby5jb21wbGV0ZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB0b2RvLnJlbW92ZSgpLnRoZW4oKCkgLT5cbiAgICAgICAgICAgICAgICAkc2NvcGUudG9kb3MgPSBfLndpdGhvdXQoJHNjb3BlLnRvZG9zLCB0b2RvKTtcbiAgICAgICAgICAgICwgKGVycikgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoZXJyLmRhdGEubWVzc2FnZSB8fCAoZXJyLmVycm9ycyAmJiBlcnIuZXJyb3JzLmNvbXBsZXRlZCkgfHwgXCJhbiBlcnJvciBvY2N1cnJlZFwiKTtcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuIiwiYXBwID0gYW5ndWxhci5tb2R1bGUoJ2lxdmluZScpXG5cbmFwcC5zZXJ2aWNlICdBdXRoU2VydmljZScsIChSZXN0YW5ndWxhciwgJHEsICRjb29raWVzLCAkc3RhdGUpIC0+XG4gICAgQXV0aCA9IFJlc3Rhbmd1bGFyLmFsbCgnYXV0aCcpXG4gICAgYXV0aF9jb29raWUgPSAndXNlcl9hdXRoJ1xuICAgIHNlbGYgPSB0aGlzXG4gICAgXG4gICAgc2VsZi5hdXRoZW50aWNhdGVkID0gZmFsc2VcbiAgICBzZWxmLm5hbWUgPSBudWxsXG5cbiAgICAjXG4gICAgIyAgSWYgdGhlIGF1dGggY29va2llIGlzIGFyb3VuZCAtIHVzZSBpdFxuICAgICNcbiAgICBpZiAoJGNvb2tpZXNbYXV0aF9jb29raWVdKSBcbiAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdHJ1ZVxuXG4gICAgICAgIEF1dGgucG9zdCh7dG9rZW46JGNvb2tpZXNbYXV0aF9jb29raWVdfSkudGhlbiAoYXV0aCkgLT5cbiAgICAgICAgICAgIGlmIChhdXRoICYmIGF1dGgudG9rZW4pIFxuICAgICAgICAgICAgICAgICMgIFRva2VuIGlzIGdvb2QsIHNldCB0aGUgYXV0aGVudGljYXRpb24gaGVhZGVyc1xuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLnNldERlZmF1bHRIZWFkZXJzKHtBdXRob3JpemF0aW9uOiAnQmFzaWMgJyArIGF1dGgudG9rZW59KVxuICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICAjICBJZiB0aGUgdG9rZW4gaXMgXCJiYWRcIiBlLmcuIHlvdSdyZSBubyBsb25nZXIgYSB2YWxpZCB1c2VyLCBjbGVhbnVwXG4gICAgICAgICAgICAgICAgZGVsZXRlICRjb29raWVzW2F1dGhfY29va2llXVxuICAgICAgICAgICAgICAgIHNlbGYuYXV0aGVudGljYXRlZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhcImluZGV4XCIpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6ICgpIC0+IHNlbGYuYXV0aGVudGljYXRlZFxuXG4gICAgICAgICNcbiAgICAgICAgIyAgTG9naW4gYSB1c2VyIGJ5IGVtYWlsICsgcGFzc3dvcmQgLSByZXR1cm4gYSBwcm9taXNlXG4gICAgICAgICMgXG4gICAgICAgICMgIFRPRE8gLSBiZXR0ZXIgZXJyb3IgbWVzc2FnZXMgb24gdGhlIHJlc3VsdFxuICAgICAgICAjXG4gICAgICAgIGxvZ2luOiAoZW1haWwsIHBhc3N3b3JkKSAtPlxuICAgICAgICAgICAgZGVmZXJyZWQgPSAkcS5kZWZlcigpXG5cbiAgICAgICAgICAgIEF1dGgucG9zdCh7ZW1haWw6ZW1haWwsIHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbiAoYXV0aCkgLT5cbiAgICAgICAgICAgICAgICBpZiBhdXRoLnRva2VuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aGVudGljYXRlZCA9IHRydWVcblxuICAgICAgICAgICAgICAgICAgICAkY29va2llc1thdXRoX2Nvb2tpZV0gPSBhdXRoLnRva2VuXG4gICAgICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLnNldERlZmF1bHRIZWFkZXJzKHtBdXRob3JpemF0aW9uOiAnQmFzaWMgJyArIGF1dGgudG9rZW59KVxuXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoXCJva1wiKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KFwidW5rbm93blwiKVxuICAgICAgICAgICAgLCAoZXJyKSAtPlxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIuZGF0YS5lbXNnKVxuXG4gICAgICAgICAgICBkZWZlcnJlZC5wcm9taXNlXG5cbiAgICAgICAgbG9nb3V0OiAoKSAtPlxuICAgICAgICAgICAgc2VsZi5hdXRoZW50aWNhdGVkID0gZmFsc2VcbiAgICAgICAgICAgIGRlbGV0ZSAkY29va2llc1thdXRoX2Nvb2tpZV1cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLnNldERlZmF1bHRIZWFkZXJzKHtBdXRob3JpemF0aW9uOiAnQmFzaWMgJyArICdJTlZBTElEJ30pXG5cbiAgICAgICAgcmVnaXN0ZXI6IChlbWFpbCwgcGFzc3dvcmQsIHBhcmFtcykgLT5cbiAgICAgICAgICAgIGRlZmVycmVkID0gJHEuZGVmZXIoKVxuXG4gICAgICAgICAgICBBdXRoLnBvc3Qoe2VtYWlsOmVtYWlsLCBwYXNzd29yZDpwYXNzd29yZCwgcGFyYW1zOnBhcmFtc30sIHtyZWdpc3Rlcjp0cnVlfSkudGhlbiAoYXV0aCkgLT5cbiAgICAgICAgICAgICAgICBpZiBhdXRoLnRva2VuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aGVudGljYXRlZCA9IHRydWVcblxuICAgICAgICAgICAgICAgICAgICAkY29va2llc1thdXRoX2Nvb2tpZV0gPSBhdXRoLnRva2VuXG4gICAgICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLnNldERlZmF1bHRIZWFkZXJzKHtBdXRob3JpemF0aW9uOiAnQmFzaWMgJyArIGF1dGgudG9rZW59KVxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFwib2tcIilcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChcInVua25vd25cIilcbiAgICAgICAgICAgICwgKGVycikgLT5cbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyLmRhdGEuZW1zZylcblxuICAgICAgICAgICAgZGVmZXJyZWQucHJvbWlzZVxuICAgIH1cbiIsIm1vZHVsZS5leHBvcnRzID0gJyAgPGZvcm0gY2xhc3M9XCJmb3JtLWhvcml6b250YWxcIiByb2xlPVwiZm9ybVwiIG5nLXN1Ym1pdD1cImxvZ2luKClcIj5cXG4gICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwibmV4dFwiIHZhbHVlPVwie3tuZXh0fX1cIi8+XFxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgeyUgaWYgZXJyb3IgJX1lcnJvcnslIGVuZCAlfVwiPlxcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29sLXNtLTIgY29udHJvbC1sYWJlbFwiIGZvcj1cImVtYWlsXCI+RW1haWw8L2xhYmVsPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00XCI+XFxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cImVtYWlsXCIgaWQ9XCJlbWFpbFwiIG5nLW1vZGVsPVwiZW1haWxcIj5cXG4gICAgICAgICAgPHNwYW4gbmctaGlkZSBjbGFzcz1cImhlbHAtaW5saW5lXCI+e3sgZXJyb3IgfX08L3NwYW4+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29sLXNtLTIgY29udHJvbC1sYWJlbFwiIGZvcj1cInBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00XCI+XFxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJwYXNzd29yZFwiIG5nLW1vZGVsPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCI+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG4gICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImNvbC1zbS1vZmZzZXQtMyBjb2wtc20tMiBidG4gYnRuLXByaW1hcnlcIj5Mb2dpbjwvYnV0dG9uPlxcbiAgICA8L2Rpdj5cXG4gPC9mb3JtPlxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSAnICA8Zm9ybSBjbGFzcz1cImZvcm0taG9yaXpvbnRhbFwiIHJvbGU9XCJmb3JtXCIgbmctc3VibWl0PVwicmVnaXN0ZXIoKVwiPlxcbiAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJuZXh0XCIgdmFsdWU9XCJ7e25leHR9fVwiLz5cXG4gICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29sLXNtLTIgY29udHJvbC1sYWJlbFwiIGZvcj1cInVzZXJuYW1lXCI+VXNlcm5hbWU8L2xhYmVsPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00XCI+XFxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cInVzZXJuYW1lXCIgaWQ9XCJlbWFpbFwiIG5nLW1vZGVsPVwidXNlcm5hbWVcIj5cXG4gICAgICAgICAgPHNwYW4gbmctaGlkZSBjbGFzcz1cImhlbHAtaW5saW5lXCI+e3sgZXJyb3IgfX08L3NwYW4+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCB7JSBpZiBlcnJvciAlfWVycm9yeyUgZW5kICV9XCI+XFxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb2wtc20tMiBjb250cm9sLWxhYmVsXCIgZm9yPVwiZW1haWxcIj5FbWFpbDwvbGFiZWw+XFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTRcIj5cXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBuYW1lPVwiZW1haWxcIiBpZD1cImVtYWlsXCIgbmctbW9kZWw9XCJlbWFpbFwiPlxcbiAgICAgICAgICA8c3BhbiBuZy1oaWRlIGNsYXNzPVwiaGVscC1pbmxpbmVcIj57eyBlcnJvciB9fTwvc3Bhbj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgIDwvZGl2PlxcblxcbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XFxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb2wtc20tMiBjb250cm9sLWxhYmVsXCIgZm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XFxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTRcIj5cXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cInBhc3N3b3JkXCIgbmctbW9kZWw9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcbiAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiY29sLXNtLW9mZnNldC0zIGNvbC1zbS0yIGJ0biBidG4tcHJpbWFyeVwiPlJlZ2lzdGVyPC9idXR0b24+XFxuICAgIDwvZGl2PlxcbiA8L2Zvcm0+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9ICcgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cXG4gICAgVGhpcyBpcyB5b3VyIGRhc2hib2FyZCFcXG4gICAgPGEgdWktc3JlZj1cImFwcC50b2RvXCI+RWRpdCB5b3VyIFRvZG9cXCdzPC9hPlxcbiAgPC9kaXY+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2PjwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItc3RhdGljLXRvcFwiIHJvbGU9XCJuYXZpZ2F0aW9uXCI+XFxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XFxuICAgIDwhLS0gQnJhbmQgYW5kIHRvZ2dsZSBnZXQgZ3JvdXBlZCBmb3IgYmV0dGVyIG1vYmlsZSBkaXNwbGF5IC0tPlxcbiAgICA8ZGl2IGNsYXNzPVwibmF2YmFyLWhlYWRlclwiPlxcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmF2YmFyLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xXCI+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj5cXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uLWJhclwiPjwvc3Bhbj5cXG4gICAgICA8L2J1dHRvbj5cXG4gICAgICA8YSBjbGFzcz1cIm5hdmJhci1icmFuZFwiIGhyZWY9XCIvXCI+RWRpdDwvYT5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDwhLS0gQ29sbGVjdCB0aGUgbmF2IGxpbmtzLCBmb3JtcywgYW5kIG90aGVyIGNvbnRlbnQgZm9yIHRvZ2dsaW5nIC0tPlxcbiAgICA8ZGl2IGNsYXNzPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCIgaWQ9XCJicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xXCI+XFxuICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXZcIiBuZy1pZj1cImF1dGguaXNBdXRoZW50aWNhdGVkKClcIj5cXG4gICAgICAgIDxsaT48YSBjbGFzcz1cImFjdGl2ZVwiIGhyZWY9XCIjL3RvZG9cIj5Ub2RvPC9hPjwvbGk+XFxuICAgICAgPC91bD5cXG4gICAgICA8ZGl2IGNsYXNzPVwibmF2YmFyLXJpZ2h0XCI+XFxuICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIj5cXG4gICAgICAgICAgPGxpIG5nLWlmPVwiYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKVwiPjxhIG5nLWNsaWNrPVwibG9nb3V0KClcIj5Mb2dvdXQ8L2E+PC9saT5cXG4gICAgICAgICAgPGxpIG5nLWlmPVwiIWF1dGguaXNBdXRoZW50aWNhdGVkKClcIj48YSB1aS1zcmVmPVwiYXBwLmF1dGgucmVnaXN0ZXJcIj5SZWdpc3RlcjwvYT48L2xpPlxcbiAgICAgICAgICA8bGkgbmctaWY9XCIhYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKVwiPjxhIHVpLXNyZWY9XCJhcHAuYXV0aC5sb2dpblwiPkxvZ2luPC9hPjwvbGk+XFxuICAgICAgICA8L3VsPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtNSBjb2wtc20tNCBwdWxsLXJpZ2h0XCIgbmctaWY9XCJhdXRoLmlzQXV0aGVudGljYXRlZCgpXCI+XFxuICAgICAgICA8IS0tXFxuICAgICAgICA8Zm9ybSBjbGFzcz1cIm5hdmJhci1mb3JtXCIgcm9sZT1cInNlYXJjaFwiIG1ldGhvZD1cIlBPU1RcIiBhY3Rpb249XCIvc2VhcmNoXCI+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2ggSGVyZVwiIG5hbWU9XCJ0ZXJtXCIgaWQ9XCJzZWFyY2hcIi8+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiPjxpIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1zZWFyY2hcIj48L2k+PC9zcGFuPlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZm9ybT5cXG4gICAgICAgIC0tPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj48IS0tIC8ubmF2YmFyLWNvbGxhcHNlIC0tPlxcbiAgPC9kaXY+PCEtLSAvLmNvbnRhaW5lci1mbHVpZCAtLT5cXG48L2Rpdj5cXG4nOyIsIm1vZHVsZS5leHBvcnRzID0gJyAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxcbiAgWW91XFwncmUgbm90IGxvZ2dlZCBpbiAtIFxcbiAgICA8YSBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIHVpLXNyZWY9XCJhcHAuYXV0aC5sb2dpblwiPkxvZ2luPC9hPlxcbiAgICBvclxcbiAgICA8YSBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIHVpLXNyZWY9XCJhcHAuYXV0aC5yZWdpc3RlclwiPlJlZ2lzdGVyPC9hPlxcbiAgPC9kaXY+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IHVpLXZpZXc9XCJjb250ZW50XCI+PC9kaXY+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9ICcgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cXG4gICAgPGgxPlRvZG9zPC9oMT5cXG4gICAgPHAgaWQ9XCJlbXB0eVwiIG5nLWhpZGU9XCJ0b2Rvcy5sZW5ndGggfHwgIWxvYWRlZFwiPllvdSBkb25cXCd0IGhhdmUgYW55IHRvZG9zISBBZGQgb25lIG5vdzo8L3A+XFxuICAgIDx1bCBpZD1cInRvZG9zXCIgY2xhc3M9XCJsaXN0LXVuc3R5bGVkXCI+XFxuICAgICAgPGxpIG5nLXJlcGVhdD1cInRvZG8gaW4gdG9kb3NcIj5cXG4gICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94XCI+XFxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuZy1tb2RlbD1cInRvZG8uY29tcGxldGVkXCIgbmctY2hhbmdlPVwiY2hhbmdlQ29tcGxldGVkKHRvZG8pXCIgLz5cXG4gICAgICAgICAge3t0b2RvLnRpdGxlfX1cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgPC9saT5cXG4gICAgPC91bD5cXG4gICAgPGZvcm0gY2xhc3M9XCJmb3JtLWlubGluZVwiPlxcbiAgICAgIDxpbnB1dCBpZD1cInRvZG8tdGl0bGVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgbmctbW9kZWw9XCJuZXdUb2RvVGl0bGVcIiAvPlxcbiAgICAgIDxidXR0b24gaWQ9XCJhZGQtYnRuXCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIiBuZy1jbGljaz1cImFkZFRvZG8obmV3VG9kb1RpdGxlKVwiPkFkZDwvYnV0dG9uPlxcbiAgICA8L2Zvcm0+XFxuICAgIDxwPlxcbiAgICAgIDxhIGhyZWYgaWQ9XCJyZW1vdmUtY29tcGxldGVkLWJ0blwiIG5nLWNsaWNrPVwicmVtb3ZlQ29tcGxldGVkSXRlbXMoKVwiPlJlbW92ZSBjb21wbGV0ZWQgaXRlbXM8L2E+XFxuICAgIDwvcD5cXG4gIDwvZGl2Plxcbic7Il19
