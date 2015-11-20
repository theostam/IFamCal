angular.module('MainView', [])


.controller('MainViewController', function($rootScope, $scope, $ionicSideMenuDelegate) {
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleRight();
        };

        $scope.search = function() {
            $rootScope.$broadcast('notes_updated');
        };
    })

;
