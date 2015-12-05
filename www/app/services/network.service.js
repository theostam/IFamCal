/**
 * Created by theos on 4-12-2015.
 */
angular.module('network.service', [])
    .factory('Network', ['$ionicPlatform', '$rootScope', '$cordovaNetwork', function($ionicPlatform, $rootScope, $cordovaNetwork) {

        var type;

        $ionicPlatform.ready( function () {

            type = $cordovaNetwork.getNetwork()
            console.log('net work type= ' + type);
            var isOnline = $cordovaNetwork.isOnline()

            var isOffline = $cordovaNetwork.isOffline()

            // listen for Online event
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                var onlineState = networkState;
            })

            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                var offlineState = networkState;
            })

        }, false);

        return{
            type: function () {
                return type;
            }
        }
    }])
;
