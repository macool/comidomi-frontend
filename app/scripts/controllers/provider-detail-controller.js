(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderDetailController', ProviderDetailController);

  function ProviderDetailController(data, CommonService) {
    var providerDetVm = this;
    providerDetVm.provider = data.provider_profile; //jshint ignore:line
    var office = providerDetVm.provider.provider_offices[0]; //jshint ignore:line
    providerDetVm.isOpen = CommonService.officeScheduleDay(office).isOpen;
    providerDetVm.closedMsgTranslation = {
      providerName: providerDetVm.provider.nombre_establecimiento //jshint ignore:line
    };
  }
})();
