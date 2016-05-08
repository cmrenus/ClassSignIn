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
	});

	adminService.getClassOptions().then(function(data){
		$scope.listOfClassOptions = data.data;
	});


	adminService.getCurrentSemester().then(function(res){
		$scope.currentSem = res.data;
	},
	function(err){
		swal("Oops..", "Current semester could not be retrieved", "error");
	});

	$scope.addClass = function(){
		adminService.addClass($scope.newClass, $scope.files).then(function(res){
			swal("Class Added!", "Class " + $scope.newClass.semester + " " + $scope.newClass.className + " " + $scope.newClass.section + " was added!", "success");
			adminService.getSemesters().then(function(res){
				$scope.semesters = res.data;
			},
			function(err){
				swal("Oops..", "Semesters could not be retrieved", "error");
			});
		},
		function(err){
			swal("Oops..", err.data, "error");
		});
	};

	$scope.getClasses = function(semester){
		$scope.editClassInfo = undefined;
		selectedSemester = semester;
		$scope.classSelect = "";
		adminService.getClasses(semester).then(function(res){
			$scope.classes = res.data;
		},
		function(err){
			swal("Oops..", err.data, "error");
		});
	};
	
	$scope.getClassInfo = function(classID){
		selectedClass = classID;
		if(classID != ""){
			adminService.getClassInfo(classID).then(function(res){
				res.data.startTime = new Date(res.data.startTime);
				$scope.editClassInfo = res.data;
			},
			function(err){
				swal("Oops..", err.data, "error");
			});
		}
		else{
			$scope.editClassInfo = {};
		}
	};

	$scope.editClass = function(){
		var changes = {_id: $scope.editClassInfo._id, TA: $scope.editClassInfo.TA, days: $scope.editClassInfo.days, startTime: $scope.editClassInfo.startTime }
		adminService.editClass(changes).then(function(res){
			swal("Class Edited!", "The edit you made to this class was saved.", "success");
		},
		function(err){
			swal("Oops..", err.data, "error");
		});
	}

	$scope.changeSem = function(semester){
		adminService.changeSemester(semester).then(function(res){
			$scope.currentSem = semester;
			swal("Semester Changed!", "Current semester changed to " + semester, "success");
			console.log(res);
		},
		function(err){
			swal("Oops..", err.data, "error");
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
		},
		function(err){
			swal("Oops..", err.data, "error");
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
			}
		);
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
}]);