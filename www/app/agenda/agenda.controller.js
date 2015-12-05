angular.module('Agenda', [])

.controller('AgendaController', function(Notes, Localstorage, Network, $ionicPopup, $scope, $timeout) {
        var vm = this;

        $scope.$on('notes_updated', function() {
            console.log('change detect');
            vm.notes = JSON.parse( Localstorage.get("notes") );
        });

        // check update on network allowed
        var updateOnlyOnWifi = Localstorage.get("updateOnlyOnWifi");
//        updateOnlyOnWifi = false; // testing

        // if update on network not allowed, check wifi
        var connectionType = checkConnection();  // NONE, WIFI or CELL
        showConnectionStatus( connectionType );

        // if update on network allowed -and connected-, or on wifi,
        //      get last modification date from server
        //      get last update timestamp
        if (connectionType == 'WIFI' || (connectionType == 'CELL' && !updateOnlyOnWifi) ){
            var lastUpdateTimestampString = Localstorage.get("lastUpdateTimestamp");
            var lastUpdateTimestamp = moment("1970-01-01") ;
            if (lastUpdateTimestampString){
                var temp = moment(lastUpdateTimestampString, "YYYYMMDD HHmmss") ;
                if (temp.isValid()) lastUpdateTimestamp = temp;
            }
//            var lastMoficationDate = moment("1970-01-01"); // testing
            //  get last modification date from server
            //  Notes.getNotesByMonth(date).then(
          var dateReceived = Notes.getLastModificationDate( Localstorage.get("username") ).then(
              function(data){
                var dateAsString = data.data.result;
                  lastMoficationDate = moment(dateAsString, "YYYYMMDD HHmmss");
                console.log("data received: " + dateAsString);
              },
              function(data){
                console.log( 'error' + data );
              }
          );
        }
        // initial loading of notes
        var localNotes = Localstorage.get("notes");
        if (typeof localNotes != 'undefined'){
            vm.notes = JSON.parse( localNotes );
        } else{
            vm.notes = [];
        }


        // if lastModification date > lastUpdate date then get data from server
        dateReceived.then( function(data) {
            if (moment(lastMoficationDate).isAfter(lastUpdateTimestamp)) {
                // get data
//                lastUpdateTimestamp = moment("2015-05-01", "YYYY-MM-DD");  // testing remove
                var notesReceived = Notes.getNotesSince( lastUpdateTimestamp.format("YYYYMMDD"), Localstorage.get("username") ).then(
                    function(data){
                        processNewNotes( data.data.result ); // testing: vm.notes = data;
                        displayNotes();
                        console.log("data received: " + data.data.result );
                    },
                    function(data){
                        console.log( 'error' + data );
                    }
                );

                notesReceived.then( function(data){
                    // save data in Local storage
                    Localstorage.set("notes", JSON.stringify(vm.notes));
                    // set last update timestamp
                    Localstorage.set("lastUpdateTimestamp", lastMoficationDate.format("YYYYMMDD HHmmss"));
                } );
            }
        } );

        function checkConnection () {
            //if (window.Connection) {
            //    if (navigator.connection.type == Connection.NONE) {
            //        return 'NONE'
            //    } else if (navigator.connection.type == Connection.WIFI) {
            //        return 'WIFI';
            //    } else if (navigator.connection.type == Connection.CELL_2G || navigator.connection.type == Connection.CELL_3G || navigator.connection.type == Connection.CELL_4G ) {
            //        return 'CELL';
            //    }
            //}
            if (window.Connection) {
                if (Network.type == Connection.NONE) {
                    return 'NONE'
                } else if (Network.type == Connection.WIFI) {
                    return 'WIFI';
                } else if (Network.type == Connection.CELL_2G || Network.type == Connection.CELL_3G || Network.type == Connection.CELL_4G ) {
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
            var connPopup = $ionicPopup.show({
                title: "Connection status",
                content: message + ' type=' + connectionType
            });
            $timeout(function() {
                connPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        }

        function indexof(note){
            for (var i = 0; i < vm.notes.length; i++) {
                if (vm.notes[i].date === note.date && vm.notes[i].name === note.name) {
                    return i;
                }
            }
            return -1;
        }

        function processNewNotes( data ){
            // construct button text in calendar directive loops over all notes; NOT efficient
            // so adding new notes -without sorting- is enough. For Now. TODO: make more efficient.
            // if existing note with same date and user, then overwite text.
            // if text is empty then delete note
            if (data == undefined) return;

            var len = data.length;
            for( var i=0; i < data.length; i++){
                var index = indexof( data[i] );
                if (index < 0){
                    vm.notes.push( data[i] );
                } else{
                    if (data[i].text == ''){
                        vm.notes.splice(index, 1);
                    } else{
                        vm.notes[index].text = data[i].text + '*';
                    }
                }
            }
        }
        function displayNotes(){
            console.log('content Notes:');
            for( var i=0; i < vm.notes.length; i++) {
                console.log( vm.notes[i] );
            }
            console.log('END content Notes:');
        }
    })

;
