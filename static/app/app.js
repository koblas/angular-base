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

app.controller('MainController', function($scope, AuthService, $location) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9rb2JsYXMvcmVwb3MvZWRpdC9jbGllbnQvYXBwL2FwcC5jb2ZmZWUiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L2FwcC9jb250cm9sbGVycy9hdXRoLmNvZmZlZSIsIi9Vc2Vycy9rb2JsYXMvcmVwb3MvZWRpdC9jbGllbnQvYXBwL2NvbnRyb2xsZXJzL21haW4uY29mZmVlIiwiL1VzZXJzL2tvYmxhcy9yZXBvcy9lZGl0L2NsaWVudC9hcHAvY29udHJvbGxlcnMvdG9kby5jb2ZmZWUiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L2FwcC9zZXJ2aWNlcy9hdXRoLmNvZmZlZSIsIi9Vc2Vycy9rb2JsYXMvcmVwb3MvZWRpdC9jbGllbnQvcGFydGlhbHMvYXV0aC9sb2dpbi5odG1sIiwiL1VzZXJzL2tvYmxhcy9yZXBvcy9lZGl0L2NsaWVudC9wYXJ0aWFscy9hdXRoL3JlZ2lzdGVyLmh0bWwiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L3BhcnRpYWxzL2Rhc2hib2FyZC5odG1sIiwiL1VzZXJzL2tvYmxhcy9yZXBvcy9lZGl0L2NsaWVudC9wYXJ0aWFscy9mb290ZXIuaHRtbCIsIi9Vc2Vycy9rb2JsYXMvcmVwb3MvZWRpdC9jbGllbnQvcGFydGlhbHMvaGVhZGVyLmh0bWwiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L3BhcnRpYWxzL2luZGV4Lmh0bWwiLCIvVXNlcnMva29ibGFzL3JlcG9zL2VkaXQvY2xpZW50L3BhcnRpYWxzL2xheW91dC5odG1sIiwiL1VzZXJzL2tvYmxhcy9yZXBvcy9lZGl0L2NsaWVudC9wYXJ0aWFscy90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Q0FBQTtpQkFJQSxRQUFRLENBQUMsT0FBVCxDQUFpQixJQUFqQixFQUxKO1NBQUEsTUFBQTtpQkFPSSxRQUFRLENBQUMsTUFBVCxDQUFnQixTQUFoQixFQVBKO1NBRDZFO01BQUEsQ0FBakYsRUFTRSxTQUFDLEdBQUQsR0FBQTtlQUNFLFFBQVEsQ0FBQyxNQUFULENBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBekIsRUFERjtNQUFBLENBVEYsQ0FGQSxDQUFBO2FBY0EsUUFBUSxDQUFDLFFBZkg7SUFBQSxDQS9CUDtHQUFQLENBeEJ1QjtBQUFBLENBQTNCLENBRkEsQ0FBQTs7OztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJhcHAgPSBhbmd1bGFyLm1vZHVsZSAnaXF2aW5lJywgWydyZXN0YW5ndWxhcicsICd1aS5yb3V0ZXInLCAnbmdDb29raWVzJ11cblxuYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeSAoKSAtPiBhbmd1bGFyLmJvb3RzdHJhcChkb2N1bWVudCwgWydpcXZpbmUnXSlcblxucmVxdWlyZSgnLi9zZXJ2aWNlcy9hdXRoJylcbnJlcXVpcmUoJy4vY29udHJvbGxlcnMvbWFpbicpXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3RvZG8nKVxucmVxdWlyZSgnLi9jb250cm9sbGVycy9hdXRoJylcblxuI1xuIyAgU2V0IHRoZSBsYXlvdXRcbiNcbmFwcC5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKSAtPlxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwJyxcbiAgICAgICAgICAgIHVybDogJydcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlXG4gICAgICAgICAgICB2aWV3czpcbiAgICAgICAgICAgICAgICBjb250YWluZXI6XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuLi9wYXJ0aWFscy9sYXlvdXQuaHRtbCcpXG4gICAgICAgICAgICAgICAgZm9vdGVyOlxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vcGFydGlhbHMvZm9vdGVyLmh0bWwnKVxuICAgICAgICAgICAgICAgIGhlYWRlcjpcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnRpYWxzL2hlYWRlci5odG1sJylcbiAgICAgICAgKVxuXG4jXG4jICBSZXN0YW51Z2xhciBzZXR1cFxuI1xuYXBwLmNvbmZpZyAoUmVzdGFuZ3VsYXJQcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgLT5cbiAgICBSZXN0YW5ndWxhclByb3ZpZGVyLnNldEJhc2VVcmwoJy9hcGkvdjEnKVxuXG4gICAgUmVzdGFuZ3VsYXJQcm92aWRlci5zZXRSZXNwb25zZUV4dHJhY3RvciAocmVzcG9uc2UsIG9wZXJhdGlvbiwgd2hhdCwgdXJsKSAtPlxuICAgICAgICAgICAgIyAgVGhpcyBpcyBhIGdldCBmb3IgYSBsaXN0XG4gICAgICAgICAgICBpZiBvcGVyYXRpb24gaXMgXCJnZXRMaXN0XCIgXG4gICAgICAgICAgICAgICAgIyAgSGVyZSB3ZSdyZSByZXR1cm5pbmcgYW4gQXJyYXkgd2hpY2ggaGFzIG9uZSBzcGVjaWFsIHByb3BlcnR5IG1ldGFkYXRhIHdpdGggb3VyIGV4dHJhIGluZm9ybWF0aW9uXG4gICAgICAgICAgICAgICAgbmV3UmVzcG9uc2UgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgICBlbHNlIFxuICAgICAgICAgICAgICAgICMgIFRoaXMgaXMgYW4gZWxlbWVudFxuICAgICAgICAgICAgICAgIG5ld1Jlc3BvbnNlID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgIyAgVW5tYXRjaGVkIFVSTCBzdGF0ZVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpXG5cbmFwcC5ydW4gKCRyb290U2NvcGUsICRzdGF0ZSwgJGxvY2F0aW9uLCBBdXRoU2VydmljZSkgLT5cbiAgICAkcm9vdFNjb3BlLiRvbiBcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykgLT5cbiAgICAgICAgaWYgdG9TdGF0ZS5hdXRoZW50aWNhdGUgJiYgIUF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpXG4gICAgICAgICAgICAjICBVc2VyIGlzbuKAmXQgYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgaHJlZiA9ICRzdGF0ZS5ocmVmKHRvU3RhdGUsIHRvUGFyYW1zKVxuICAgICAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhcImxvZ2luXCIsIHsgbmV4dDogJGxvY2F0aW9uLnBhdGgoKSB9KVxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuIiwiYXBwID0gYW5ndWxhci5tb2R1bGUoJ2lxdmluZScpXG5cbmFwcC5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKSAtPlxuICAgICMgIFN0YXRlc1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmF1dGgnLCB7XG4gICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZVxuICAgICAgICAgICAgdXJsOiBcIi9hdXRoXCJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHVpLXZpZXcvPidcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhcHAuYXV0aC5yZWdpc3RlcicsIHtcbiAgICAgICAgICAgIHVybDogXCIvcmVnaXN0ZXI/bmV4dFwiXG4gICAgICAgICAgICB2aWV3czpcbiAgICAgICAgICAgICAgICAnY29udGVudEBhcHAnOlxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZShcIi4uLy4uL3BhcnRpYWxzL2F1dGgvcmVnaXN0ZXIuaHRtbFwiKVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIlJlZ2lzdGVyQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0ZTogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhcHAuYXV0aC5sb2dpbicsIHtcbiAgICAgICAgICAgIHVybDogXCIvbG9naW4/bmV4dFwiXG4gICAgICAgICAgICB2aWV3czpcbiAgICAgICAgICAgICAgICAnY29udGVudEBhcHAnOlxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZShcIi4uLy4uL3BhcnRpYWxzL2F1dGgvbG9naW4uaHRtbFwiKVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkxvZ2luQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0ZTogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhcHAuYXV0aC5sb2dvdXQnLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2xvZ291dFwiXG4gICAgICAgICAgICAjIHRlbXBsYXRlOiByZXF1aXJlKFwiLi4vLi4vcGFydGlhbHMvYXV0aC9sb2dvdXQuaHRtbFwiKVxuICAgICAgICAgICAgdmlld3M6XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzpcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdj48L2Rpdj5cIlxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkxvZ291dENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICBhdXRoZW50aWNhdGU6IGZhbHNlXG4gICAgICAgIH0pXG5cbmFwcC5jb250cm9sbGVyICdMb2dpbkNvbnRyb2xsZXInLCAoJHNjb3BlLCAkbG9jYXRpb24sICBBdXRoU2VydmljZSwgJHN0YXRlUGFyYW1zKSAtPlxuICAgICRzY29wZS5lbWFpbCA9IFwiXCJcbiAgICAkc2NvcGUuZXJyb3IgPSBcIlwiXG4gICAgJHNjb3BlLm5leHQgID0gJHN0YXRlUGFyYW1zLnBhcmFtcz8ubmV4dCB8fCAnLydcblxuICAgICRzY29wZS5sb2dpbiA9ICgpIC0+XG4gICAgICAgIGlmICEkc2NvcGUuZW1haWxcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiSW52YWxpZCBFbWFpbCBBZGRyZXNzXCJcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICEkc2NvcGUucGFzc3dvcmRcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiSW52YWxpZCBQYXNzd29yZFwiXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbigkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZClcbiAgICAgICAgICAgIC50aGVuICgpIC0+ICRsb2NhdGlvbi5wYXRoKCRzY29wZS5uZXh0KVxuICAgICAgICAgICAgLmNhdGNoIChlcnIpIC0+IGNvbnNvbGUubG9nKFwiQXV0aCBFcnJvclwiLCBlcnIpXG5cbmFwcC5jb250cm9sbGVyICdSZWdpc3RlckNvbnRyb2xsZXInLCAoJHNjb3BlLCAkbG9jYXRpb24sIEF1dGhTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIC0+XG4gICAgJHNjb3BlLnBhc3N3b3JkID0gXCJcIlxuICAgICRzY29wZS51c2VybmFtZSA9IFwiXCJcbiAgICAkc2NvcGUuZW1haWwgPSBcIlwiXG4gICAgJHNjb3BlLmVycm9yID0gXCJcIlxuICAgICRzY29wZS5uZXh0ICA9ICRzdGF0ZVBhcmFtcy5wYXJhbXM/Lm5leHQgfHwgJy8nXG5cbiAgICAkc2NvcGUucmVnaXN0ZXIgPSAoKSAtPlxuICAgICAgICBpZiAhJHNjb3BlLmVtYWlsXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIkludmFsaWQgRW1haWwgQWRkcmVzc1wiXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgaWYgISRzY29wZS51c2VybmFtZVxuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJJbnZhbGlkIFVzZXJuYW1lXCJcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBpZiAhJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIkludmFsaWQgUGFzc3dvcmRcIlxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIHsgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSB9KVxuICAgICAgICAgICAgLnRoZW4gKCkgLT4gJGxvY2F0aW9uLnBhdGgoJHNjb3BlLm5leHQpXG4gICAgICAgICAgICAuY2F0Y2ggKGVycikgLT4gJHNjb3BlLmVycm9yID0gZXJyXG4iLCJhcHAgPSBhbmd1bGFyLm1vZHVsZSgnaXF2aW5lJyk7XG5cbmFwcC5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKSAtPlxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmluZGV4XycsIHtcbiAgICAgICAgICAgIHVybDogJycsXG4gICAgICAgICAgICB2aWV3czpcbiAgICAgICAgICAgICAgICAnY29udGVudEBhcHAnOlxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vLi4vcGFydGlhbHMvaW5kZXguaHRtbCcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiSW5kZXhDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgYXV0aGVudGljYXRlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2FwcC5pbmRleCcsIHtcbiAgICAgICAgICAgIHVybDogJy8nLFxuICAgICAgICAgICAgdmlld3M6XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzpcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uLy4uL3BhcnRpYWxzL2luZGV4Lmh0bWwnKVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkluZGV4Q29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0ZTogZmFsc2VcbiAgICAgICAgfSk7XG5cbmFwcC5jb250cm9sbGVyICdJbmRleENvbnRyb2xsZXInLCAoJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKSAtPlxuICAgIGlmIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpXG5cbmFwcC5jb250cm9sbGVyICdNYWluQ29udHJvbGxlcicsICgkc2NvcGUsIEF1dGhTZXJ2aWNlLCAkbG9jYXRpb24pIC0+XG4gICAgJHNjb3BlLmF1dGggPSBBdXRoU2VydmljZTtcbiAgICAkc2NvcGUubG9nb3V0ID0gKCkgLT5cbiAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4iLCJhcHAgPSBhbmd1bGFyLm1vZHVsZSgnaXF2aW5lJyk7XG5cbmFwcC5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKSAtPlxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmRhc2hib2FyZCcsIHtcbiAgICAgICAgICAgIHVybDogJy9kYXNoJ1xuICAgICAgICAgICAgdmlld3M6XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzpcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uLy4uL3BhcnRpYWxzL2Rhc2hib2FyZC5odG1sJylcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJEYXNoYm9hcmRDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgYXV0aGVudGljYXRlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnYXBwLnRvZG8nLCB7XG4gICAgICAgICAgICB1cmw6ICcvdG9kbydcbiAgICAgICAgICAgIHZpZXdzOlxuICAgICAgICAgICAgICAgICdjb250ZW50QGFwcCc6XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuLi8uLi9wYXJ0aWFscy90b2RvLmh0bWwnKVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIlRvZG9Db250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgYXV0aGVudGljYXRlOiB0cnVlXG4gICAgICAgIH0pO1xuXG5hcHAuY29udHJvbGxlciAnRGFzaGJvYXJkQ29udHJvbGxlcicsICgkc2NvcGUsIFJlc3Rhbmd1bGFyKSAtPiB0cnVlXG5cbmFwcC5jb250cm9sbGVyICdUb2RvQ29udHJvbGxlcicsICgkc2NvcGUsIFJlc3Rhbmd1bGFyKSAtPlxuICAgICRzY29wZS50b2RvcyA9IFtdO1xuICAgICRzY29wZS5sb2FkZWQgPSBmYWxzZTtcblxuICAgIFRvZG8gPSBSZXN0YW5ndWxhci5hbGwoJ3RvZG8nKVxuXG4gICAgVG9kby5nZXRMaXN0KCkudGhlbihcbiAgICAgICAgKHRvZG9zKSAtPlxuICAgICAgICAgICAgJHNjb3BlLmxvYWRlZCA9IHRydWVcbiAgICAgICAgICAgICRzY29wZS50b2RvcyA9IHRvZG9zXG4gICAgKVxuXG4gICAgJHNjb3BlLmFkZFRvZG8gPSAodGl0bGUpIC0+XG4gICAgICAgICAgICBpZiAodGl0bGUpXG4gICAgICAgICAgICAgICAgVG9kby5wb3N0KHsndGl0bGUnOiB0aXRsZSB9KS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAodG9kbykgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5uZXdUb2RvVGl0bGUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2RvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50b2Rvcy5wdXNoKHRvZG8pO1xuICAgICAgICAgICAgICAgICAgICAsIChlcnIpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoZXJyLmRhdGEubWVzc2FnZSB8fCBcImFuIGVycm9yIG9jY3VycmVkXCIpO1xuICAgICAgICAgICAgICAgIClcblxuICAgICRzY29wZS5jaGFuZ2VDb21wbGV0ZWQgPSAodG9kbykgLT5cbiAgICAgICAgdG9kby5wdXQoKS50aGVuKG51bGwsIChlcnIpIC0+XG4gICAgICAgICAgICByZXR1cm4gYWxlcnQoZXJyLmRhdGEubWVzc2FnZSB8fCAoZXJyLmVycm9ycyAmJiBlcnIuZXJyb3JzLmNvbXBsZXRlZCkgfHwgXCJhbiBlcnJvciBvY2N1cnJlZFwiKTtcbiAgICAgICAgKVxuXG4gICAgJHNjb3BlLnJlbW92ZUNvbXBsZXRlZEl0ZW1zID0gKCkgLT5cbiAgICAgICAgJHNjb3BlLnRvZG9zLmZvckVhY2goKHRvZG8pIC0+XG4gICAgICAgICAgICBpZiAoIXRvZG8uY29tcGxldGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgdG9kby5yZW1vdmUoKS50aGVuKCgpIC0+XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvZG9zID0gXy53aXRob3V0KCRzY29wZS50b2RvcywgdG9kbyk7XG4gICAgICAgICAgICAsIChlcnIpIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsZXJ0KGVyci5kYXRhLm1lc3NhZ2UgfHwgKGVyci5lcnJvcnMgJiYgZXJyLmVycm9ycy5jb21wbGV0ZWQpIHx8IFwiYW4gZXJyb3Igb2NjdXJyZWRcIik7XG4gICAgICAgICAgICApXG4gICAgICAgIClcbiIsImFwcCA9IGFuZ3VsYXIubW9kdWxlKCdpcXZpbmUnKVxuXG5hcHAuc2VydmljZSAnQXV0aFNlcnZpY2UnLCAoUmVzdGFuZ3VsYXIsICRxLCAkY29va2llcywgJHN0YXRlKSAtPlxuICAgIEF1dGggPSBSZXN0YW5ndWxhci5hbGwoJ2F1dGgnKVxuICAgIGF1dGhfY29va2llID0gJ3VzZXJfYXV0aCdcbiAgICBzZWxmID0gdGhpc1xuICAgIFxuICAgIHNlbGYuYXV0aGVudGljYXRlZCA9IGZhbHNlXG4gICAgc2VsZi5uYW1lID0gbnVsbFxuXG4gICAgI1xuICAgICMgIElmIHRoZSBhdXRoIGNvb2tpZSBpcyBhcm91bmQgLSB1c2UgaXRcbiAgICAjXG4gICAgaWYgKCRjb29raWVzW2F1dGhfY29va2llXSkgXG4gICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IHRydWVcblxuICAgICAgICBBdXRoLnBvc3Qoe3Rva2VuOiRjb29raWVzW2F1dGhfY29va2llXX0pLnRoZW4gKGF1dGgpIC0+XG4gICAgICAgICAgICBpZiAoYXV0aCAmJiBhdXRoLnRva2VuKSBcbiAgICAgICAgICAgICAgICAjICBUb2tlbiBpcyBnb29kLCBzZXQgdGhlIGF1dGhlbnRpY2F0aW9uIGhlYWRlcnNcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5zZXREZWZhdWx0SGVhZGVycyh7QXV0aG9yaXphdGlvbjogJ0Jhc2ljICcgKyBhdXRoLnRva2VufSlcbiAgICAgICAgICAgIGVsc2UgXG4gICAgICAgICAgICAgICAgIyAgSWYgdGhlIHRva2VuIGlzIFwiYmFkXCIgZS5nLiB5b3UncmUgbm8gbG9uZ2VyIGEgdmFsaWQgdXNlciwgY2xlYW51cFxuICAgICAgICAgICAgICAgIGRlbGV0ZSAkY29va2llc1thdXRoX2Nvb2tpZV1cbiAgICAgICAgICAgICAgICBzZWxmLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oXCJpbmRleFwiKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiAoKSAtPiBzZWxmLmF1dGhlbnRpY2F0ZWRcblxuICAgICAgICAjXG4gICAgICAgICMgIExvZ2luIGEgdXNlciBieSBlbWFpbCArIHBhc3N3b3JkIC0gcmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICAjIFxuICAgICAgICAjICBUT0RPIC0gYmV0dGVyIGVycm9yIG1lc3NhZ2VzIG9uIHRoZSByZXN1bHRcbiAgICAgICAgI1xuICAgICAgICBsb2dpbjogKGVtYWlsLCBwYXNzd29yZCkgLT5cbiAgICAgICAgICAgIGRlZmVycmVkID0gJHEuZGVmZXIoKVxuXG4gICAgICAgICAgICBBdXRoLnBvc3Qoe2VtYWlsOmVtYWlsLCBwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4gKGF1dGgpIC0+XG4gICAgICAgICAgICAgICAgaWYgYXV0aC50b2tlblxuICAgICAgICAgICAgICAgICAgICBzZWxmLmF1dGhlbnRpY2F0ZWQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXNbYXV0aF9jb29raWVdID0gYXV0aC50b2tlblxuICAgICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5zZXREZWZhdWx0SGVhZGVycyh7QXV0aG9yaXphdGlvbjogJ0Jhc2ljICcgKyBhdXRoLnRva2VufSlcblxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFwib2tcIilcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChcInVua25vd25cIilcbiAgICAgICAgICAgICwgKGVycikgLT5cbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyLmRhdGEuZW1zZylcblxuICAgICAgICAgICAgZGVmZXJyZWQucHJvbWlzZVxuXG4gICAgICAgIGxvZ291dDogKCkgLT5cbiAgICAgICAgICAgIHNlbGYuYXV0aGVudGljYXRlZCA9IGZhbHNlXG4gICAgICAgICAgICBkZWxldGUgJGNvb2tpZXNbYXV0aF9jb29raWVdXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5zZXREZWZhdWx0SGVhZGVycyh7QXV0aG9yaXphdGlvbjogJ0Jhc2ljICcgKyAnSU5WQUxJRCd9KVxuXG4gICAgICAgIHJlZ2lzdGVyOiAoZW1haWwsIHBhc3N3b3JkLCBwYXJhbXMpIC0+XG4gICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKClcblxuICAgICAgICAgICAgQXV0aC5wb3N0KHtlbWFpbDplbWFpbCwgcGFzc3dvcmQ6cGFzc3dvcmQsIHBhcmFtczpwYXJhbXN9LCB7cmVnaXN0ZXI6dHJ1ZX0pLnRoZW4gKGF1dGgpIC0+XG4gICAgICAgICAgICAgICAgaWYgYXV0aC50b2tlblxuICAgICAgICAgICAgICAgICAgICBzZWxmLmF1dGhlbnRpY2F0ZWQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXNbYXV0aF9jb29raWVdID0gYXV0aC50b2tlblxuICAgICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5zZXREZWZhdWx0SGVhZGVycyh7QXV0aG9yaXphdGlvbjogJ0Jhc2ljICcgKyBhdXRoLnRva2VufSlcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShcIm9rXCIpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoXCJ1bmtub3duXCIpXG4gICAgICAgICAgICAsIChlcnIpIC0+XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVyci5kYXRhLmVtc2cpXG5cbiAgICAgICAgICAgIGRlZmVycmVkLnByb21pc2VcbiAgICB9XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICcgIDxmb3JtIGNsYXNzPVwiZm9ybS1ob3Jpem9udGFsXCIgcm9sZT1cImZvcm1cIiBuZy1zdWJtaXQ9XCJsb2dpbigpXCI+XFxuICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIm5leHRcIiB2YWx1ZT1cInt7bmV4dH19XCIvPlxcbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIHslIGlmIGVycm9yICV9ZXJyb3J7JSBlbmQgJX1cIj5cXG4gICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbC1zbS0yIGNvbnRyb2wtbGFiZWxcIiBmb3I9XCJlbWFpbFwiPkVtYWlsPC9sYWJlbD5cXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNFwiPlxcbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJlbWFpbFwiIGlkPVwiZW1haWxcIiBuZy1tb2RlbD1cImVtYWlsXCI+XFxuICAgICAgICAgIDxzcGFuIG5nLWhpZGUgY2xhc3M9XCJoZWxwLWlubGluZVwiPnt7IGVycm9yIH19PC9zcGFuPlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9kaXY+XFxuXFxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG4gICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbC1zbS0yIGNvbnRyb2wtbGFiZWxcIiBmb3I9XCJwYXNzd29yZFwiPlBhc3N3b3JkPC9sYWJlbD5cXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNFwiPlxcbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBuYW1lPVwicGFzc3dvcmRcIiBuZy1tb2RlbD1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiPlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XFxuICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJjb2wtc20tb2Zmc2V0LTMgY29sLXNtLTIgYnRuIGJ0bi1wcmltYXJ5XCI+TG9naW48L2J1dHRvbj5cXG4gICAgPC9kaXY+XFxuIDwvZm9ybT5cXG4nOyIsIm1vZHVsZS5leHBvcnRzID0gJyAgPGZvcm0gY2xhc3M9XCJmb3JtLWhvcml6b250YWxcIiByb2xlPVwiZm9ybVwiIG5nLXN1Ym1pdD1cInJlZ2lzdGVyKClcIj5cXG4gICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwibmV4dFwiIHZhbHVlPVwie3tuZXh0fX1cIi8+XFxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG4gICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbC1zbS0yIGNvbnRyb2wtbGFiZWxcIiBmb3I9XCJ1c2VybmFtZVwiPlVzZXJuYW1lPC9sYWJlbD5cXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNFwiPlxcbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJ1c2VybmFtZVwiIGlkPVwiZW1haWxcIiBuZy1tb2RlbD1cInVzZXJuYW1lXCI+XFxuICAgICAgICAgIDxzcGFuIG5nLWhpZGUgY2xhc3M9XCJoZWxwLWlubGluZVwiPnt7IGVycm9yIH19PC9zcGFuPlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9kaXY+XFxuXFxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgeyUgaWYgZXJyb3IgJX1lcnJvcnslIGVuZCAlfVwiPlxcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29sLXNtLTIgY29udHJvbC1sYWJlbFwiIGZvcj1cImVtYWlsXCI+RW1haWw8L2xhYmVsPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00XCI+XFxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cImVtYWlsXCIgaWQ9XCJlbWFpbFwiIG5nLW1vZGVsPVwiZW1haWxcIj5cXG4gICAgICAgICAgPHNwYW4gbmctaGlkZSBjbGFzcz1cImhlbHAtaW5saW5lXCI+e3sgZXJyb3IgfX08L3NwYW4+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29sLXNtLTIgY29udHJvbC1sYWJlbFwiIGZvcj1cInBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00XCI+XFxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJwYXNzd29yZFwiIG5nLW1vZGVsPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCI+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG4gICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImNvbC1zbS1vZmZzZXQtMyBjb2wtc20tMiBidG4gYnRuLXByaW1hcnlcIj5SZWdpc3RlcjwvYnV0dG9uPlxcbiAgICA8L2Rpdj5cXG4gPC9mb3JtPlxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSAnICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XFxuICAgIFRoaXMgaXMgeW91ciBkYXNoYm9hcmQhXFxuICAgIDxhIHVpLXNyZWY9XCJhcHAudG9kb1wiPkVkaXQgeW91ciBUb2RvXFwnczwvYT5cXG4gIDwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj48L2Rpdj5cXG4nOyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLXN0YXRpYy10b3BcIiByb2xlPVwibmF2aWdhdGlvblwiPlxcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxcbiAgICA8IS0tIEJyYW5kIGFuZCB0b2dnbGUgZ2V0IGdyb3VwZWQgZm9yIGJldHRlciBtb2JpbGUgZGlzcGxheSAtLT5cXG4gICAgPGRpdiBjbGFzcz1cIm5hdmJhci1oZWFkZXJcIj5cXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5hdmJhci10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIjYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMVwiPlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uLWJhclwiPjwvc3Bhbj5cXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+XFxuICAgICAgPC9idXR0b24+XFxuICAgICAgPGEgY2xhc3M9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiL1wiPkVkaXQ8L2E+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8IS0tIENvbGxlY3QgdGhlIG5hdiBsaW5rcywgZm9ybXMsIGFuZCBvdGhlciBjb250ZW50IGZvciB0b2dnbGluZyAtLT5cXG4gICAgPGRpdiBjbGFzcz1cImNvbGxhcHNlIG5hdmJhci1jb2xsYXBzZVwiIGlkPVwiYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMVwiPlxcbiAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2XCIgbmctaWY9XCJhdXRoLmlzQXV0aGVudGljYXRlZCgpXCI+XFxuICAgICAgICA8bGk+PGEgY2xhc3M9XCJhY3RpdmVcIiBocmVmPVwiIy90b2RvXCI+VG9kbzwvYT48L2xpPlxcbiAgICAgIDwvdWw+XFxuICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhci1yaWdodFwiPlxcbiAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0XCI+XFxuICAgICAgICAgIDxsaSBuZy1pZj1cImF1dGguaXNBdXRoZW50aWNhdGVkKClcIj48YSBuZy1jbGljaz1cImxvZ291dCgpXCI+TG9nb3V0PC9hPjwvbGk+XFxuICAgICAgICAgIDxsaSBuZy1pZj1cIiFhdXRoLmlzQXV0aGVudGljYXRlZCgpXCI+PGEgdWktc3JlZj1cImFwcC5hdXRoLnJlZ2lzdGVyXCI+UmVnaXN0ZXI8L2E+PC9saT5cXG4gICAgICAgICAgPGxpIG5nLWlmPVwiIWF1dGguaXNBdXRoZW50aWNhdGVkKClcIj48YSB1aS1zcmVmPVwiYXBwLmF1dGgubG9naW5cIj5Mb2dpbjwvYT48L2xpPlxcbiAgICAgICAgPC91bD5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTUgY29sLXNtLTQgcHVsbC1yaWdodFwiIG5nLWlmPVwiYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKVwiPlxcbiAgICAgICAgPCEtLVxcbiAgICAgICAgPGZvcm0gY2xhc3M9XCJuYXZiYXItZm9ybVwiIHJvbGU9XCJzZWFyY2hcIiBtZXRob2Q9XCJQT1NUXCIgYWN0aW9uPVwiL3NlYXJjaFwiPlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoIEhlcmVcIiBuYW1lPVwidGVybVwiIGlkPVwic2VhcmNoXCIvPlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYWRkb25cIj48aSBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tc2VhcmNoXCI+PC9pPjwvc3Bhbj5cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Zvcm0+XFxuICAgICAgICAtLT5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+PCEtLSAvLm5hdmJhci1jb2xsYXBzZSAtLT5cXG4gIDwvZGl2PjwhLS0gLy5jb250YWluZXItZmx1aWQgLS0+XFxuPC9kaXY+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9ICcgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cXG4gIFlvdVxcJ3JlIG5vdCBsb2dnZWQgaW4gLSBcXG4gICAgPGEgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiB1aS1zcmVmPVwiYXBwLmF1dGgubG9naW5cIj5Mb2dpbjwvYT5cXG4gICAgb3JcXG4gICAgPGEgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiB1aS1zcmVmPVwiYXBwLmF1dGgucmVnaXN0ZXJcIj5SZWdpc3RlcjwvYT5cXG4gIDwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiB1aS12aWV3PVwiY29udGVudFwiPjwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSAnICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XFxuICAgIDxoMT5Ub2RvczwvaDE+XFxuICAgIDxwIGlkPVwiZW1wdHlcIiBuZy1oaWRlPVwidG9kb3MubGVuZ3RoIHx8ICFsb2FkZWRcIj5Zb3UgZG9uXFwndCBoYXZlIGFueSB0b2RvcyEgQWRkIG9uZSBub3c6PC9wPlxcbiAgICA8dWwgaWQ9XCJ0b2Rvc1wiIGNsYXNzPVwibGlzdC11bnN0eWxlZFwiPlxcbiAgICAgIDxsaSBuZy1yZXBlYXQ9XCJ0b2RvIGluIHRvZG9zXCI+XFxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveFwiPlxcbiAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmctbW9kZWw9XCJ0b2RvLmNvbXBsZXRlZFwiIG5nLWNoYW5nZT1cImNoYW5nZUNvbXBsZXRlZCh0b2RvKVwiIC8+XFxuICAgICAgICAgIHt7dG9kby50aXRsZX19XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgIDwvbGk+XFxuICAgIDwvdWw+XFxuICAgIDxmb3JtIGNsYXNzPVwiZm9ybS1pbmxpbmVcIj5cXG4gICAgICA8aW5wdXQgaWQ9XCJ0b2RvLXRpdGxlXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIG5nLW1vZGVsPVwibmV3VG9kb1RpdGxlXCIgLz5cXG4gICAgICA8YnV0dG9uIGlkPVwiYWRkLWJ0blwiIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCIgbmctY2xpY2s9XCJhZGRUb2RvKG5ld1RvZG9UaXRsZSlcIj5BZGQ8L2J1dHRvbj5cXG4gICAgPC9mb3JtPlxcbiAgICA8cD5cXG4gICAgICA8YSBocmVmIGlkPVwicmVtb3ZlLWNvbXBsZXRlZC1idG5cIiBuZy1jbGljaz1cInJlbW92ZUNvbXBsZXRlZEl0ZW1zKClcIj5SZW1vdmUgY29tcGxldGVkIGl0ZW1zPC9hPlxcbiAgICA8L3A+XFxuICA8L2Rpdj5cXG4nOyJdfQ==
