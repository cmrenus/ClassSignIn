angular.module('ClassSignIn')
.controller('studentCheckCtrl', ['$scope' , '$http', 'geolocation', 'adminService', function($scope, $http, geolocation, adminService){

	geolocation.getLocation().then(function(data){
		console.log(data.coords);
		adminService.signIn(data).then(function(data){
			console.log(data);
		},
		function(err){
			console.log(err);
		});
	});




}]);