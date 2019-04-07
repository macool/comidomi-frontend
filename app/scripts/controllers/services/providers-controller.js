(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ServicesProvidersController', ServicesProvidersController);

  function ServicesProvidersController(ProvidersService,
                                      ErrorHandlerService){

    var servicesProvidersVM = this;
    servicesProvidersVM.loaded = false;
    
    init();

    function init() {
      ProvidersService.getProviders()
        .then(function success(providers) {
          servicesProvidersVM.providers = providers || [];
          servicesProvidersVM.loaded = true;
        }, ErrorHandlerService.handleCommonErrorGET);
    }
  }
})();
