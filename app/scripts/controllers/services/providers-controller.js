(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ServicesProvidersController', ServicesProvidersController);

  function ServicesProvidersController(ProvidersService){
    var servicesProvidersVM = this;

    init();

    function init(){
      ProvidersService.getProviders().then(function(providers){
        servicesProvidersVM.providers = providers;
      });
    }
  }
})();
