angular.module('ClassSignIn')
.controller('adminCtrl', ['$scope', '$http', 'Upload', 'adminService', function($scope, $http, upload, adminService) {
	$scope.class = {};

	$scope.addClass = function(){
		adminService.addClass($scope.class)
			.then(function(res){
				console.log(res);
			})
			.catch(function(err){
				console.log(err);
			});
	}


}]);