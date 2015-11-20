angular.module('notes.service', ['constants'])

.factory('Notes', function( $http, SERVERHOST, SERVERPORT) {
    var notesByDay = [];

    var notesArray = [{
        date: '20150531',
        name: 'Astrid',
        text: 'Vanavond werken'
      }, {
        date: '20150531',
        name: 'Maaike',
        text: 'Trainen'
      }, {
        date: '20150601',
        name: 'Inge',
        text: 'Ben weg'
      }, {
        date: '20150601',
        name: 'Maaike',
        text: 'Werken'
      }, {
        date: '20150601',
        name: 'Theo',
        text: 'Thuis'
      }];

      function indexof(note){
        for (var i = 0; i < notesArray.length; i++) {
          if (notesArray[i].date === note.date && notesArray[i].name === note.name) {
            return i;
          }
        }
        return -1;
      };

      return {
        all: function () {
          return notesArray;
        },
        save: function (note) {
          var i = indexof(note);
          if (i > 0){
            notesArray[i].text = note.text;
          } else{
            notesArray.push( note );
          };
          // send note to server THE POST ALWAYS END IN ERROR !!!
          var request = $http({
            method: "jsonp",
            url: "http://"+SERVERHOST+":"+SERVERPORT+"/notes/saveorupdate/"+note.date+"/"+note.name+"/"+note.text+"/callback=JSON_CALLBACK",
          });
            request.success(function (data, status, headers, config) {
//            alert( 'success: ' + data);
          }).
              error(function (data, status, headers, config) {
                alert('error: ' + status);
              });

        },
        remove: function (note) {
          notesArray.splice(notesArray.indexOf(note), 1);
        },
        getNotesByDay: function (date, successHandler, errorHandler) {
          var promise =  $http.jsonp( "http://server2-famcal.rhcloud.com/GetNotesByDay?user=Theo&callback=JSON_CALLBACK&date="+date);
//          var promise =  $http.jsonp( "http://localhost:1337/GetNotesByDay?callback=JSON_CALLBACK&date="+date);
            if(successHandler)
              promise.success(successHandler);
            if(errorHandler)
              promise.error(errorHandler);
        },

        getNotesSince: function( date ){
          console.log('service: get notes since ' + date);
//            var promise =  $http.jsonp( "http://server2-famcal.rhcloud.com/notes/since?user=Theo&callback=JSON_CALLBACK&date="+date);
          var promise =  $http.jsonp( "http://"+SERVERHOST+":"+SERVERPORT+"/notes/since/Theo/JSON_CALLBACK/"+date);
//          var promise =  $http.jsonp( "http://SERVERHOST:SERVERPORT/notes/since?user=Theo&callback=JSON_CALLBACK&date="+date);
          return promise;
        //var deferred = $q.defer();
        //$timeout( function(){
        //  deferred.notify('get notes since.');
        //
        //  deferred.resolve( getModifiedNotesSince( date ));
        //}, 100 + Math.floor(Math.random()*100) );
        //
        //return deferred.promise;
      },

      getLastModificationDate: function () {
        var promise =  $http.jsonp( "http://"+SERVERHOST+":"+SERVERPORT+"/notes/lastmodificationdate/Theo/JSON_CALLBACK");

//        var promise =  $http.jsonp( "http://localhost:8080/notes/lastmodificationdate?user=Theo&callback=JSON_CALLBACK");

//        var promise =  $http.get( "http://localhost:8080/notes/lastmodificationdate");
        return promise;
        //var deferred = $q.defer();
        //$timeout( function(){
        //  deferred.notify('last modi date.');
        //  deferred.resolve(  moment().format('YYYYMMDD HHmmss') );  // testing
        //}, 100 + Math.floor(Math.random()*100) );
        //
        //return deferred.promise;
      }

    };
});
