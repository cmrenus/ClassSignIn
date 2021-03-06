angular.module('ClassSignIn')
.controller('studentCheckCtrl', ['$scope' , '$http', 'geolocation', 'adminService', '$window',  function($scope, $http, geolocation, adminService, $window){

	geolocation.getLocation().then(function(data){
		swal("Logging In!");
		adminService.signIn(data).then(function(data){
			swal("Success!", data.data, "success");
		},
		function(err){
			swal({
				title: "Error Logging in!", 
				text: err.data, 
				type: "error",
				html: true
			});
		});
	});

	getAttendance = function(){
		$http({
			method: 'GET',
			url: '/signIn/checkAttendance'
		}).then(function(data){
			$scope.dates = data.data.attendance;
			$scope.total = data.data.count;
		}).catch(function(err){
			swal({
				title: "Oops...",
				text: err.data,
				type:"error"
			});
		});
	}

	getAttendance();


}]);