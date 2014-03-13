'use strict';

angular.module('geartrackerApp').service('AuthService',
    function () {
        this.authenticated = false;
        this.name = null;
        return {
            isAuthenticated: function() {
                return this.authenticated;
            },
            getName: function() {
                return this.name;
            },
            login: function() {
                this.authenticated = true;
            },
            logout: function() {
                this.authenticated = false;
            }
        }
    }
);
