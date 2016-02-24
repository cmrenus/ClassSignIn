

angular.module('ClassSignIn')
.controller('homeCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.login = function(){
		$http({
			method : 'GET',
			url: '/login',
			withCredentials: true
		}).then(function(response){
			console.log(response);
		}).catch(function(err){
			console.log(err);
		});
	};


}]);