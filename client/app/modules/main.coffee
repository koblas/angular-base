app = angular.module('geartrackerApp');

app.config ($stateProvider) ->
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
            authenticate: false,
        });

app.controller 'IndexController', ($scope, $state, AuthService) ->
    if AuthService.isAuthenticated()
        $state.go('dashboard')

app.controller 'MainController', ($scope, AuthService, $location) ->
    $scope.auth = AuthService;
    $scope.logout = () ->
        AuthService.logout();
        $location.path('/');
