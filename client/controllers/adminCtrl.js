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
			$scope.newClass = undefined;
			adminService.getSemesters().then(function(res){
				$scope.semesters = res.data;
			},
			function(err){
				console.log(error);
			});
		},
		function(err){
			console.log(err);
		});
	};

	$scope.getClasses = function(semester){
		$scope.editClassInfo = undefined;
		selectedSemester = semester;
		adminService.getClasses(semester).then(function(res){
			console.log(res.data);
			$scope.classes = res.data;
		},
		function(err){
			console.log(err);
		});
	};
	
	$scope.getClassInfo = function(classID){
		selectedClass = classID;
		if(classID != ""){
			adminService.getClassInfo(classID).then(function(res){
				res.data.startTime = new Date(res.data.startTime);
				$scope.editClassInfo = res.data;
				console.log(res.data);
				//$scope.editClassInfo.startTime = new Date(res.data.startTime);
				//$scope.students = res.data;

			},
			function(err){
				console.log(err);
			});
		}
	};

	$scope.editClass = function(){
		var changes = {_id: $scope.editClassInfo._id, TA: $scope.editClassInfo.TA, days: $scope.editClassInfo.days, startTime: $scope.editClassInfo.startTime }
		adminService.editClass(changes).then(function(res){
			console.log(res);
		},
		function(err){
			console.log(err);
		});
	}

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
			$scope.editClassInfo.classList.push(newStudent);
			$scope.modalInstance.dismiss('cancel');
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
            for(x in $scope.editClassInfo.classList){
                if($scope.editClassInfo.classList[x].rcs == rcs){
                    $scope.editClassInfo.classList.splice(x, 1);
                    $scope.modalInstance.dismiss('cancel');
                    return;
                }
            }
            $scope.cancel();
        },
        function(err){
        	console.log(err);
        });
    };


}]);