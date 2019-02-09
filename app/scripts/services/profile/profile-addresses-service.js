(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('ProfileAddressesService', ProfileAddressesService);

  function ProfileAddressesService(ENV, $http, $q, $state, ErrorHandlerService, $ionicLoading, CommonService) {

    var addressListState = 'app.profile.addresses.index';
    var actions = {
      update: {
        listener: updateAddresses
      },
      create: {
        listener: createAddresses
      }
    };

    var service = {
      getAddresses: getAddresses,
      getAddress: getAddress,
      updateAddresses: updateAddresses,
      createAddresses: createAddresses,
      runAction: runAction
    };

    return service;

    function getAddresses() {
      return $http({
        method: 'GET',
        url: ENV.apiHost + '/api/customer/addresses'
      }).then(function success(res) {
        return res.data.customer_addresses; //jshint ignore:line
      }, function error(res) {
        return $q.reject(res.data);
      });
    }

    function updateAddresses(addressUpdated) {
      return $http({
        method: 'PUT',
        url: ENV.apiHost + '/api/customer/addresses/' + addressUpdated.id,
        data: addressUpdated
      }).then(function success(res) {
        return res.data;
      }, function error(res) {
        return $q.reject(res.data);
      });
    }

    function createAddresses(newAddress) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + '/api/customer/addresses',
        data: newAddress
      }).then(function success(res) {
        return res.data;
      }, function error(res) {
        return $q.reject(res.data);
      });
    }

    function getAddress(id) {
      return CommonService
               .getObject('/api/customer/addresses/', id)
               .then(function (resp){
                 return resp.customer_address; //jshint ignore:line
               })
               .catch(ErrorHandlerService.handleCommonErrorGET);
    }

    function reditectToList() {
      $state.go(addressListState);
    }

    function runAction(options) {
      if (actions[options.acionName]) {
        $ionicLoading.show({
          template: '{{::("globals.loading"|translate)}}'
        });
        return actions[options.acionName].listener(options.data)
          .then(reditectToList, ErrorHandlerService.handleCommonErrorGET);
      }
    }
  }
})();
