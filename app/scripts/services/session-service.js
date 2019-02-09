(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('SessionService', SessionService);

  function SessionService($auth,
                          $state,
                          $ionicPopup,
                          APP,
                          NativeSessionService) {

    var service = {
      logOut: logOut,
      loginWithFB: loginWithFB
    };

    return service;

    function logOut() {
      if (isNative()) {
        NativeSessionService.logOut();
      }
      return $auth.signOut();
    }

    function loginWithFB() {
      var successState = APP.successState;
      fbAuthenticate().then(function () {
          $state.go(successState);
        }).catch(function () {
          $ionicPopup.alert({
            title: 'Error',
            template: 'Hubo un error, inténtalo nuevamente.'
          });
        });
    }

    function fbAuthenticate() {
      if (isNative()) {
        return NativeSessionService.loginWithFB();
      } else {
        return $auth.authenticate('facebook');
      }
    }

    function isNative() {
      return !!window.cordova;
    }
  }
})();
