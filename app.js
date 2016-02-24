var app = angular.module('ClassSignIn', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'client/views/home.html',
		controller: 'homeCtrl'
	}).
	otherwise({
		redirectTo:'/'
	});



}]);