angular.module('ClassSignIn')
.controller('adminCtrl', ['$scope', '$http', 'Upload', 'adminService', function($scope, $http, upload, adminService) {
	$scope.newClass = {};


	adminService.getSemesters().then(function(res){
		$scope.semesters = res.data;
	},
	function(err){
		console.log(error);
	});

	adminService.getCurrentSemester().then(function(res){
		$scope.currentSem = res.data;
	},
	function(err){
		console.log(err);
	});

	$scope.addClass = function(){
		adminService.addClass($scope.newClass).then(function(res){
			console.log(res);
		},
		function(err){
			console.log(err);
		});
	};

	$scope.getClasses = function(semester){
		adminService.getClasses(semester).then(function(res){
			console.log(res.data);
			$scope.classes = res.data;
		},
		function(err){
			console.log(err);
		});
	};
	
	$scope.getStudents = function(classID){
		adminService.getStudentList(classID).then(function(res){
			console.log(res.data);
			$scope.students = res.data;
		},
		function(err){
			console.log(err);
		});
	};

	$scope.changeSem = function(semester){
		console.log(semester);
		adminService.changeSemester(semester).then(function(res){
			console.log(res);
		},
		function(err){
			console.log(err);
		});
	};

}]);