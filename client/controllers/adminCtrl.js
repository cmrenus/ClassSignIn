angular.module('ClassSignIn')
.controller('adminCtrl', ['$scope', '$http', 'Upload', 'adminService', function($scope, $http, upload, adminService) {
	$scope.class = {};

	adminService.getSemesters().then(function(res){
		$scope.semesters = res.data;

	},
	function(err){
		console.log(error);
	});

	$scope.addClass = function(){
		adminService.addClass($scope.class).then(function(res){
			console.log(res);
		},
		function(err){
			console.log(err);
		});
	};

	$scope.getClasses = function(semester){
		adminService.getClasses(semester).then(function(res){
			console.log(res);
		},
		function(err){
			console.log(err);
		});
	};

}]);