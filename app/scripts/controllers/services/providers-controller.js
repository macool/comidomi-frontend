(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ServicesProvidersController', ServicesProvidersController);

  function ServicesProvidersController(providers){
    var servicesProvidersVM = this;
     
    servicesProvidersVM.providers = addGetIsOpenProvider(providers) || [];
    
    function addGetIsOpenProvider(providers){
      angular.forEach(providers, function(provider){
        provider.getIsOpenOffice = getIsOpenOffice;
      });
      return providers;
    }

    function getIsOpenOffice(isOpen){
      return isOpen;
    };
  }
})();
