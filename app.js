var app = angular.module('ClassSignIn', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'client/views/home.html',
		controller: 'homeCtrl'
	}).
	when('/admin',{
		templateUrl: 'client/views/adminForm.html'
	}).
	otherwise({
		redirectTo:'/'
	});
}]);