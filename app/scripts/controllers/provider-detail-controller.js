(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderDetailController', ProviderDetailController);

  function ProviderDetailController(data) {
    var providerDetVm = this;
    providerDetVm.isOpen = true;
    providerDetVm.provider = data.provider_profile; //jshint ignore:line
    providerDetVm.provider.getIsOpenOffice = getIsOpenOffice;

    function getIsOpenOffice(isOpen){
      providerDetVm.isOpen =  isOpen;
    };
  }
})();
