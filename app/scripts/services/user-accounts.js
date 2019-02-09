(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('UserAccountService', UserAccountService);

  function UserAccountService($http, ENV) {
    var service = {
      updateUser : updateUser
    };

    return service;

    function updateUser(user) {
      return $http({
        method: 'PATCH',
        url: ENV.apiHost + '/api/users/account',
        data: user
      }).then(function success(resp){
        return resp.data;
      });
    }
  }
})();
