app = angular.module 'geartrackerApp', ['restangular', 'ui.router', 'ngCookies']

require('./services/auth')
require('./controllers/main')
require('./controllers/todo')
require('./controllers/auth')

app.config (RestangularProvider, $stateProvider, $urlRouterProvider) ->
    RestangularProvider.setBaseUrl('/api/v1')

    RestangularProvider.setResponseExtractor (response, operation, what, url) ->
            #  This is a get for a list
            if operation is "getList" 
                #  Here we're returning an Array which has one special property metadata with our extra information
                newResponse = response.data
            else 
                #  This is an element
                newResponse = response.data

    #  Unmatched URL state
    $urlRouterProvider.otherwise("/")

app.run ($rootScope, $state, $location, AuthService) ->
    $rootScope.$on "$stateChangeStart", (event, toState, toParams, fromState, fromParams) ->
        if toState.authenticate && !AuthService.isAuthenticated()
            #  User isn’t authenticated
            href = $state.href(toState, toParams)
            $state.transitionTo("login", { next: $location.path() })
            event.preventDefault();
