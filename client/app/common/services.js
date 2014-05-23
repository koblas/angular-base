'use strict';

var app = angular.module('geartrackerApp');

app.service('AuthService', ['Restangular', '$q', '$cookies', '$state',
    function (Restangular, $q, $cookies, $state) {
        var Auth = Restangular.all('auth');
        var auth_cookie = 'user_auth';
        var self = this;
        
        self.authenticated = false;
        self.name = null;

        ///
        //  If the auth cookie is around - use it
        //
        if ($cookies[auth_cookie]) {
            this.authenticated = true;

            Auth.post({token:$cookies[auth_cookie]}).then(function (auth) {
                if (auth && auth.token) {
                    // Token is good, set the authentication headers
                    Restangular.setDefaultHeaders({Authorization: 'Basic ' + auth.token})
                } else {
                    // If the token is "bad" e.g. you're no longer a valid user, cleanup
                    delete $cookies[auth_cookie];
                    self.authenticated = false;
                    $state.transitionTo("index");
                }
            });
        }

        return {
            isAuthenticated: function() {
                return self.authenticated;
            },

            ///
            //  Login a user by email + password - return a promise
            //
            // TODO - better error messages on the result
            //
            login: function(email, password) {
                var deferred = $q.defer();

                return Auth.post({email:email, password:password}).then(function (auth) {
                    if (auth.token) {
                        self.authenticated = true;

                        $cookies[auth_cookie] = auth.token;
                        Restangular.setDefaultHeaders({Authorization: 'Basic ' + auth.token})

                        deferred.resolve("ok");
                    } else {
                        deferred.reject("unknown");
                    }
                }, function(err) {
                    deferred.reject(err.data.emsg);
                });

                return deferred.promise;
            },

            logout: function() {
                self.authenticated = false;
                delete $cookies[auth_cookie];
                Restangular.setDefaultHeaders({Authorization: 'Basic ' + 'INVALID'})
            },

            register: function(email, password, params) {
                var deferred = $q.defer();

                Auth.post({email:email, password:password, params:params}, {register:true}).then(function (auth) {
                    if (auth.token) {
                        self.authenticated = true;

                        $cookies[auth_cookie] = auth.token;
                        Restangular.setDefaultHeaders({Authorization: 'Basic ' + auth.token})
                        deferred.resolve("ok");
                    } else {
                        deferred.reject("unknown");
                    }
                }, function(err) {
                    deferred.reject(err.data.emsg);
                });

                return deferred.promise;
            }
        };
    }
]);
