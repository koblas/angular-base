'use strict';

var gearApp = angular.module('geartrackerApp', ['restangular', 'ui.router']);

gearApp.service('AuthService', 
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
                console.log("CALL LOGIN");
                this.authenticated = true;
            },
            logout: function() {
                console.log("CALL LOGOUT");
                this.authenticated = false;
            }
        }
    }
);


gearApp.config(function(RestangularProvider, $stateProvider, $urlRouterProvider) {
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

    $stateProvider
        .state('todo', {
            url: '/todo',
            templateUrl: '/static/partials/todo.html',
            controller: "TodoController",
            authenticate: true
        });

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

    //  Unmatched URL state
    $urlRouterProvider.otherwise("/");
});


gearApp.run(function($rootScope, $state, $location, AuthService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !AuthService.isAuthenticated()) {
            // User isn’t authenticated
            var href = $state.href(toState, toParams);
            $state.transitionTo("login", { next: $location.path() });
            event.preventDefault(); 
        }
    });
});

gearApp.controller('LoginController', ['$scope', '$location', 'Restangular', 'AuthService', '$state', function($scope, $location, Restangular, AuthService, $stateProvider) {
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
                console.log("NEXT = ", $scope.next);
                $location.path($scope.next);
            }
        }, function(err) {
            console.log("ERROR");
        });
    }
}])

gearApp.controller('IndexController', function($scope, Restangular) {
    console.log("IndexController");
});

gearApp.controller('TodoController', function($scope, Restangular) {
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

gearApp.controller('MainController', function($scope, Restangular, AuthService) {
    console.log("MainController");
    $scope.auth = AuthService;
});
