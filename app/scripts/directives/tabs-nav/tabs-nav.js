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
        defaultTabsOptions = [
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
          }
        ];

    tbVm.options = tbVm.options || {};
    tbVm.tabs = tbVm.options.tabs || defaultTabsOptions;
    $scope.state = $state;

    function isValid() {
      return true;
    }
  }
})();
