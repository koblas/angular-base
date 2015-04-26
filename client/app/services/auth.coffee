app = angular.module('iqvine')

app.service 'AuthService', (Restangular, $q, $cookies, $state) ->
    Auth = Restangular.all('auth')
    auth_cookie = 'user_auth'
    self = this
    
    self.authenticated = false
    self.name = null

    #
    #  If the auth cookie is around - use it
    #
    if ($cookies[auth_cookie]) 
        this.authenticated = true

        Auth.post({token:$cookies[auth_cookie]})
            .then (auth) ->
                if (!auth && !auth.token) 
                    #  If the token is "bad" e.g. you're no longer a valid user, cleanup
                    delete $cookies[auth_cookie]
                    self.authenticated = false
                    $state.transitionTo("index")

    return {
        isAuthenticated: () -> self.authenticated

        #
        #  Login a user by email + password - return a promise
        # 
        #  TODO - better error messages on the result
        #
        login: (email, password) ->
            deferred = $q.defer()

            Auth.post({email:email, password:password})
                .then (auth) ->
                    if auth.token
                        self.authenticated = true

                        $cookies[auth_cookie] = auth.token

                        deferred.resolve("ok")
                    else
                        deferred.reject("unknown")

                .catch (err) ->
                    deferred.reject(err.data.emsg)

            deferred.promise

        logout: () ->
            self.authenticated = false
            delete $cookies[auth_cookie]

        register: (email, password, params) ->
            deferred = $q.defer()

            Auth.post({email:email, password:password, params:params}, {register:true})
                .then (auth) ->
                    if auth.token
                        self.authenticated = true

                        $cookies[auth_cookie] = auth.token
                        deferred.resolve("ok")
                    else
                        deferred.reject("unknown")
                .catch (err) ->
                    deferred.reject(err.data.emsg)

            deferred.promise
    }
