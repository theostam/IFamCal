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
          $scope.dataLoading = true;
          Auth.loginAndCallback($scope.loginData.username, $scope.loginData.password, function(response) {
            var login_successful = response.result == 'login successful';
            if(login_successful) {
                  Auth.setUser( {username: $scope.loginData.username} );
//                $location.path('/');
              $ionicHistory.nextViewOptions({
                disableBack: true
              });

              $state.go("app.calendar");
            } else {
              $scope.error = (response.result ? response.result: 'unknown error');
              $scope.dataLoading = false;
              console.log('error logging in:'+$scope.error)
            }
          });
      };

    });
