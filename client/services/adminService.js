angular.module('ClassSignIn')
.service('adminService', ['$http', 'Upload', function($http, Upload){
	this.addClass = function(newClass){
		console.log(newClass);
		return $http({
			method: "POST",
			data: newClass,
			url: '/admin/newClass'
		});
	};

	this.getSemesters = function(){
		return $http({
			method: 'GET',
			url: '/admin/semesters'
		});
	};

	this.getCurrentSemester = function(){
		return $http({
			method: 'GET',
			url: 'admin/currentSemester'
		});
	};

	this.getClasses = function(semester){
		return $http({
			method: 'GET',
			url: 'admin/classList?semester=' + semester
		});
	};

	this.getClassInfo = function(classID){
		return $http({
			method: 'GET',
			url: 'admin/classInfo?classID=' + classID
		});
	};

	this.changeSemester = function(semester){
		return $http({
			method: 'POST',
			url: 'admin/changeSemester',
			data: {semester: semester}
		});
	};

	this.addStudent = function(student, classID){
		return $http({
			method: 'POST',
			url: 'admin/addStudent',
			data: {student: student, classID: classID}
		});
	};

	this.getAttendanceByDate = function(date, classID){
		return $http({
			method: 'GET',
			url: 'attendance/byDate?date=' + date + '&classID='+classID
		});
	};

	this.getAttendanceByStudent = function(rcs, classID){
		return $http({
			method: 'GET',
			url: 'attendance/byStudent?rcs=' + rcs + '&classID=' + classID
		});
	};

	this.deleteStudent = function(rcs, classID){
		return $http({
			method: 'DELETE',
			url: 'admin/deleteStudent?rcs=' + rcs + '&classID='+classID
		});
	};

	this.signIn = function(geoLocation){
		return $http({
			method: 'POST',
			url: 'signIn',
			data: {coords: {latitude: geoLocation.coords.latitude, longitude: geoLocation.coords.longitude}, time: geoLocation.timestamp}
		});
	};

	this.editClass = function(changes){
		return $http({
			method: 'POST',
			url: 'admin/editClass',
			data: changes
		});
	};

}]);
