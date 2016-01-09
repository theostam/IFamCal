angular.module('notification.service', [])
    .factory('Notification', function( $ionicPopup, $timeout) {
//        .factory('Notification', ['$ionicPopup', '$scope', '$timeout', function($ionicPopup, $scope, $timeout) {
        var nrActiveNotifications = 0;
        var activeMessage = '';

        var service = {
            notify: notify
        }

        return service;

        function notify( message ) {
            nrActiveNotifications++;
            if (nrActiveNotifications == 1) {
                activeMessage = message
            } else{
                activeMessage += '<br>' + message
            }
            $timeout(function(){
                var animation = 'fadeIn';
                var popupElements = document.getElementsByClassName("popup-container");
                if (popupElements.length) {
                    var popupElement = angular.element(popupElements[0]);
                    popupElement.addClass('animated');
                    popupElement.addClass(animation);
                    console.log('start fadeOut');
//                    this.fadeOut();
                }
            }, 1);
            var connPopup = $ionicPopup.show({
//                title: "Connection status",
                content: activeMessage
            });


            $timeout(function() {
                var popupElements = document.getElementsByClassName("popup-container");
                if (popupElements.length) {
                    var popupElement = angular.element(popupElements[0]);
                    popupElement.removeClass('fadeIn');
                    popupElement.addClass('fadeOut');
                    console.log('fadeout class set');
                    //document.getElementsByClassName("popup").addEventListener("webkitAnimationEnd",function( event ) { popupElements.style.display = "none"; }, false);

                }

                $timeout( function(){
                    console.log('close');
                    nrActiveNotifications--;
                    connPopup.close(); //close the popup after 3 seconds for some reason
                }, 1000); // after some time of fading close the popup

            }, 3000); // show the popup this time
        };
    })
;
