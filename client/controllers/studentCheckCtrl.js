angular.module('ClassSignIn')
.controller('studentCheckCtrl', ['$scope' , '$http', 'geolocation', 'adminService', '$window', '$uibModal', function($scope, $http, geolocation, adminService, $window, $modal){

	geolocation.getLocation().then(function(data){
		console.log(data.coords);
		swal("Logging In!");
		adminService.signIn(data).then(function(data){
			/*console.log(data.status);
			if(data.status == 300){
				console.log(data.data);
				$window.location = data.data;
			}*/
			swal("Success!", data.data, "success");
			console.log(data);
		},
		function(err){
			/*if(err.status == 300){
				$window.location = err.data
			}*/
			swal({
				title: "Error Logging in!", 
				text: err.data, 
				type: "error",
				html: true
			});
			//errorModal(err.data);
			console.log(err);
		});
	});
}]);