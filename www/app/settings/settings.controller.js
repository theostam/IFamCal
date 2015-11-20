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

;
