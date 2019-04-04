(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ServicesProvidersController', ServicesProvidersController);

  function ServicesProvidersController(providers){
    var servicesProvidersVM = this;
    servicesProvidersVM.providers = providers || [];

    servicesProvidersVM.tabsOptions = {
      tabs: [
        {
          sref: 'app.services.providers',
          icon: 'home',
          title: 'Home'
        },
        {
          sref: 'app.errands.new',
          icon: 'shopping_basket',
          title: 'Encomiendas'
        },
        {
          sref: 'app.customerorders.index',
          icon: 'receipt',
          title: 'Mis Pedidos'
        },
        {
          sref: 'app.customerorders.index',
          icon: 'person',
          title: 'Perfil'
        }
      ]
    }
  }
})();
