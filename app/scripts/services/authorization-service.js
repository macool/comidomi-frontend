(function () {
'use strict';

  angular
    .module('porttare.services')
    .factory('AuthorizationService', AuthorizationService);

  function AuthorizationService($auth, $state, $ionicLoading, APP) {
    var service = {
      accessIfUserNotAuth: accessIfUserNotAuth,
      notShowWelcome: notShowWelcome,
      choosePlaceIfNotPresent: choosePlaceIfNotPresent
    };

    return service;

    function accessIfUserNotAuth() {
      return $auth.validateUser()
        .then(function userAuthorized() {
          $state.go(APP.successState).then($ionicLoading.hide);
        }, function userNotAuthorized() {
          return;
        });
    }

    function choosePlaceIfNotPresent(){
      return $auth.validateUser()
        .then(function userAuthorized(user){
          if (!user.current_place) { // jshint ignore:line
            return $state.go(APP.placesState).then($ionicLoading.hide);
          }
        }, function notAuthorized(){
          return;
        });
    }

    function notShowWelcome(route) {
      return $auth.validateUser()
        .then(function userAuthorized(user) {
          if (!user.provider_profile || !user.courier_profile){ //jshint ignore:line
            return;
          }

          $state.go(route).then(function () {
            $ionicLoading.hide();
          });
        });
    }
  }

})();
