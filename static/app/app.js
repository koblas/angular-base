(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var app = angular.module('geartrackerApp', ['restangular', 'ui.router', 'ngCookies']);

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

angular.module('geartrackerApp').service('AuthService', ['Restangular', '$q', '$cookies', '$state',
    function (Restangular, $q, $cookies, $state) {
        var Auth = Restangular.all('auth');
        var auth_cookie = 'user_auth';
        var self = this;
        
        self.authenticated = false;
        self.name = null;

        ///
        //  If the auth cookie is around - use it
        //
        if ($cookies[auth_cookie]) {
            this.authenticated = true;

            Auth.post({token:$cookies[auth_cookie]}).then(function (auth) {
                if (auth && auth.token) {
                    // Token is good, set the authentication headers
                    Restangular.setDefaultHeaders({Authorization: 'Basic ' + auth.token})
                } else {
                    // If the token is "bad" e.g. you're no longer a valid user, cleanup
                    delete $cookies[auth_cookie];
                    self.authenticated = false;
                    $state.transitionTo("index");
                }
            });
        }

        return {
            isAuthenticated: function() {
                return self.authenticated;
            },

            ///
            //  Login a user by email + password - return a promise
            //
            // TODO - better error messages on the result
            //
            login: function(email, password) {
                var deferred = $q.defer();

                return Auth.post({email:email, password:password}).then(function (auth) {
                    if (auth.token) {
                        self.authenticated = true;

                        $cookies[auth_cookie] = auth.token;
                        Restangular.setDefaultHeaders({Authorization: 'Basic ' + auth.token})

                        deferred.resolve("ok");
                    } else {
                        deferred.reject("unknown");
                    }
                }, function(err) {
                    deferred.reject(err.data.emsg);
                });

                return deferred.promise;
            },

            logout: function() {
                self.authenticated = false;
                delete $cookies[auth_cookie];
                Restangular.setDefaultHeaders({Authorization: 'Basic ' + 'INVALID'})
            },

            register: function(email, password, params) {
                var deferred = $q.defer();

                Auth.post({email:email, password:password, params:params}, {register:true}).then(function (auth) {
                    if (auth.token) {
                        self.authenticated = true;

                        $cookies[auth_cookie] = auth.token;
                        Restangular.setDefaultHeaders({Authorization: 'Basic ' + auth.token})
                        deferred.resolve("ok");
                    } else {
                        deferred.reject("unknown");
                    }
                }, function(err) {
                    deferred.reject(err.data.emsg);
                });

                return deferred.promise;
            }
        };
    }
]);

},{}],3:[function(require,module,exports){
'use strict';

var app = angular.module('geartrackerApp');

app.config(function($stateProvider) {
    // States
    $stateProvider
        .state('auth', {
            abstract: true,
            url: "/auth",
            template: '<ui-view/>'
        })
        .state('auth.register', {
            url: "/register?next",
            templateUrl: "/static/partials/auth/register.html",
            controller: "RegisterController",
            authenticate: false
        })
        .state('auth.login', {
            url: "/login?next",
            templateUrl: "/static/partials/auth/login.html",
            controller: "LoginController",
            authenticate: false
        })
        .state('auth.logout', {
            url: "/logout",
            templateUrl: "/static/partials/logout.html",
            controller: "LogoutController",
            authenticate: false
        });
});

app.controller('LoginController', ['$scope', '$location', 'AuthService', '$state', function($scope, $location,  AuthService, $stateProvider) {
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

        AuthService.login($scope.email, $scope.password).then(function() {
            $location.path($scope.next);
        }, function(err) {
            console.log("Auth Error");
        });
    }
}])

app.controller('RegisterController', ['$scope', '$location', 'AuthService', '$state', function($scope, $location, AuthService, $stateProvider) {
    $scope.password = "";
    $scope.username = "";
    $scope.email = "";
    $scope.error = "";
    $scope.next  = $stateProvider.params.next || '/';

    $scope.register = function() {
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

        AuthService.register($scope.email, $scope.password, { username: $scope.username }).then(function() {
            $location.path($scope.next);
        }, function(err) {
            $scope.error = err;
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

app.controller('IndexController', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {
    if (AuthService.isAuthenticated()) {
        $state.go('dashboard')
    }
}]);

app.controller('MainController', function($scope, AuthService, $location) {
    $scope.auth = AuthService;
    $scope.logout = function() {
        AuthService.logout();
        $location.path('/');
    }
});

},{}],5:[function(require,module,exports){
'use strict';

var app = angular.module('geartrackerApp');

app.config(function($stateProvider) {
    $stateProvider
        .state('dashboard', {
            url: '/dash',
            templateUrl: '/static/partials/dashboard.html',
            controller: "DashboardController",
            authenticate: true
        })
        .state('todo', {
            url: '/todo',
            templateUrl: '/static/partials/todo.html',
            controller: "TodoController",
            authenticate: true
        });
});

app.controller('DashboardController', function($scope, Restangular) {
})

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