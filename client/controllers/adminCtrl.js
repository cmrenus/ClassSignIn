angular.module('ClassSignIn')
.controller('adminCtrl', ['$scope', '$http', 'Upload', 'adminService', '$uibModal', function($scope, $http, upload, adminService, $modal) {
	$scope.newClass = {};
	var selectedSemester, selectedClass;

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
		selectedSemester = semester;
		adminService.getClasses(semester).then(function(res){
			console.log(res.data);
			$scope.classes = res.data;
		},
		function(err){
			console.log(err);
		});
	};
	
	$scope.getStudents = function(classID){
		selectedClass = classID;
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

	$scope.addStudentModal = function () {
        $scope.alerts = [];
        $scope.modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'client/views/addStudentModal.html',
          controller: ['$scope', function(scope){
            //scope.alerts = $scope.alerts;
            scope.cancel = $scope.cancel;
            scope.addStudent = $scope.addStudent;
          }]
        });
        $scope.modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        });
    };

    $scope.cancel = function () {
        $scope.modalInstance.dismiss('cancel');
    };

   	$scope.addStudent = function(newStudent){
		adminService.addStudent(newStudent, selectedClass).then(function(res){
			console.log(res);
		},
		function(err){
			console.log(err);
		});
	};

	$scope.deleteModal = function(rcs, classID){
        $scope.modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'client/views/deleteStudentModal.html',
            controller: ['$scope', function(scope) {
                scope.cancel = $scope.cancel;
                scope.rcs = rcs;
                scope.classID = classID
                scope.deleteStudent = $scope.deleteStudent;
            }]
        });
    };

    $scope.deleteStudent = function(rcs, classID){
      	adminService.deleteStudent(rcs, classID).then(function(res){
            /*for(x in $scope.users){
                if($scope.users[x].CEC == CEC){
                    $scope.users.splice(x, 1);
                    $scope.modalInstance.dismiss('cancel');
                    return;
                }
            }*/
            console.log(res);
            $scope.cancel();
        },
        function(err){
        	console.log(err);
        });
    };


}]);