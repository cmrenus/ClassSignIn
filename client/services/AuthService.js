angular.module('ClassSignIn')
.factory('AuthService', ['$http', '$cookies', '$window',  function ($http, $cookies, $window) {

    function getUserStatus() {
      return $cookies.get('user');
    }

    function getUserType() {
      return $cookies.get('type');
    }

    function logout(){
      $http({
        method: 'GET',
        url: 'logout'
      })
      .then(function(data){
        $cookies.remove('user');
        $cookies.remove('type');
        $cookies.remove('class');
        $window.location = data.data;
      },
      function(err){
        console.log(err);
      });
    };

    // return available functions for use in controllers
    return ({
      getUserStatus: getUserStatus,
      logout: logout,
      getUserType: getUserType
    });
}]);