(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ServicesProvidersController', ServicesProvidersController);

  function ServicesProvidersController(providers, CommonService){
    var servicesProvidersVM = this;
     
    servicesProvidersVM.providers = addOfficeIsOpen(providers) || [];

    function addOfficeIsOpen(providers){
      angular.forEach(providers, function(provider){
        var office = provider.provider_offices[0]; //jshint ignore:line
        provider.officeIsOpen = CommonService.officeScheduleDay(office);
      });
      return providers;
    }
  }
})();
