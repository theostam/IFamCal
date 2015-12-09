/**
 * Created by theos on 4-12-2015.
 */
angular.module('network.service', [])
    .factory('Network', ['$ionicPlatform', '$rootScope', '$cordovaNetwork', function($ionicPlatform, $rootScope, $cordovaNetwork) {
        var self = this;

        self.type = function () {
            var result;
            $ionicPlatform.ready( function () {
                result = $cordovaNetwork.getNetwork();
                console.log('network type= ' + result);
            });
            return result;
        };

        self.isOnline = function () {
            var result;
            $ionicPlatform.ready( function () {
                result = $cordovaNetwork.isOnline();
                console.log('isOnline= ' + result);
            });
            return result;
        };

        self.isOffline = function () {
            var result;
            $ionicPlatform.ready( function () {
                result = $cordovaNetwork.isOffline();
                console.log('isOffline= ' + result);
            });
            return result;
        };
        return self;
    }])
;
