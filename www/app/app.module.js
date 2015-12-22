// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services NOT USED.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
        [   'ionic',
            'constants',
            'MainView',
            'Settings',
            'Agenda',
            'notes.service',
            'localstorage.service',
            'network.service',
            'auth.service',
            'Calendar',
            'Login',
            'ngCordova'
        ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
      .state('login', {
          url: "/login",
          views: {
              'menu' : {
                  templateUrl: "app/login/login.html",
                  controller: 'LoginController'
              }
          },
          //templateUrl: "app/login/login.html",
          //controller: 'LoginController'
      })
      .state('app', {
        url: "/app",
        abstract: true,
        views: {
          'menu' : {
            templateUrl: "app/layout/mainView.html",
            controller: "MainViewController"
          }
        },
        onEnter: function($state, Auth){
              if(!Auth.isLoggedIn()){
                  $state.go('login');
              }
        }
      })
      .state('app.calendar', {
        url: "/calendar",
        views: {
          'appContent' :{
            templateUrl: "app/agenda/agenda.html",
            controller : "AgendaController as vm"
          }
        },
          resolve: {
              notes: function(Notes, Localstorage){
                  var lastUpdateTimestamp = getLastUpdateTimestamp(Localstorage) ;
                  return Notes.getNotesSince( lastUpdateTimestamp.format("YYYYMMDD"), Localstorage.get("username") );
              }
          }
      })
      .state('app.settings', {
        url: "/settings",
        views: {
          'appContent' :{
            templateUrl: "app/settings/settings.html"
          }
        }
      })
      .state('app.account', {
        url: "/account",
        views: {
          'appContent' :{
            templateUrl: "app/settings/settings-account.html",
            controller : "SettingsAccountController as vm"
          }
        }
      })
      .state('app.network', {
          url: "/network",
          views: {
              'appContent' :{
                  templateUrl: "app/settings/settings-network.html",
                  controller : "SettingsNetworkController as vm"
              }
          }
      })
      .state('app.reload', {
          url: "/reload",
          views: {
              'appContent' :{
                  templateUrl: "app/settings/settings-reload.html",
                  controller : "SettingsReloadController as vm"
              }
          }
      })
      .state('app.server', {
          url: "/server",
          views: {
              'appContent' :{
                  templateUrl: "app/settings/settings-hostname.html",
                  controller : "SettingsServerUrlController as vm"
              }
          }
      })


  // if none of the above states are matched, use this as the fallback
//        $urlRouterProvider.otherwise('/app/calendar');
        $urlRouterProvider.otherwise('/login');

    // functions for resolve
        function getLastUpdateTimestamp(Localstorage){
            var tempString = Localstorage.get("lastUpdateTimestamp");
            var lastUpdateTimestamp = moment("1970-01-01") ;
            if (tempString){
                var tempDate = moment(tempString, "YYYYMMDD HHmmss") ;
                if (tempDate.isValid()) lastUpdateTimestamp = tempDate;
            }
            return lastUpdateTimestamp;
        }

    });
