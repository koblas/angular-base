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
