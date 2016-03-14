

angular.module('ClassSignIn')
.controller('homeCtrl', ['$scope', '$http', '$window', 'adminService', function($scope, $http, $window, Service) {
	
	Service.getCurrentSemester().then(function(res){
		Service.getClasses(res.data).then(function(res2){
			$scope.classes = res2.data;
		},
		function(err){
			console.log(err);
		});
	},
	function(err){
		console.log(err);
	});

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