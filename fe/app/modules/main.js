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
