var app = angular.module('ClassSignIn', ['ngRoute', 'ui.bootstrap', 'ngFileUpload', 'geolocation']);

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
	when('/signIn', {
		templateUrl: 'client/views/studentCheck.html',
		controller: 'studentCheckCtrl'
	}).
	when('/TA', {
		templateUrl: 'client/views/TAPage.html',
		controller: 'TACtrl'
	}).
	otherwise({
		redirectTo:'/'
	});
}]);