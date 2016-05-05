angular.module('ClassSignIn')
.controller('adminCtrl', ['$scope', '$http', 'adminService', '$uibModal', function($scope, $http, adminService, $modal) {
	$scope.newClass = {};
	$scope.files = {};
	var selectedSemester, selectedClass;

	adminService.getSemesters().then(function(res){
		$scope.semesters = res.data;
	},
	function(err){
		swal("Oops..", "Semesters could not be retrieved", "error");
		//errorModal(err.data);
	});

	adminService.getClassOptions().then(function(data){
		$scope.listOfClassOptions = data.data;
	});


	adminService.getCurrentSemester().then(function(res){
		$scope.currentSem = res.data;
	},
	function(err){
		swal("Oops..", "Current semester could not be retrieved", "error");
		//errorModal(err.data);
	});

	$scope.addClass = function(){
		adminService.addClass($scope.newClass, $scope.files).then(function(res){
			console.log(res);
			swal("Class Added!", "Class " + $scope.newClass.semester + " " + $scope.newClass.className + " " + $scope.newClass.section + " was added!", "success");
			/*$scope.modalInstance = $modal.open({
	            animation: $scope.animationsEnabled,
	            templateUrl: 'client/views/alert.html',
	            controller: ['$scope', function(scope) {
	                scope.cancel = $scope.cancel;
	                scope.title = "Add Class";
	              	scope.body = "Class " + $scope.newClass.semester + " " + $scope.newClass.className + " " + $scope.newClass.section + " was added";
	            	$scope.newClass = {};
	            	$scope.files = {};
	            }]
	        });*/
	        //$scope.newClass = undefined;
			adminService.getSemesters().then(function(res){
				$scope.semesters = res.data;
			},
			function(err){
				swal("Oops..", "Semesters could not be retrieved", "error");
				//errorModal(err.data);
			});
		},
		function(err){
			swal("Oops..", err.data, "error");
			//errorModal(err.data);
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
			swal("Oops..", err.data, "error");
			//errorModal(err.data);
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
				swal("Oops..", err.data, "error");
				//errorModal(err.data);
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
			swal("Class Edited!", "The edit you made to this class was saved.", "success");
			/*$scope.modalInstance = $modal.open({
	          animation: $scope.animationsEnabled,
	          templateUrl: 'client/views/alert.html',
	          controller: ['$scope', function(scope){
	            scope.cancel = $scope.cancel;
	            scope.title = "Edit Class";
	            scope.body = "The edit you made to the class was saved!";
	          }]
	        });*/
		},
		function(err){
			swal("Oops..", err.data, "error");
			//errorModal(err.data);
		});
	}

	$scope.changeSem = function(semester){
		console.log(semester);
		adminService.changeSemester(semester).then(function(res){
			$scope.currentSem = semester;
			swal("Semester Changed!", "Current semester changed to " + semester, "success");
			/*$scope.modalInstance = $modal.open({
	          animation: $scope.animationsEnabled,
	          templateUrl: 'client/views/alert.html',
	          controller: ['$scope', function(scope){
	            scope.cancel = $scope.cancel;
	            scope.title = "Current Semester Changed";
	            scope.body = "Current semester changed to " + semester;
	          }]
	        });*/
			console.log(res);
		},
		function(err){
			swal("Oops..", err.data, "error");
			//errorModal(err.data);
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
			swal("Student Added!", "Student " + newStudent.rcs + " was added!", "success");
			/*$scope.modalInstance = $modal.open({
	          animation: $scope.animationsEnabled,
	          templateUrl: 'client/views/alert.html',
	          controller: ['$scope', function(scope){
	            scope.cancel = $scope.cancel;
	            scope.title = "Add Student";
	            scope.body = "Student " + newStudent.rcs + " was added";
	          }]
	        });*/
		},
		function(err){
			swal("Oops..", err.data, "error");
			//errorModal(err.data);
		});
	};

	$scope.deleteModal = function(rcs, classID){
		swal({
			title: "Are you sure you want to delete this student " + rcs + "?",
			type: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, Delete it!",
			closeOnConfirm: false
			},
			function(){
				deleteStudent(rcs, classID)
			});
        /*$scope.modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'client/views/deleteStudentModal.html',
            controller: ['$scope', function(scope) {
                scope.cancel = $scope.cancel;
                scope.rcs = rcs;
                scope.classID = classID
                scope.deleteStudent = $scope.deleteStudent;
            }]
        });*/
    };

    deleteStudent = function(rcs, classID){
      	adminService.deleteStudent(rcs, classID).then(function(res){
      		swal("Deleted!", "Student, " + rcs + ", was deleted!", "success");
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
        	swal("Oops..", err.data, "error");
        	//errorModal(err.data);
        });
    };


    $scope.addNewClassOption = function(name){
    	adminService.addNewClassOption(name).then(function(data){
    		swal("Added!", "The class, " + name + ", was added as a class option!", "success");
    		$scope.listOfClassOptions.push({name: name});
    	},
    	function(err){
    		swal("Oops..", err.data, "error");
    	});
    };

    $scope.deleteClassOption = function(name){
    	adminService.deleteClassOption(name).then(function(data){
    		swal("Deleted!", "The class, " + name + ", was deleted as a class option!", "success");
    		for(x in $scope.listOfClassOptions){
    			if($scope.listOfClassOptions[x].name == name){
    				$scope.listOfClassOptions.splice(x, 1);
    			}
    		}
    	},
    	function(err){
    		swal("Oops..", err.data, "error");
    	});
    }
    /*
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
*/

}]);