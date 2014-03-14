'use strict';

var app = angular.module('geartrackerApp');

app.config(function($stateProvider) {
    // States
    $stateProvider
        .state('register', {
            url: "/auth/register?next",
            templateUrl: "/static/partials/auth/register.html",
            controller: "RegisterController",
            authenticate: false
        })
        .state('login', {
            url: "/auth/login?next",
            templateUrl: "/static/partials/auth/login.html",
            controller: "LoginController",
            authenticate: false
        })
        .state('logout', {
            url: "/auth/logout",
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
