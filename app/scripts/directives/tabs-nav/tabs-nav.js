(function () {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

  angular
    .module('porttare.directives')
    .directive('tabsNav', tabsNav);

  function tabsNav() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/tabs-nav/tabs-nav.html',
      scope: {
        options: '=?'
      },
      controller: [
        '$state',
        '$scope',
        tabsNavController
      ],
      controllerAs: 'tbVm',
      bindToController: true
    };

    return directive;
  }

  function tabsNavController($state, $scope) {
    var tbVm = this,
        defaultTabsOptions = [
          {
            sref: 'app.services.providers',
            icon: 'store',
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
            sref: 'app.profile.info',
            icon: 'person',
            title: 'Perfil'
          },
          {
            sref: 'courier.orders.new',
            icon: 'swap_horiz',
            title: 'Mensajero'
          }
        ];

    tbVm.options = tbVm.options || {};
    tbVm.tabs = tbVm.options.tabs || defaultTabsOptions;
    $scope.state = $state;
  }
})();
