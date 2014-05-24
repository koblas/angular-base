app = angular.module('iqvine');

app.config ($stateProvider) ->
    $stateProvider
        .state('app.index_', {
            url: '',
            views:
                'content@app':
                    template: require('../../partials/index.html')
                    controller: "IndexController"
                    authenticate: false
        });
    $stateProvider
        .state('app.index', {
            url: '/',
            views:
                'content@app':
                    template: require('../../partials/index.html')
                    controller: "IndexController"
                    authenticate: false
        });

app.controller 'IndexController', ($scope, $state, AuthService) ->
    if AuthService.isAuthenticated()
        $state.go('app.dashboard')

app.controller 'HeaderController', ($scope, AuthService, $location) ->
    $scope.auth = AuthService;
    $scope.logout = () ->
        AuthService.logout();
        $location.path('/');
