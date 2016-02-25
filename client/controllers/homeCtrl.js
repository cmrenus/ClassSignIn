

angular.module('ClassSignIn')
.controller('homeCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
	$scope.login = function(){
		$http({
			method : 'GET',
			url: '/login',
			withCredentials: true
		}).then(function(data){
			$window.location = 'https://cas-auth.rpi.edu/cas/login?service=http%3A%2F%2Flocalhost%3A8005%2Flogin&renew=false';
			console.log(data);
		}).catch(function(err){
			console.log(err);
		});
	};


}]);