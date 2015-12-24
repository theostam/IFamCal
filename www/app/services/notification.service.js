angular.module('notification.service', [])
    .factory('Notification', function( $ionicPopup, $timeout) {
//        .factory('Notification', ['$ionicPopup', '$scope', '$timeout', function($ionicPopup, $scope, $timeout) {
        var self = this;

        self.notify = function( message ) {

            $timeout(function(){
                var animation = 'fadeIn';
                var popupElements = document.getElementsByClassName("popup-container");
                if (popupElements.length) {
                    var popupElement = angular.element(popupElements[0]);
                    popupElement.addClass('animated');
//                    $scope.popupElement.addClass('popup-dur3');
                    popupElement.addClass(animation)
                };
            }, 1);

            var connPopup = $ionicPopup.show({
                title: "Connection status",
                content: message
            });

            $timeout(function() {
                var popupElements = document.getElementsByClassName("popup-container");
                if (popupElements.length) {
                    var popupElement = angular.element(popupElements[0]);
//                    $scope.popupElement.removeClass('fadeIn');
                    popupElement.addClass('fadeOut');
                }

                $timeout( function(){
                    connPopup.close(); //close the popup after 3 seconds for some reason
                }, 1000); // after some time of fading close the popup

            }, 3000); // show the popup this time
        }

        return self;
    })
;
