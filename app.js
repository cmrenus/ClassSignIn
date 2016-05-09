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
		access: {restricted: true, type: 'admin'}
	}).
	when('/signIn', {
		templateUrl: 'client/views/studentCheck.html',
		controller: 'studentCheckCtrl',
		access: {restricted: true, type: 'student'}
	}).
	when('/TA', {
		templateUrl: 'client/views/TAPage.html',
		controller: 'TACtrl',
		access: {restricted: true, type: 'TA'}
	}).
	otherwise({
		redirectTo:'/'
	});
}]);

app.run(['$rootScope', '$location', '$route', 'AuthService', function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
  	console.log(next.$$route != undefined && next.$$route.access != undefined && next.$$route.access.restricted && (next.$$route.access.type == AuthService.getUserType() || (next.$$route.access.type == 'TA' && AuthService.getUserType() == 'admin')))
  	//console.log((next.$$route != undefined && next.$$route.access != undefined && next.$$route.access.restricted != undefined && (next.$$route.access.restricted == AuthService.getUserType() || (next.$$route.access.restricted == 'TA' && AuthService.getUserType() == 'admin'))));
  	//console.log(next.$$route != undefined, next.$$route.access != undefined, next.$$route.access.restricted != undefined, (next.$$route.access.restricted == AuthService.getUserType() || (next.$$route.access.restricted == 'TA' && AuthService.getUserType() == 'admin')));
    if (next.$$route != undefined && next.$$route.access != undefined && next.$$route.access.restricted && (next.$$route.access.type == AuthService.getUserType() || (next.$$route.access.type == 'TA' && AuthService.getUserType() == 'admin'))) {
      //$location.path('/');
    }
    else{
    	$location.path('/');
    }
  });
}]);