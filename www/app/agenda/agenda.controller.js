angular.module('Agenda', [])

    .controller('AgendaController', function(notes, Network, $ionicPopup, $scope, $timeout) {
//        .controller('AgendaController', function(nuts, Notes, Localstorage, Network, $ionicPopup, $scope, $timeout) {
        var vm = this;

        var connectionType = checkConnection();  // NONE, WIFI or CELL
                showConnectionStatus( connectionType );
        vm.notes = notes ;

//        vm.notes = Notes.list;
        vm.getnotes = function(){
            return vm.notes // Notes.list
        };
//        // the rest of thuis controller is getting - async - the notes from the server
//        // the $watch on notes in the directive will pick it up
//
//        // check update on network allowed
////        var updateOnlyOnWifi = Localstorage.get("updateOnlyOnWifi");
//        updateOnlyOnWifi = false; // testing
//
//        // if update on network not allowed, check wifi
//        var connectionType = checkConnection();  // NONE, WIFI or CELL
//        //        showConnectionStatus( connectionType );
//
//        // if update on network allowed -and connected-, or on wifi,
//        //      get last modification date from server
//        //      get last update timestamp
//        if (connectionType == 'WIFI' || (connectionType == 'CELL' && !updateOnlyOnWifi) ){
//            var lastUpdateTimestamp = getLastUpdateTimestamp() ;
//
//            var lastMoficationDate = moment("1970-01-01"); // testing
//            //  get last modification date from server
//            var dateReceived = Notes.getLastModificationDate( Localstorage.get("username") );
//        }
//
//
//
//        // if lastModification date > lastUpdate date then get data from server
//        dateReceived.then( function(data) {
//            lastMoficationDate = data;
//            if (moment(lastMoficationDate).isAfter(lastUpdateTimestamp)) {
//                // get data
//                var notesReceived = Notes.getNotesSince( lastUpdateTimestamp.format("YYYYMMDD"), Localstorage.get("username") );
//                notesReceived.then( function(){
//                    vm.notes = Notes.list;
//                } );
//            }
//        } );
//
//        function getLastUpdateTimestamp(){
//            var tempString = Localstorage.get("lastUpdateTimestamp");
//            var lastUpdateTimestamp = moment("1970-01-01") ;
//            if (tempString){
//                var tempDate = moment(tempString, "YYYYMMDD HHmmss") ;
//                if (tempDate.isValid()) lastUpdateTimestamp = tempDate;
//            }
//            return lastUpdateTimestamp;
//        }

        function checkConnection () {
            if (window.Connection) {
                if (Network.type() == Connection.NONE) {
                    return 'NONE'
                } else if (Network.type() == Connection.WIFI) {
                    return 'WIFI';
                } else if (Network.type() == Connection.CELL_2G || Network.type() == Connection.CELL_3G || Network.type() == Connection.CELL_4G ) {
                    return 'CELL';
                }
            }
            return 'WIFI'; // testing
//            return null;
        };

        function showConnectionStatus( connectionType ) {
            var message = '';
            if (connectionType == null || connectionType == 'NONE'){
                message = 'No Network connection';
            }
            else if (connectionType == 'WIFI'){
                message = 'Connected on WIFI';
            } else if (connectionType == 'CELL'){
                message = 'Connected on Network';
            }

            $timeout(function(){
                var animation = 'fadeIn';
                var popupElements = document.getElementsByClassName("popup-container");
                if (popupElements.length) {
                    $scope.popupElement = angular.element(popupElements[0]);
                    $scope.popupElement.addClass('animated');
                    $scope.popupElement.addClass('popup-dur3');
//                    $scope.popupElement.addClass('hinge');

                    $scope.popupElement.addClass(animation)
                };
            }, 1);

            var connPopup = $ionicPopup.show({
                title: "Connection status",
                content: message + ' type=' + connectionType
            });

            $timeout(function() {
                var popupElements = document.getElementsByClassName("popup-container");
                if (popupElements.length) {
                    $scope.popupElement = angular.element(popupElements[0]);
                    $scope.popupElement.removeClass('fadeIn');
                    $scope.popupElement.addClass('fadeOut');
                }
                connPopup.close(); //close the popup after 3 seconds for some reason
            }, 5000);
        }

    })

;
