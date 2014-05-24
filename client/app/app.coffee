app = angular.module 'iqvine', ['restangular', 'ui.router', 'ngCookies', 'ui.bootstrap']

angular.element(document).ready () -> angular.bootstrap(document, ['iqvine'])

require('./services/auth')
require('./controllers/main')
require('./controllers/todo')
require('./controllers/auth')

#
#  Set the layout
#
app.config ($stateProvider) ->
    $stateProvider
        .state('app',
            url: ''
            abstract: true
            views:
                container:
                    template: require('../partials/layout.html')
                footer:
                    template: require('../partials/footer.html')
                header:
                    controller: 'HeaderController'
                    template: require('../partials/header.html')
        )

#
#  Restanuglar setup
#
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
            event.preventDefault()
