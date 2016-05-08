var app = angular.module('ClassSignIn', ['ngRoute', 'ui.bootstrap', 'ngFileUpload', 'geolocation', 'ngCookies']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'client/views/home.html',
		controller: 'homeCtrl',
		access: {restricted: false}
	}).
	when('/admin',{
		templateUrl: 'client/views/adminForm.html',
		controller: 'adminCtrl',
		access: {restricted: "admin"}
	}).
	when('/signIn', {
		templateUrl: 'client/views/studentCheck.html',
		controller: 'studentCheckCtrl',
		access: {restricted: 'student'}
	}).
	when('/TA', {
		templateUrl: 'client/views/TAPage.html',
		controller: 'TACtrl',
		access: {restricted: "TA"}
	}).
	otherwise({
		redirectTo:'/'
	});
}]);

/*
app.run(['$rootScope', '$location', '$route', 'AuthService', function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.$$route != undefined && next.$$route.access.restricted && (AuthService.getUserStatus() == undefined || AuthService.getUserStatus() == '')) {
      $location.path('/');
    }
  });
}]);*/