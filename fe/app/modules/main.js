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

app.controller('IndexController', function($scope, Restangular) {
});

app.controller('MainController', function($scope, AuthService, $location) {
    $scope.auth = AuthService;
    $scope.logout = function() {
        AuthService.logout();
        $location.path('/');
    }
});
