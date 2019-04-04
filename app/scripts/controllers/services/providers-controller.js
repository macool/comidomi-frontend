(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ServicesProvidersController', ServicesProvidersController);

  function ServicesProvidersController(providers){
    var servicesProvidersVM = this;
    servicesProvidersVM.providers = providers || [];
  }
})();
