var app = angular.module('ClassSignIn', ['ngRoute', 'ui.bootstrap', 'ngFileUpload']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'client/views/home.html',
		controller: 'homeCtrl'
	}).
	when('/admin',{
		templateUrl: 'client/views/adminForm.html',
		controller: 'adminCtrl'
	}).
	otherwise({
		redirectTo:'/'
	});
}]);