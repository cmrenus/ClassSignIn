angular.module('ClassSignIn')
.controller('studentCheckCtrl', ['$scope' , '$http', 'geolocation', 'adminService', '$window', function($scope, $http, geolocation, adminService, $window){

	geolocation.getLocation().then(function(data){
		console.log(data.coords);
		adminService.signIn(data).then(function(data){
			console.log(data.status);
			if(data.status == 300){
				console.log(data.data);
				$window.location = data.data;
			}
			console.log(data);
		},
		function(err){
			if(err.status == 300){
				$window.location = err.data
			}
			console.log(err);
		});
	});




}]);