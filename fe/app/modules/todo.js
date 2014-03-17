'use strict';

var app = angular.module('geartrackerApp');

app.config(function($stateProvider) {
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
});

app.controller('DashboardController', function($scope, Restangular) {
})

app.controller('TodoController', function($scope, Restangular) {
    $scope.todos = [];
    $scope.loaded = false;

    var Todo = Restangular.all('todo');

    Todo.getList().then(function(todos) { 
        $scope.loaded = true; 
        $scope.todos = todos;
    });

    $scope.addTodo = function(title) {
        if (title) {
            Todo.post({'title': title }).then(function (todo) {
                $scope.newTodoTitle = '';
                if (todo)
                    $scope.todos.push(todo);
            }, function (err) {
                return alert(err.data.message || "an error occurred");
            });
        }
    }

    $scope.changeCompleted = function(todo) {
        todo.put().then(null, function(err) {
            return alert(err.data.message || (err.errors && err.errors.completed) || "an error occurred");
        });
    }

    $scope.removeCompletedItems = function() {
        $scope.todos.forEach(function(todo) {
            if (!todo.completed)
                return;

            todo.remove().then(function() {
                $scope.todos = _.without($scope.todos, todo);
            }, function(err) {
                return alert(err.data.message || (err.errors && err.errors.completed) || "an error occurred");
            })
        });
    }
});
