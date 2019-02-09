(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ProviderService', ProviderService);

  function ProviderService($http, $q, ENV, Upload) {

    var service = {
      createNewProvider: createNewProvider
    };

    return service;

    function createNewProvider(data) {
      var promise;
      var options = {
                      method: 'POST',
                      url: ENV.apiHost + '/api/provider/profile',
                      data: data,
                      arrayKey: '[]'
                    };

      if(data.logotipo){
        promise = Upload.upload(options);
      }
      else{
        promise = $http(options);
      }
      return promise
      .then(function success(res){
        return res.data;
      }, function error(res) {
        return $q.reject(res.data);
      });
    }

  }
})();
