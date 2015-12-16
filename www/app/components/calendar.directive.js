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
                getnotes: "&"         // delete ?  get data by nextMonth( today - 1 month)
            },
            link: function(scope, $state) {
                // watch the notes - async - retrieved from server
                scope.$watch('getnotes()', function(newVal) {
                    if(newVal) {
                        scope.notes = scope.getnotes()
                        scope.buildCalendar(scope.selectedType);
                    }
                }, true);
                // ==== functions ====

                scope.getSelectedPeriod = function(){
                    if (scope.selectedType == 'day'){
                        return scope.currentDate.format("dddd, MMMM Do YYYY")
                    } else if (scope.selectedType == 'week'){
                        return 'Week '+ scope.currentDate.format("w, YYYY")
                    } else if (scope.selectedType == 'month'){
                        return scope.currentDate.format("MMMM, YYYY")
                    }
                };

                scope.select = function(day) {
                    scope.selectedType = 'day';
                    scope.currentDate = day.date;
                    scope.buildCalendar(scope.selectedType);
//                    scope.getNotesOfDay( scope.currentDate );
                };

                scope.showToday = function(){
                    scope.selectedType = 'day';
                    scope.currentDate = moment();
                    scope.buildCalendar(scope.selectedType);
//                    scope.getNotesOfDay( scope.currentDate );
                };
                scope.showWeek = function(){
                    scope.selectedType = 'week';
                    scope.buildCalendar(scope.selectedType);
//                    scope.buildCalendar('week');
                };
                scope.showMonth= function(){
                    scope.selectedType = 'month';
                    scope.buildCalendar(scope.selectedType);
//                    scope.buildCalendar('month');
                };

                scope.next = function() {
                    if (scope.selectedType == 'day'){
                        scope.swipe(1, 'd');
//                        scope.swipeLeftDay();
                    } else if (scope.selectedType == 'week'){
                        scope.swipe(1, 'weeks');
//                        scope.swipeLeftWeek();
                    }
                    else if (scope.selectedType == 'month'){
                        scope.swipe(1, 'M');
//                        scope.swipeLeftMonth();
                    }
                };

                scope.previous = function() {
                    if (scope.selectedType == 'day'){
                        scope.swipe(-1, 'd');
//                        scope.swipeRightDay();
                    } else if (scope.selectedType == 'week'){
                        scope.swipe(-1, 'weeks');
//                        scope.swipeRightWeek();
                    }
                    else if (scope.selectedType == 'month'){
                        scope.swipe(-1, 'M');
//                        scope.swipeRightMonth();
                    }
                };
                scope.swipe = function(numberDaysWeeksMonths, dayWeekOrMonth){
                    // numberDaysWeeksMonths is -1 or +1, dayWeekOrMonth is 'd', 'weeks' or 'M'
                    scope.currentDate.add(numberDaysWeeksMonths, dayWeekOrMonth);
                    scope.buildCalendar(scope.selectedType);
                }
//                scope.swipeLeftDay = function () {
//                    scope.currentDate.add(1, 'd');
//                    scope.buildCalendar(scope.selectedType);
////                    scope.getNotesOfDay(scope.currentDate);
//                };
//
//                scope.swipeRightDay = function () {
//                    scope.currentDate.add(-1, 'd');
//                    scope.buildCalendar(scope.selectedType);
////                    scope.getNotesOfDay(scope.currentDate);
//                };
//
//                scope.swipeLeftWeek = function () {
//                    scope.currentDate.add(1, 'weeks');
//                    scope.buildCalendar(scope.selectedType);
//                    //buildWeekOrMonth(scope);
//                };
//
//                scope.swipeRightWeek = function () {
//                    scope.currentDate.add(-1, 'weeks');
//                    scope.buildCalendar(scope.selectedType);
////                    buildWeekOrMonth(scope);
//                };
//
//                scope.swipeLeftMonth = function () {
//                    scope.currentDate.add(1, 'M');
//                    scope.buildCalendar(scope.selectedType);
////                    buildWeekOrMonth(scope);
//                };
//
//                scope.swipeRightMonth = function () {
//                    scope.currentDate.add(-1, 'M');
//                    scope.buildCalendar(scope.selectedType);
////                    buildWeekOrMonth(scope);
//                };
                // ==== functions end ====

                function constructTextOfDay( date, noteButtonWidth ){
                    // TODO: make more efficient for a sorted notes array
                    var dateYYMMDD = date.format('YYYYMMDD'); // moment( date ).format('YYYYMMDD');
                    var text = date.date();
                    var notesOfThisDay = [];
                    var maxlines = Math.floor( noteButtonHeight / 20 );
                    var maxNrOfCharactersInCell = Math.floor(maxlines * noteButtonWidth / 10);
//                    console.log('maxNrOfCharactersInCell= '+maxNrOfCharactersInCell)
                    if (typeof scope.notes != 'undefined'){ // needed because view is often rendered before notes are ready
                        var nrOfNotes = scope.notes.length;
                        for (var i = 0; i < nrOfNotes; i++) {
                            if (dateYYMMDD == scope.notes[i].date) {
                                notesOfThisDay.push(scope.notes[i]);
                            }
                        }
                        var nrNotesOfThisDay = notesOfThisDay.length;
                        var nrOfCharactersPerPerson = maxNrOfCharactersInCell / nrNotesOfThisDay ;
                        if (nrNotesOfThisDay > 0){
                            for (var i = 0; i < nrNotesOfThisDay; i++) {
                                if (text != '') {
                                    text = text + '\n' + notesOfThisDay[i].name.substring(0, 1) + ':' + notesOfThisDay[i].text.substring(0, Math.min(notesOfThisDay[i].text.length, nrOfCharactersPerPerson));
                                } else {
                                    text = '\n' + notesOfThisDay[i].name.substring(0, 1) + ':' + notesOfThisDay[i].text.substring(0, Math.min(notesOfThisDay[i].text.length, nrOfCharactersPerPerson));
                                }
                            }
                        }

                    }
                    return text;
                };

                scope.saveNote = function (){
                    if ( typeof(scope.currentNote.changeDate) == "undefined") { // new note
                        scope.currentNote.changeDate = moment(); // only marker
                    }
                    Notes.save( scope.currentNote );
                    scope.getNotesOfDay(scope.currentDate);
                    scope.modal.hide();
                    console.log("save note");
                };

                scope.getNotesOfDay = function (date) {
                    scope.notesOfDay = [];
                    var dateYYYYMMDD = date.format('YYYYMMDD');
                    for (var i = 0; i < scope.notes.length; i++) {
                        if (scope.notes[i].date == dateYYYYMMDD) {
                            scope.notesOfDay.push( scope.notes[i] );
                        }
                    }
                };

                scope.getNoteOfUser = function (username) {
                    scope.getNotesOfDay(scope.currentDate);
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

                $ionicPlatform.registerBackButtonAction(function (event) {
                    if(scope.selectedType == 'day'){
//                        navigator.app.exitApp();
//                        event.preventDefault();
                        scope.showMonth();
                        scope.$apply();
                    }
                    else {
                        navigator.app.exitApp();
//                        $ionicHistory.goBack();
                    }
                }, 100);

                //var document = $document[0];
                //
                //function triggerBackButton() {
                //    var backButtonEvent = document.createEvent('Events');
                //    backButtonEvent.initEvent('backbutton', false, false);
                //    document.dispatchEvent(backButtonEvent);
                //}
                //
                //function registerBackButtonFake() {
                //    document.addEventListener('keyup', function (event) {
                //        // Alt+Ctrl+<
                //        if (event.altKey && event.ctrlKey && event.keyCode === 188) {
                //            triggerBackButton();
                //        }
                //    });
                //}



                scope.buildCalendar = function( selectedType ){
                    if (selectedType == "day") {
                        scope.getNotesOfDay(scope.currentDate);
                        return ;
                    }

                    scope.currentDate = removeTime(scope.currentDate || moment());
                    var start = scope.currentDate.clone();
                    if (selectedType == "month") {
                        start.startOf('month').startOf('week');
                        scope.buttonheight = { height: '100px' };
                        noteButtonHeight = 100;
                    } else{
                        start.startOf('week');
                        scope.buttonheight = { height: '400px' };
                        noteButtonHeight = 400;
                    }

                    buildMonth(scope, selectedType, start);

                }

                //function buildWeekOrMonth(){
                //    var next = scope.currentDate.clone();
                //    if (scope.selectedType == "month") {
                //        next.startOf('month').startOf('week');
                //    } else{
                //        next.startOf('week');
                //    }
                //
                //    buildMonth(scope, scope.selectedType, next );
                //}

                function getWidthOfNoteButton(){
                    var test = document.getElementById("notebutton");
                    if (test) noteButtonWidth = test.clientWidth ;
//                    console.log('button width = ' + width);
                }

                function removeTime(date) {
                    return date.hour(0).minute(0).second(0).millisecond(0);
                }

                // get week number of first week: start.week()
                // get week number of last week:  start.endof("month").week()
                function buildMonth(scope, selectedType, startdate ) {
                    scope.notes = scope.getnotes();
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
                            note: constructTextOfDay(date, noteButtonWidth),
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

                function setNoteButtonText(noteButtonWidth){
                    scope.weeks.forEach( function (week)
                    {
                        week.days.forEach( function ( day ){
                            day.note = constructTextOfDay( day.date, noteButtonWidth );
                        })
                    });
                }

                scope.init = function(){
                    if (!scope.initDone){
                        scope.initDone = true;
                        scope.notes = scope.getnotes();
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
                        angular.element(document).ready(function () {
                            getWidthOfNoteButton();
                            setNoteButtonText( noteButtonWidth );
                        });
                        //window.addEventListener("resize", +hfunction() {
                        //    orientation = 'portrait';
                        //    if (window.outerWidth > window.outerHeight) orientation = 'landscape'
                        //}, false);

                    }
                    //if (!$window.cordova) {
                    //    $ionicPlatform.ready(registerBackButtonFake);
                    //}
                };
// ==== functions end ====

// ==== body calendar directive ====
                var dataChanged = true; // initial setting, so data will be loaded
                var noteButtonWidth = 60; // 6 characters
                var noteButtonHeight ;
                scope.init();
//                nix();
            }
        };

    });
