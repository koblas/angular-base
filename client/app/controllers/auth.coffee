app = angular.module('iqvine')

app.config ($stateProvider) ->
    #  States
    $stateProvider
        .state('app.auth', {
            abstract: true
            url: "/auth"
            template: '<ui-view/>'
        })
        .state('app.auth.register', {
            url: "/register?next"
            views:
                'content@app':
                    template: require("../../partials/auth/register.html")
                    controller: "RegisterController"
                    authenticate: false
        })
        .state('app.auth.login', {
            url: "/login?next"
            views:
                'content@app':
                    template: require("../../partials/auth/login.html")
                    controller: "LoginController"
                    authenticate: false
        })
        .state('app.auth.logout', {
            url: "/logout"
            # template: require("../../partials/auth/logout.html")
            views:
                'content@app':
                    template: "<div></div>"
                    controller: "LogoutController"
                    authenticate: false
        })

app.controller 'LoginController', ($scope, $location,  AuthService, $stateParams) ->
    $scope.email = ""
    $scope.error = ""
    $scope.next  = $stateParams.params?.next || '/'

    $scope.login = () ->
        if !$scope.email
            $scope.error = "Invalid Email Address"
            return

        if !$scope.password
            $scope.error = "Invalid Password"
            return

        AuthService.login($scope.email, $scope.password)
            .then () -> $location.path($scope.next)
            .catch (err) -> console.log("Auth Error", err)

app.controller 'RegisterController', ($scope, $location, AuthService, $stateParams) ->
    $scope.password = ""
    $scope.username = ""
    $scope.email = ""
    $scope.error = ""
    $scope.next  = $stateParams.params?.next || '/'

    $scope.register = () ->
        if !$scope.email
            $scope.error = "Invalid Email Address"
            return
        if !$scope.username
            $scope.error = "Invalid Username"
            return
        if !$scope.password
            $scope.error = "Invalid Password"
            return

        AuthService.register($scope.email, $scope.password, { username: $scope.username })
            .then () -> $location.path($scope.next)
            .catch (err) -> $scope.error = err
