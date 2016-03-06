angular.module('ClassSignIn')
.controller('studentCheckCtrl', ['$scope' , '$http', 'geolocation', function($scope, $http, geolocation){

	geolocation.getLocation().then(function(data){
		console.log(data);
	});




}]);