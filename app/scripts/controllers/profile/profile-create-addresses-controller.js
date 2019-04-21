(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProfileCreateAddressesController', ProfileCreateAddressesController);

  function ProfileCreateAddressesController(ProfileAddressesService) {
    var pfaVm = this;
    pfaVm.addressFormData = {};
    pfaVm.messages = {};
    pfaVm.processAddress = processAddress;
    pfaVm.defaultInCurrentGeolocation = true;

    function processAddress() {
      var options = {
        acionName: 'create',
        data: pfaVm.addressFormData
      };
      return ProfileAddressesService
        .runAction(options)
        .catch(function (response){
          if (response.errors) {
            pfaVm.messages = response.errors;
          }
      });
    }
  }
})();
