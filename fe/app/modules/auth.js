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
