angular.module('ClassSignIn').
controller('TACtrl', ['$scope', 'adminService', function($scope, adminService){
	
	adminService.getCurrentSemester().then(function(res){
		adminService.getClasses(res.data).then(function(res){
			$scope.classes = res.data;
      $scope.classes2 = res.data;
		},
		function(err){
			console.log(err);
		});
	},function(err){
		console.log(err);
	});


  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };
/*
  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };
*/
  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    //$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();


  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
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
  }

  $scope.$watchGroup(['dt', 'classSelect'], function(newValues, oldValues){
  	if($scope.classSelect != undefined){
  		getAttendanceByDate(newValues[0], newValues[1]);
  	}
  });

  getAttendanceByDate = function(date, classID){
  	adminService.getAttendanceByDate(date, classID).then(function(res){
  		console.log(res);
      if(res.status == 204){
        $scope.noAttendance = "No Attendance";
        $scope.classList = undefined;
      }
      else{
    		$scope.classList = res.data.classList;
    		$scope.inClass = res.data.inClass;
    		$scope.noAttendance = undefined;
      }
  	},
  	function(err){
  		console.log(err);
  		$scope.classList = undefined;
  		$scope.noAttendance = err.data;
  	});
  };

  $scope.getStudents = function(classID){
    console.log(classID);
    adminService.getClassInfo(classID).then(function(res){
      console.log(res);
      $scope.classList = res.data.classList;
    },
    function(err){
      console.log(err);
    });
  };

  $scope.getAttendanceByStudent = function(rcs, classID){
    adminService.getAttendanceByStudent(rcs, classID).then(function(res){
      console.log(res);
      $scope.dates = res.data;
    },
    function(err){
      console.log(err);
    });
  };
}]);