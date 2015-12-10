angular.module('Settings', [])


.controller('SettingsAccountController', function($rootScope, $scope, Localstorage) {
        var vm = this;
        vm.username = Localstorage.get("username");
        vm.password = Localstorage.get("password");
        vm.save = function() {
            Localstorage.set("username", vm.username);
            Localstorage.set("password", vm.password);
        };
    })

    .controller('SettingsNetworkController', function($rootScope, $scope, Localstorage) {
        var vm = this;
        var toggle = Localstorage.get("updateOnlyOnWifi");
        if (toggle != 'undefined' && toggle != null && toggle == "true"){
            vm.updateOnlyOnWifi = { checked: true };
        } else{
            vm.updateOnlyOnWifi = { checked: false };
        }
        vm.updateOnlyOnWifiChange = function(){
            Localstorage.set("updateOnlyOnWifi", JSON.stringify(vm.updateOnlyOnWifi.checked));
        }
    })

    .controller('SettingsReloadController', function($rootScope, $scope, Localstorage) {
        var vm = this;
        vm.reloadNotes = function(){
            var lastUpdateTimestamp = moment("1970-01-01") ;
            var notesReceived = Notes.getNotesSince( lastUpdateTimestamp.format("YYYYMMDD"), 'root' ).then(
                function(reloaddata){

                    var data = reloaddata.data.result;
                    if (data == undefined) return;
// vm.notes hier niet bekend ophalen
                    vm.notes = [];
                    for( var i=0; i < data.length; i++){
                            vm.notes.push( data[i] );
                    }

                    console.log("data received: " + reloaddata.data.result );
                },
                function(data){
                    console.log( 'error' + reloaddata );
                }
            );

            notesReceived.then( function(data){
                // save data in Local storage
                Localstorage.set("notes", JSON.stringify(vm.notes));
                // set last update timestamp
                Localstorage.set("lastUpdateTimestamp", lastMoficationDate.format("YYYYMMDD HHmmss"));
            } );
        }
    })

;
