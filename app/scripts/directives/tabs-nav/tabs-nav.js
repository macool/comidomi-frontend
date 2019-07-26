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
        options: '=?',
        type: '@?'
      },
      controller: [
        '$state',
        '$scope',
        '$auth',
        tabsNavController
      ],
      controllerAs: 'tbVm',
      bindToController: true
    };

    return directive;
  }

  function tabsNavController($state, $scope, $auth) {
    var tbVm = this,
        customerTabs = [
          {
            sref: 'app.services.providers',
            icon: 'store',
            title: 'Home',
            validate: isValid
          },
          {
            sref: 'app.errands.new',
            icon: 'shopping_basket',
            title: 'Encomiendas',
            validate: isValid
          },
          {
            sref: 'app.customerorders.index',
            icon: 'receipt',
            title: 'Mis Pedidos',
            validate: isValid
          },
          {
            sref: 'app.profile.info',
            icon: 'person',
            title: 'Perfil',
            validate: isValid
          },
          {
            sref: 'courier.orders.new',
            icon: 'swap_horiz',
            title: 'Mensajero',
            validate: function(){
              return $auth.user.courier_profile;
            }
          },
          {
            sref: 'provider.items.index',
            icon: 'swap_horiz',
            title: 'Proveedor',
            validate: function(){
              return $auth.user.provider_profile;
            }
          }
        ],
        courieTabs = [
          {
            sref: 'courier.orders.new',
            icon: 'stars',
            title: 'Nuevos',
            validate: isValid
          },
          {
            sref: 'courier.orders.shippings',
            icon: 'directions_bike',
            title: 'En Progreso',
            validate: isValid
          },
          {
            sref: 'courier.orders.all',
            icon: 'view_list',
            title: 'Entregados',
            validate: isValid
          },
          {
            sref: 'app.services.providers',
            icon: 'swap_horiz',
            title: 'Cliente',
            validate: isValid
          }
        ],
        providerTabs = [
          {
            sref: 'provider.items.index',
            icon: 'restaurant',
            title: 'Mi Menu',
            validate: isValid
          },
          {
            sref: 'provider.orders.index',
            icon: 'receipt',
            title: 'Pedidos',
            validate: isValid
          },
          {
            sref: 'app.services.providers',
            icon: 'swap_horiz',
            title: 'Cliente',
            validate: isValid
          }
        ],
        tabs = {
          customer: customerTabs,
          courier: courieTabs,
          provider: providerTabs
        };

    tbVm.options = tbVm.options || {};
    tbVm.tabs = tbVm.options.tabs || (tabs[tbVm.type] || customerTabs);
    $scope.state = $state;

    function isValid() {
      return true;
    }
  }
})();
