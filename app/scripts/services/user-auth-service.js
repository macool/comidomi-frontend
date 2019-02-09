(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('UserAuthService', UserAuthService);

  function UserAuthService($auth, $state, $ionicLoading, $http, ENV) {
    var service = {
      checkIfEnabledProvider : checkIfEnabledProvider,
      agreeTermsOfService : agreeTermsOfService
    };

    return service;

    function checkIfEnabledProvider() {
      return $auth.validateUser()
      .then(function userAuthorized(user) {
        if (user.provider_profile && user.provider_profile.status === 'disabled') { //jshint ignore:line
          $state.go('disabledUserError').then(function () {
            $ionicLoading.hide();
          });
        }
        return;
      }, function userNotAuthorized() {
          return;
      });
    }

    function agreeTermsOfService() {
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/users/tos'
      });
    }
  }
})();
