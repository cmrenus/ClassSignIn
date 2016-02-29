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
}]);
