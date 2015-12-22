angular.module('Login', [])

    .controller('LoginController', function($scope, $state, $ionicHistory, Auth) {
      // Form data for the login modal
      $scope.loginData = {};

      $scope.logout = function() {
        Auth.logout();
        $state.go("login");
      };


      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {

        if(!angular.isDefined($scope.loginData.username) || !angular.isDefined($scope.loginData.password) || $scope.loginData.username.trim() == "" || $scope.loginData.password.trim() == ""){
          alert("Enter both user name and password");
          return;
        }

        Auth.setUser({
          username: $scope.loginData.username
        });

        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $state.go("app.calendar");

      };

    });
