angular.module('ClassSignIn').
controller('TACtrl', ['$scope', 'adminService', function($scope, adminService){
	

  $scope.date = {
    classSelect: undefined,
    dt: new Date(),
    classSelectStudent: undefined,
  };

	adminService.getCurrentSemester().then(function(res){
		adminService.getClasses(res.data).then(function(res){
			$scope.classes = res.data;
      $scope.classes2 = res.data;
		},
		function(err){
      sswal("Oops..", "Classes could not be retrieved", "error");
		});
	},function(err){
    swal("Oops..", "Semester could not be retrieved", "error");
	});

  $scope.$watchGroup(['date.dt', 'date.classSelect'], function(newValues, oldValues){
    if($scope.date.classSelect != undefined){
      getAttendanceByDate(newValues[0], newValues[1]);
    }
  });


  $scope.today = function() {
    $scope.date.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.date.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };
  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
  };

  $scope.toggleMin();


  $scope.setDate = function(year, month, day) {
    $scope.date.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];


  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };

  getAttendanceByDate = function(date, classID){
  	adminService.getAttendanceByDate(date, classID).then(function(res){
      if(res.status == 204){
        $scope.noAttendance = "No Attendance";
        $scope.classList = undefined;
      }
      else{
    		$scope.classList = res.data.classList;
    		$scope.noAttendance = undefined;
      }
  	},
  	function(err){
      swal("Oops..", "Attendance could not be retrieved", "error");
  	});
  };

  $scope.getStudents = function(classID){
    adminService.getClassInfo(classID).then(function(res){
      $scope.classList2 = res.data.classList;
      $scope.dates = undefined;
      $scope.noDates = undefined;
    },
    function(err){
      swal("Oops..", "Students could not be retrieved", "error");
    });
  };

  $scope.getAttendanceByStudent = function(rcs, classID){
    if(rcs != ""){
      adminService.getAttendanceByStudent(rcs, classID).then(function(res){
        if(res.status == 204){
          $scope.noDates = "No Attendance";
          $scope.dates = undefined;
          $scope.total = undefined;
        }
        else{
          $scope.dates = res.data.attendance;
          $scope.total = res.data.count;
          $scope.noDates = undefined;
        }
        
      },
      function(err){
        swal("Oops..", "Attendance could not be retrieved", "error");
      });
    }
    else{
      $scope.noDates = undefined;
      $scope.dates = undefined;
    }
  };

  $scope.editAttendance = function(rcs, date, present, classID, button){
    console.log(classID, present);
    var text = "present";
    if(present){
      text = "absent";
    }
    swal({
      title: "Are you sure?",
      text: "Change "+ rcs +"'s attendance for " + date + " to " + text + "?",
      type: 'warning',
      showCancelButton: true,
      closeOnConfirm: false
    },
    function(){
      adminService.editAttendance(rcs, date, classID, present).then(function(res){
        swal("Edited!", "Attendance was changed", "success");
        if(button == 'date'){
          for(x in $scope.classList){
            if($scope.classList[x].rcs == rcs){
              $scope.classList[x].present = !present;
              break;
            }
          }
        }
        else{
          for(x in $scope.dates){
            if($scope.dates[x].date == date){
              $scope.dates[x].present = !present;
              break;
            }
          }
        }
      },
      function(err){
        swal("Oops..", "Attendance could not be changed", "error");
      });
    });
  };
}]);