angular.module('Calendar', [])
    /* The calendar
parameters:
    notes: all calendar notes passed as input. Will be changed by adding notes.
     save: the method that will save an changed or added note.
            That method will send it to the server. (But Not put in localstorage)
    selectedType: day, week or month    // TODO create constants
     */
.directive("calendar", function($rootScope, $ionicModal, $ionicPlatform, Notes, Localstorage) {
        return {
            restrict: "E",
            templateUrl: "app/components/calendar.directive.html", //"templates/calendar.html",
            scope: {
                notes: "="         // delete ?  get data by nextMonth( today - 1 month)
            },
            link: function(scope, $state) {

                // ==== functions ====
                scope.getNotesOfDay = function (date) {
                    scope.notesOfDay = [];
                    var dateYYYYMMDD = date.format('YYYYMMDD');
                    for (var i = 0; i < scope.notes.length; i++) {
                        if (scope.notes[i].date == dateYYYYMMDD) {
                            scope.notesOfDay.push( scope.notes[i] );
                        }
                    }
                };

                scope.select = function(day) {
                    scope.selectedType = 'day';
                    scope.currentDate = day.date;
                    scope.selectedPeriod = scope.currentDate.format("dddd, MMMM Do YYYY");
                    scope.getNotesOfDay( scope.currentDate );
                };

                scope.showToday = function(){
                    scope.selectedType = 'day';
                    scope.currentDate = moment();
                    scope.selectedPeriod = scope.currentDate.format("dddd, MMMM Do YYYY");
                    scope.getNotesOfDay( scope.currentDate );
                };
                scope.showWeek = function(){
                    scope.selectedType = 'week';
                    scope.selectedPeriod = 'Week '+ scope.currentDate.format("w, YYYY") ;
                    scope.buildCalendar('week');
                };
                scope.showMonth= function(){
                    scope.selectedType = 'month';
                    scope.selectedPeriod = scope.currentDate.format("MMMM, YYYY");
                    scope.buildCalendar('month');
                };

                scope.buttonText = function(day) {
                    var text = day.number ;
                    // notes may not yet be available cuase of http request
                    text = text + scope.constructTextOfDay( day.date );
                    //if (scope.notes){
                    //    var notesText = scope.notes.get( day.date.dayOfYear() );
                    //    if (typeof notesText !== 'undefined') {
                    //        text = text + notesText;
                    //    }
                    //}
                    return text;
                };

                scope.next = function() {
                    if (scope.selectedType == 'day'){
                        scope.swipeLeftDay();
                    } else if (scope.selectedType == 'week'){
                        scope.swipeLeftWeek();
                    }
                    else if (scope.selectedType == 'month'){
                        scope.swipeLeftMonth();
                    }
                };

                scope.previous = function() {
                    if (scope.selectedType == 'day'){
                        scope.swipeRightDay();
                    } else if (scope.selectedType == 'week'){
                        scope.swipeRightWeek();
                    }
                    else if (scope.selectedType == 'month'){
                        scope.swipeRightMonth();
                    }
                };
                // ==== functions end ====

                //scope.$on('data_changed', function() {
                //    console.log('change detect');
                //    // After edit-note (only way to change data), reload the 'changed-day'
                //    scope.getNotesByDay( scope.currentDate );
                //    dataChanged = true;
                //});

                scope.constructTextOfDay = function( date ){
                    // TODO: make more efficient for a sorted notes array
                    var dateYYMMDD = date.format('YYYYMMDD'); // moment( date ).format('YYYYMMDD');
                    var text = '';
                    if (typeof scope.notes != 'undefined'){ // needed because view is often rendered before notes are ready
                        var nrOfNotes = scope.notes.length;
                        for (var i = 0; i < nrOfNotes; i++) {
                            if (dateYYMMDD == scope.notes[i].date){
                                if (text != '') {
                                    text = text + '\n' + scope.notes[i].name + '\n' + scope.notes[i].text;
                                } else {
                                    text = '\n' + scope.notes[i].name + '\n' + scope.notes[i].text;
                                }
                            }
                        }
                    }
                    return text;
                };

                scope.saveNote = function (){
                    if ( typeof(scope.currentNote.changeDate) == "undefined") { // new note
                        scope.currentNote.changeDate = moment(); // only marker
                        scope.notes.push( scope.currentNote );
                        // save data in Local storage
                        Localstorage.set("notes", JSON.stringify(scope.notes));
                    }
                    Notes.save( scope.currentNote );
                    scope.getNotesOfDay(scope.currentDate);
                    scope.modal.hide();
                    console.log("save note");
//                    $rootScope.$broadcast('data_changed');
                };

                scope.swipeLeftDay = function () {
                    scope.currentDate.add(1, 'd');
                    scope.getNotesOfDay(scope.currentDate);
                    scope.selectedPeriod = scope.currentDate.format("dddd, MMMM Do YYYY");
                };

                scope.swipeRightDay = function () {
                    scope.currentDate.add(-1, 'd');
                    scope.getNotesOfDay(scope.currentDate);
                    scope.selectedPeriod = scope.currentDate.format("dddd, MMMM Do YYYY");
                };

                scope.swipeLeftWeek = function () {
                    scope.currentDate.add(1, 'weeks');
                    buildWeekOrMonth(scope);
                    scope.selectedPeriod = 'Week '+ scope.currentDate.format("w, YYYY") ;
                };

                scope.swipeRightWeek = function () {
                    scope.currentDate.add(-1, 'weeks');
                    buildWeekOrMonth(scope);
                    scope.selectedPeriod = 'Week '+ scope.currentDate.format("w, YYYY") ;
                };

                scope.swipeLeftMonth = function () {
                    scope.currentDate.add(1, 'M');
                    buildWeekOrMonth(scope);
                    scope.selectedPeriod = scope.currentDate.format("MMMM, YYYY");
                };

                scope.swipeRightMonth = function () {
                    scope.currentDate.add(-1, 'M');
                    buildWeekOrMonth(scope);
                    scope.selectedPeriod = scope.currentDate.format("MMMM, YYYY");
                };
                scope.getNoteOfUser = function (username) {
                    for (var i = 0; i < scope.notesOfDay.length; i++) {
                        if (scope.notesOfDay[i].name === username) {
                            return( scope.notesOfDay[i] );
                        }
                    }
                    return null;
                };

// === modal functions ====
                function cloneObject(obj) {
                    if (obj == null) return null;

                    var clone = {};
                    for(var i in obj) {
                        if(typeof(obj[i])=="object" && obj[i] != null)
                            clone[i] = cloneObject(obj[i]);
                        else
                            clone[i] = obj[i];
                    }
                    return clone;
                };
                function cloneNote(note) {
                    if (note == null) return null;

                    var clone = {};
                    clone.changeDate = note.changeDate;
                    clone.date = note.date;
                    clone.name = note.name;
                    clone.text = note.text;
                    return clone;
                };

                scope.openModal = function(note) {
                    //var backbuttonHandler = $ionicPlatform.registerBackButtonAction(function(event) {
                    //    }, 100);
                    var username = Localstorage.get("username");
                    if (username == 'undefined' || username == '') return ;

                    if (note == null){    // pressed '+', but maybe there is a note of this user present
                        scope.currentNote = scope.getNoteOfUser(username) ;
                    } else{               // pressed on the note itself
                        scope.currentNote = note;
                    }
                    if (scope.currentNote == null){
                        scope.currentNote = {
                            date: scope.currentDate.format('YYYYMMDD'),
                            name: username,
                            text: ''
                        };
                    }
                    scope.isAutorized = (username ===  scope.currentNote.name);
                    scope.modal.show();
                };
                scope.closeModal = function() {
//                    $scope.$on('$destroy', backbuttonHandler);
                    scope.modal.hide();
                };
                //Cleanup the modal when we're done with it!
                scope.$on('$destroy', function() {
                    scope.modal.remove();
                });
                // Execute action on hide modal
                scope.$on('modal.hidden', function() {
                    // Execute action
                });
                // Execute action on remove modal
                scope.$on('modal.removed', function() {
                    // Execute action
                });

                scope.init = function(){
                    if (!scope.initDone){
                        scope.initDone = true;
                        scope.currentDate = moment();
                        scope.selectedType= 'month';  // default
                        scope.selectedPeriod = scope.currentDate.format("MMMM, YYYY");
                        scope.buildCalendar(scope.selectedType);

                        $ionicModal.fromTemplateUrl('app/components/calendar.edit-note.html', {
                            scope: scope,
                            animation: 'slide-in-up'
                        }).then(function(modal) {
                            scope.modal = modal;
                        });
                    }
                };

                scope.buildCalendar = function( selectedType ){
                    scope.currentDate = removeTime(scope.currentDate || moment());
                    var start = scope.currentDate.clone();
                    if (selectedType == "month") {
                        start.startOf('month').startOf('week');
                        scope.buttonheight = { height: '100px' };
                    } else{
                        start.startOf('week');
                        scope.buttonheight = { height: '400px' };
                    }

                    buildMonth(scope, selectedType, start);

                }

                function buildWeekOrMonth(){
                    var next = scope.currentDate.clone();
                    if (scope.selectedType == "month") {
                        next.startOf('month').startOf('week');
                    } else{
                        next.startOf('week');
                    }

                    buildMonth(scope, scope.selectedType, next );
                }

// ==== functions end ====

// ==== body calendar directive ====
                var dataChanged = true; // initial setting, so data will be loaded
                scope.init();
            }
        };

        function removeTime(date) {
            return date.hour(0).minute(0).second(0).millisecond(0);
        }

        // get week number of first week: start.week()
        // get week number of last week:  start.endof("month").week()
        function buildMonth(scope, selectedType, startdate ) {
            scope.weeks = [];
            var currentMonth = scope.currentDate.clone().month();
            var date = startdate.clone();
            var startweek = startdate.week();
            var endweek = startweek;
            if (selectedType == "month") {
//                endweek = scope.currentDate.clone().endOf("month").week();
                endweek = startweek + 5;
            }

            for( var i=startweek; i <= endweek; i++){
                scope.weeks.push({ days: buildWeek( date, currentMonth)} ) ;
                date.add(1, "w");
            }
        }

        function buildWeek(startdate, currentMonth) {
            var days = [];
            var date = startdate.clone();
            for (var i = 0; i < 7; i++) {
                days.push({
                    name: date.format("dd").substring(0, 1),
                    number: date.date(),
                    isCurrentMonth: date.month() === currentMonth,
                    isToday: date.isSame(new Date(), "day"),
                    date: date
                });
                date = date.clone();
                date.add(1, "d");
            }
            return days;
        }
    })
