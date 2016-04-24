angular.module('ClassSignIn')
.factory('AuthService', ['$http', '$cookies', '$window',  function ($http, $cookies, $window) {

    function getUserStatus() {
      return $cookies.get('user');//user;
    }

    function logout(){
      $http({
        method: 'GET',
        url: 'logout'
      })
      .then(function(data){
        console.log(data);
        $cookies.remove('user');
        $window.location = data.data;
      },
      function(err){
        console.log(err);
      });
    };

    // return available functions for use in controllers
    return ({
      //sLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      //login: login,
      logout: logout
    });
}]);