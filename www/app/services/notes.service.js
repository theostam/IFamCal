angular.module('notes.service', ['constants'])

.factory('Notes', function( $http, Localstorage, SERVERHOST, SERVERPORT) {
        var self = this;

        self.list = [];

        // initial loading of notes
        var localNotes = Localstorage.get("notes");
        if (typeof localNotes != 'undefined'){
            self.list = JSON.parse( localNotes );
        }

        self.add = function( note ){
            self.list.push( note );
        };

        self.remove = function(){
            self.list = []
        } ;

        self.save = function (note) {
            var request = $http({
                method: "get",
                url: "http://"+SERVERHOST+":"+SERVERPORT+"/notes/saveorupdate/"+note.date+"/"+note.name+"/"+note.text
            });
            request.success(function (data, status, headers, config) {
            }).
                error(function (data, status, headers, config) {
                    console.log('error: ' + status);
                });

        } ;

        self.getNotesSince = function( date, username ){
            console.log('service: get notes since ' + date);
            var promise =  $http.get( "http://"+SERVERHOST+":"+SERVERPORT+"/notes?user="+username+"&date="+date).then(
                function(data){
                    processNewNotes( data.data.result ); // testing: vm.notes = data;
                    Localstorage.set("lastUpdateTimestamp", moment().format("YYYYMMDD HHmmss"));
                    Localstorage.set("notes", JSON.stringify( self.list ));
                    displayNotes();
                    console.log("data received: " + data.data.result );
//              return self.list;
                },
                function(data){
                    console.log( 'error' + data );
                }
            );
            return promise;
        };

        self.getLastModificationDate = function ( username ) {
            var req = {
                method: 'get',
                url: "http://"+SERVERHOST+":"+SERVERPORT+"/notes/lastmodificationdate?user="+username,
                headers: {
                    'Authorization': 'Basic aapnootmies'
                }
            };
            var config = {headers: {
                'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ=='
            }
            };
            var promise =  $http(req, config).then(
                function(data){
                    var dateAsString = data.data.result;
                    var lastMoficationDate = moment(dateAsString, "YYYYMMDD HHmmss");
                    console.log("date received: " + dateAsString);

                    return lastMoficationDate;
                },
                function(data){
                    console.log( 'error' + data );
                }
            );
            return promise;
        };

        function indexof( note ){
            for (var i = 0; i < self.list.length; i++) {
                if (self.list[i].date === note.date && self.list[i].name === note.name) {
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
                    self.list.push( data[i] );
                } else{
                    if (data[i].text == ''){
                        self.list.splice(index, 1);
                    } else{
                        self.list[index].text = data[i].text + '*';
                    }
                }
            }
        }

        function displayNotes(){
            console.log('content Notes:');
            for( var i=0; i < self.list.length; i++) {
                console.log( self.list[i] );
            }
            console.log('END content Notes:');
        }

        return self;
});
