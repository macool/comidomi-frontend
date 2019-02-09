(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('NativeSessionService', NativeSessionService);

  function NativeSessionService ($auth,
                               $http,
                               $rootScope,
                               $cordovaFacebook,
                               APP,
                               ENV) {
    var service = {
      logOut: logOut,
      loginWithFB: loginWithFB
    };
    var deferred;

    return service;

    function logOut() {
      return $cordovaFacebook.logout();
    }

    function loginWithFB() {
      deferred = $auth.initDfd();
      $cordovaFacebook.getLoginStatus()
        .then(function(response) {
          if (response.status === 'connected') {
            return fbAuthorizationSuccess(response);
          } else {
            $cordovaFacebook.login(APP.fbAuthScope).then(
              fbAuthorizationSuccess,
              authorizationFailure
            );
          }
        });
      return deferred.promise;
    }

    function fbAuthorizationSuccess(credentials) {
      var postData = {
        provider: 'facebook',
        access_token: credentials.authResponse.accessToken // jshint ignore:line
      };
      $http({
        method: 'POST',
        data: postData,
        url: ENV.apiHost + '/api/auth/native_login',
        headers: { 'Accept': 'application/json' }
      }).then(
        performLogin,
        authorizationFailure
      );
    }

    function performLogin(response) {
      var authData = $auth.getConfig().handleLoginResponse(response.data);
      $auth.handleValidAuth(authData, true); // this resolves the promise
      $rootScope.$broadcast('auth:login-success', $auth.user);
    }

    function authorizationFailure(error) {
      return deferred.reject(error);
    }
  }
})();
