angular.module('ClassSignIn')
.controller('adminCtrl', ['$scope', '$http', 'adminService', '$uibModal', function($scope, $http, adminService, $modal) {
	$scope.newClass = {};
	$scope.files = {};
	var selectedSemester, selectedClass;

	adminService.getSemesters().then(function(res){
		$scope.semesters = res.data;
	},
	function(err){
		errorModal(err.data);
	});

	adminService.getCurrentSemester().then(function(res){
		$scope.currentSem = res.data;
	},
	function(err){
		errorModal(err.data);
	});

	$scope.addClass = function(){
		adminService.addClass($scope.newClass, $scope.files).then(function(res){
			console.log(res);
			$scope.modalInstance = $modal.open({
	            animation: $scope.animationsEnabled,
	            templateUrl: 'client/views/alert.html',
	            controller: ['$scope', function(scope) {
	                scope.cancel = $scope.cancel;
	                scope.title = "Add Class";
	              	scope.body = "Class " + $scope.newClass.semester + " " + $scope.newClass.className + " was added";
	            	$scope.newClass = {};
	            	$scopes.files = {};
	            }]
	        });
	        //$scope.newClass = undefined;
			adminService.getSemesters().then(function(res){
				$scope.semesters = res.data;
			},
			function(err){
				errorModal(err.data);
			});
		},
		function(err){
			errorModal(err.data);
		});
	};

	$scope.getClasses = function(semester){
		$scope.editClassInfo = undefined;
		selectedSemester = semester;
		$scope.classSelect = "";
		adminService.getClasses(semester).then(function(res){
			console.log(res.data);
			$scope.classes = res.data;
		},
		function(err){
			errorModal(err.data);
		});
	};
	
	$scope.getClassInfo = function(classID){
		selectedClass = classID;
		if(classID != ""){
			adminService.getClassInfo(classID).then(function(res){
				res.data.startTime = new Date(res.data.startTime);
				$scope.editClassInfo = res.data;
				console.log(res.data);
			},
			function(err){
				errorModal(err.data);
			});
		}
		else{
			$scope.editClassInfo = {};
		}
	};

	$scope.editClass = function(){
		var changes = {_id: $scope.editClassInfo._id, TA: $scope.editClassInfo.TA, days: $scope.editClassInfo.days, startTime: $scope.editClassInfo.startTime }
		adminService.editClass(changes).then(function(res){
			console.log(res);
			$scope.modalInstance = $modal.open({
	          animation: $scope.animationsEnabled,
	          templateUrl: 'client/views/alert.html',
	          controller: ['$scope', function(scope){
	            scope.cancel = $scope.cancel;
	            scope.title = "Edit Class";
	            scope.body = "The edit you made to the class was saved!";
	          }]
	        });
		},
		function(err){
			errorModal(err.data);
		});
	}

	$scope.changeSem = function(semester){
		console.log(semester);
		adminService.changeSemester(semester).then(function(res){
			$scope.currentSem = semester;
			$scope.modalInstance = $modal.open({
	          animation: $scope.animationsEnabled,
	          templateUrl: 'client/views/alert.html',
	          controller: ['$scope', function(scope){
	            scope.cancel = $scope.cancel;
	            scope.title = "Current Semester Changed";
	            scope.body = "Current semester changed to " + semester;
	          }]
	        });
			console.log(res);
		},
		function(err){
			errorModal(err.data);
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
   		if($scope.editClassInfo.classList == undefined){
   			$scope.editClassInfo.classList = [];
   		}
		adminService.addStudent(newStudent, selectedClass).then(function(res){
			$scope.editClassInfo.classList.push(newStudent);
			$scope.modalInstance.dismiss('cancel');
			$scope.modalInstance = $modal.open({
	          animation: $scope.animationsEnabled,
	          templateUrl: 'client/views/alert.html',
	          controller: ['$scope', function(scope){
	            scope.cancel = $scope.cancel;
	            scope.title = "Add Student";
	            scope.body = "Student " + newStudent.rcs + " was added";
	          }]
	        });
		},
		function(err){
			errorModal(err.data);
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
        	errorModal(err.data);
        });
    };

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