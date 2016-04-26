angular.module('ClassSignIn')
.controller('studentCheckCtrl', ['$scope' , '$http', 'geolocation', 'adminService', '$window', '$uibModal', function($scope, $http, geolocation, adminService, $window, $modal){

	geolocation.getLocation().then(function(data){
		console.log(data.coords);
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
			swal("Error Logging in!", err.data, "error");
			//errorModal(err.data);
			console.log(err);
		});
	});


	errorModal = function(error){
    	$scope.modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'client/views/alert.html',
            controller: ['$scope', function(scope) {
                scope.cancel = $scope.cancel;
                scope.title = "Error";
                scope.body = error;
            }]
        });
  	};

}]);