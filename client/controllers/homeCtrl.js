angular.module('ClassSignIn')
.controller('homeCtrl', ['$scope', '$http', '$window', 'adminService', '$cookies', function($scope, $http, $window, Service, $cookies) {
	
	Service.getCurrentSemester().then(function(res){
		Service.getClasses(res.data).then(function(res2){
			$scope.classes = res2.data;
		},
		function(err){
			sweetAlert("Oops..", err.data, "error");
		});
	},
	function(err){
		sweetAlert("Oops..", err.data, "error");
	});

	$scope.login = function(){
		$cookies.put('class', $scope.classSelect);
		$http({
			method : 'GET',
			url: '/signIn?class=' + $scope.classSelect + '&returnTo=/%23/signIn'
		}).then(function(data){
			console.log(data);
			$window.location = data.data;
		}).catch(function(err){
			sweetAlert("Oops..", err.data, "error");
		});
	};
}]);