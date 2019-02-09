(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderDetailController', ProviderDetailController);

  function ProviderDetailController(data) {
    var providerDetVm = this;
    providerDetVm.provider = data.provider_profile; //jshint ignore:line
  }
})();
