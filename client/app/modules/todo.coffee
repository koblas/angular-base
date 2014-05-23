app = angular.module('geartrackerApp');

app.config ($stateProvider) ->
    $stateProvider
        .state('dashboard', {
            url: '/dash',
            templateUrl: '/static/partials/dashboard.html',
            controller: "DashboardController",
            authenticate: true
        })
        .state('todo', {
            url: '/todo',
            templateUrl: '/static/partials/todo.html',
            controller: "TodoController",
            authenticate: true
        });

app.controller 'DashboardController', ($scope, Restangular) -> true

app.controller 'TodoController', ($scope, Restangular) ->
    $scope.todos = [];
    $scope.loaded = false;

    Todo = Restangular.all('todo')

    Todo.getList().then(
        (todos) ->
            $scope.loaded = true
            $scope.todos = todos
    )

    $scope.addTodo = (title) ->
            if (title)
                Todo.post({'title': title }).then(
                    (todo) ->
                        $scope.newTodoTitle = '';
                        if (todo)
                            $scope.todos.push(todo);
                    , (err) ->
                        return alert(err.data.message || "an error occurred");
                )

    $scope.changeCompleted = (todo) ->
        todo.put().then(null, (err) ->
            return alert(err.data.message || (err.errors && err.errors.completed) || "an error occurred");
        )

    $scope.removeCompletedItems = () ->
        $scope.todos.forEach((todo) ->
            if (!todo.completed)
                return;

            todo.remove().then(() ->
                $scope.todos = _.without($scope.todos, todo);
            , (err) ->
                return alert(err.data.message || (err.errors && err.errors.completed) || "an error occurred");
            )
        )
