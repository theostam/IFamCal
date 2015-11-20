angular.module('starter.services', [])
//.factory('Localstorage', ['$window', function($window) {
//      return {
//        set: function(key, value) {
//          $window.localStorage[key] = value;
//        },
//        get: function(key, defaultValue) {
//          return $window.localStorage[key] || defaultValue;
//        },
//        setObject: function(key, value) {
//          $window.localStorage[key] = JSON.stringify(value);
//        },
//        getObject: function(key) {
//          return JSON.parse($window.localStorage[key] || '{}');
//        }
//      }
//    }])
.factory('Notes', function($timeout, $q) {
      var factory = {};

    var notesArray = [{
        changeDate: '20150130',
        date: '20150531',
        name: 'Astrid',
        text: 'Vanavond werken'
      }, {
      changeDate: '20150230',
      date: '20150531',
        name: 'Maaike',
        text: 'Trainen'
      }, {
      changeDate: '20150330',
        date: '20150601',
        name: 'Inge',
        text: 'Ben weg'
      }, {
      changeDate: '20150430',
      date: '20150601',
      name: 'Maaike',
      text: 'Werken'
    }, {
      changeDate: '20150530',
      date: '20150601',
      name: 'Theo',
      text: 'Thuis'
    }, {
      changeDate: '20150501',
      date: '20150608',
      name: 'Maaike',
      text: 'Werken2'
    }, {
      changeDate: '20150502',
      date: '20150608',
      name: 'Theo',
      text: ''
    }, {
      changeDate: '20150503',
      date: '20150617',
      name: 'Maaike',
      text: 'Werken en zo'
    }, {
      changeDate: '20150504',
      date: '20150617',
      name: 'Theo',
      text: 'Tv kijken2222'
    }];

      function indexof(note){
        for (var i = 0; i < notesArray.length; i++) {
          if (notesArray[i].date === note.date && notesArray[i].name === note.name) {
            return i;
          }
        }
        return -1;
      }

      function buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
          scope.weeks.push({ days: buildWeek(date.clone(), month) });
          date.add(1, "w");
          done = count++ > 2 && monthIndex !== date.month();
          monthIndex = date.month();
        }
      }

      function buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
          days.push({
            name: date.format("dd").substring(0, 1),
            number: date.date(),
            isCurrentMonth: date.month() === month.month(),
            isToday: date.isSame(new Date(), "day"),
            date: date
          });
          date = date.clone();
          date.add(1, "d");
        }
        return days;
      }
      function removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
      }

      function getModifiedNotesSince( date ){
        var result = [];
        for (var i = 0; i < notesArray.length; i++) {
          //if (moment(lastMoficationDate).isAfter(lastUpdateTimestamp)) {
          if (moment(notesArray[i].changeDate, 'YYYYMMDD').isAfter(date)) {
            result.push( notesArray[i]);
          }
        }
        result = cloneNotesWithoutChangeDate( result );
//        result = JSON.stringify( result );
        return result;
      }

      function cloneNotesWithoutChangeDate(notes) {
        if (notes == null) return null;

        var clone = [];
        for(var i=0 ; i < notes.length; i++) {
          clone[i] = {};
          clone[i].date = notes[i].date;
          clone[i].name = notes[i].name;
          clone[i].text = notes[i].text;
        }
        return clone;
      };

      factory.getAllForTesting = function(){
        return cloneNotesWithoutChangeDate( notesArray );
      };

      function cloneNotesWithoutChangeDateOLD(obj) {
        if (obj == null) return null;

        var clone = [];
        for(var i in obj) {
          if(typeof(obj[i])=="object" && obj[i] != null)
            clone[i] = cloneNotesWithoutChangeDate(obj[i]);
          else
          if( i != "changeDate"){
            clone[i] = obj[i];
          }
        }
        return clone;
      };

      factory.getAllForTesting = function(){
        return cloneNotesWithoutChangeDate( notesArray );
      };

      factory.all = function () {
          var deferred = $q.defer();
          $timeout( function(){
            deferred.notify('all notes.');
            var allNotes = cloneNotesWithoutChangeDate( notesArray );
            deferred.resolve( allNotes );
          }, 500 + Math.floor(Math.random()*100) );

          return deferred.promise;
        };

        factory.save = function (note) {
          var i = indexof(note);
          if (i > 0){
            notesArray[i].text = note.text;
            notesArray[i].changeDate = moment().format("YYYYMMDD");
          } else{
            note.changeDate = moment().format("YYYYMMDD");
            notesArray.push( note );
          }
        };

        factory.remove = function (note) {
          notesArray.splice(notesArray.indexOf(note), 1);
        };

      factory.getNotesSince = function( date ){
        var deferred = $q.defer();
        $timeout( function(){
          deferred.notify('get notes since.');

          deferred.resolve( getModifiedNotesSince( date ));
        }, 100 + Math.floor(Math.random()*100) );

        return deferred.promise;
      } ;

      factory.getLastModificationDate = function () {
        var deferred = $q.defer();
        $timeout( function(){
          deferred.notify('last modi date.');
          deferred.resolve(  moment().format('YYYYMMDD HHmmss') );  // testing
        }, 100 + Math.floor(Math.random()*100) );

        return deferred.promise;
      };

      factory.getNotesByDay = function (date, successHandler, errorHandler) {
        var deferred = $q.defer();
        var notesByDay = [];
        var dateYYYYMMDD = date.format('YYYYMMDD');
        for (var i = 0; i < notesArray.length; i++) {
          if (notesArray[i].date == dateYYYYMMDD) {
            notesByDay.push( notesArray[i] );
          }
        }
        $timeout( function(){
          deferred.notify('get notes by day.');
          deferred.resolve( notesByDay );
        }, 500 + Math.floor(Math.random()*100) );

        return deferred.promise;
      };

        factory.getNotesByMonth = function (date) {
          var deferred = $q.defer();
          var notesByMonth = new Map();

          for (var i = 0; i < notesArray.length; i++) {
            var index = moment(notesArray[i].date, 'YYYYMMDD').dayOfYear();
            var text = notesByMonth.get( index );
            if (typeof text !== 'undefined') {
              text = text +  '\n' + notesArray[i].name + ':' + notesArray[i].text;
            } else{
              text = '\n' + notesArray[i].name + ':' + notesArray[i].text;
            }
            notesByMonth.set( index, text );
          }
          console.log(' random timeout:' + (500 + Math.floor(Math.random()*1000)) );

          $timeout( function(){
            deferred.notify('get notes by month.');
            deferred.resolve( notesByMonth );
          }, 500 + Math.floor(Math.random()*1000) );

          return deferred.promise;
        };

      return factory;
    })
//function asyncGreet(name) {
//  var deferred = $q.defer();
//
//  setTimeout(function() {
//    deferred.notify('About to greet ' + name + '.');
//
//    if (okToGreet(name)) {
//      deferred.resolve('Hello, ' + name + '!');
//    } else {
//      deferred.reject('Greeting ' + name + ' is not allowed.');
//    }
//  }, 1000);
//
//  return deferred.promise;
//}
//
//var promise = asyncGreet('Robin Hood');
//promise.then(function(greeting) {
//  alert('Success: ' + greeting);
//}, function(reason) {
//  alert('Failed: ' + reason);
//}, function(update) {
//  alert('Got notification: ' + update);
//});
    .factory('EventService', ['$rootScope',
      function($rootScope) {
        var service = {state: {data: null}};

        service.setData = function(data) {
          service.state.data = data;
          $rootScope.$broadcast('data_changed');
        };

        return service;
      }])

    .factory('StateService', ['$rootScope',
      function($rootScope) {
        var service = {state: {data: null}};

        service.setData = function(data) {
          service.state.data = data;
        };

        return service;
      }])

    .factory('SelectedItem', ['$rootScope',
      function($rootScope) {
        var service = {date: null};

        service.setData = function(data) {
          service.date = data;
        };

        return service;
      }])
;
// EXample usage
//scope.getNotesByMonth = function( date ){
//  Notes.getNotesByMonth(date).then(
//      function(data){
//        scope.notes = data;
//        console.log("data received");
//      },
//      function(data){
//        console.log( 'error' + data );
//      },
//      function(update) {
//        console.log('Got notification: ' + update);
//      }
//  );
//};

//scope.getNotesByDay = function( date ){
//  Notes.getNotesByDay( date).then( //searchDate,
//      function(data){
//        scope.notesOfDay = data;
//      },
//      function(data){
//        console.log( 'error' + data );
//      },
//      function(update) {
//        console.log('Got notification: ' + update);
//      }
//  );
//};



