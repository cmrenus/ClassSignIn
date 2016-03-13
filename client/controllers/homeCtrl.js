

angular.module('ClassSignIn')
.controller('homeCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
	$scope.login = function(){
		$http({
			method : 'GET',
			url: '/login',
			data: {'class' : $scope.classSelect}
		}).then(function(data){
			$window.location = data.data;
		}).catch(function(err){
			console.log(err);
		});
	};
}]);