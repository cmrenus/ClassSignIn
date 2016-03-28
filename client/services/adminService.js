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

	this.getStudentList = function(classID){
		return $http({
			method: 'GET',
			url: 'admin/studentList?classID=' + classID
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

	this.deleteStudent = function(rcs, classID){
		return $http({
			method: 'DELETE',
			url: 'admin/deleteStudent?rcs=' + rcs + '&classID='+classID
		});
	};

}]);
