(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var app = angular.module('geartrackerApp', ['restangular', 'ui.router']);

require('./common/services');
require('./modules/main');
require('./modules/todo');
require('./modules/auth');

app.config(function(RestangularProvider, $stateProvider, $urlRouterProvider) {
    RestangularProvider.setBaseUrl('/api/v1');

    RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
      // This is a get for a list
      var newResponse;
      if (operation === "getList") {
        // Here we're returning an Array which has one special property metadata with our extra information
        newResponse = response.data;
        // newResponse.metadata = response.data.meta;
      } else {
        // This is an element
        newResponse = response.data;
      }
      return newResponse;
    });

    //  Unmatched URL state
    $urlRouterProvider.otherwise("/");
});

//
//  Authentication requirement handler
//
app.run(function($rootScope, $state, $location, AuthService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !AuthService.isAuthenticated()) {
            // User isn’t authenticated
            var href = $state.href(toState, toParams);
            $state.transitionTo("login", { next: $location.path() });
            event.preventDefault(); 
        }
    });
});

},{"./common/services":2,"./modules/auth":3,"./modules/main":4,"./modules/todo":5}],2:[function(require,module,exports){
'use strict';

angular.module('geartrackerApp').service('AuthService',
    function () {
        this.authenticated = false;
        this.name = null;
        return {
            isAuthenticated: function() {
                return this.authenticated;
            },
            getName: function() {
                return this.name;
            },
            login: function() {
                this.authenticated = true;
            },
            logout: function() {
                this.authenticated = false;
            }
        }
    }
);

},{}],3:[function(require,module,exports){
'use strict';

var app = angular.module('geartrackerApp');

app.config(function($stateProvider) {
    // States
    $stateProvider
        .state('login', {
            url: "/auth/login?next",
            templateUrl: "/static/partials/login.html",
            controller: "LoginController",
            authenticate: false
        });
    $stateProvider
        .state('logout', {
            url: "/auth/logout",
            templateUrl: "/static/partials/logout.html",
            controller: "LogoutController",
            authenticate: false
        });
});

app.controller('LoginController', ['$scope', '$location', 'Restangular', 'AuthService', '$state', function($scope, $location, Restangular, AuthService, $stateProvider) {
    var Auth = Restangular.all('auth');

    $scope.email = "";
    $scope.error = "";
    $scope.next  = $stateProvider.params.next || '/';

    $scope.login = function() {
        if (!$scope.email) {
            $scope.error = "Invalid Email Address";
            return;
        }
        if (!$scope.password) {
            $scope.error = "Invalid Password";
            return;
        }

        Auth.post({email:$scope.email, password:$scope.password}).then(function (auth) {
            if (auth.token) {
                AuthService.login();
                // $stateProvider.transitionTo('todo');
                $location.path($scope.next);
            }
        }, function(err) {
        });
    }
}])

},{}],4:[function(require,module,exports){
'use strict';

var app = angular.module('geartrackerApp');

app.config(function($stateProvider) {
    $stateProvider
        .state('index_', {
            url: '',
            templateUrl: '/static/partials/index.html',
            controller: "IndexController",
            authenticate: false
        });
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: '/static/partials/index.html',
            controller: "IndexController",
            authenticate: false
        });
});

angular.module('geartrackerApp').controller('IndexController', function($scope, Restangular) {
});

angular.module('geartrackerApp').controller('MainController', function($scope, Restangular, AuthService) {
    $scope.auth = AuthService;
});

},{}],5:[function(require,module,exports){
'use strict';

var app = angular.module('geartrackerApp');

app.config(function($stateProvider) {
    $stateProvider
        .state('todo', {
            url: '/todo',
            templateUrl: '/static/partials/todo.html',
            controller: "TodoController",
            authenticate: true
        });
});

app.controller('TodoController', function($scope, Restangular) {
    $scope.todos = [];
    $scope.loaded = false;

    var Todo = Restangular.all('todo');

    Todo.getList().then(function(todos) { 
        $scope.loaded = true; 
        $scope.todos = todos;
    });

    $scope.addTodo = function(title) {
        if (title) {
            Todo.post({'title': title }).then(function (todo) {
                $scope.newTodoTitle = '';
                if (todo)
                    $scope.todos.push(todo);
            }, function (err) {
                return alert(err.data.message || "an error occurred");
            });
        }
    }

    $scope.changeCompleted = function(todo) {
        todo.put().then(null, function(err) {
            return alert(err.data.message || (err.errors && err.errors.completed) || "an error occurred");
        });
    }

    $scope.removeCompletedItems = function() {
        $scope.todos.forEach(function(todo) {
            if (!todo.completed)
                return;

            todo.remove().then(function() {
                $scope.todos = _.without($scope.todos, todo);
            }, function(err) {
                return alert(err.data.message || (err.errors && err.errors.completed) || "an error occurred");
            })
        });
    }
});

},{}]},{},[1])