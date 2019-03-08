(function () {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

  angular
    .module('porttare.directives')
    .directive('orderCard', orderCard);

  function orderCard() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/order-card/order-card.html',
      scope: {
        order: '='
      },
      controller: [
        'CommonService',
        orderCardController
      ],
      controllerAs: 'orVm',
      bindToController: true
    };

    return directive;
  }

  function orderCardController(CommonService) {
    var orVm = this;
    
    orVm.order = orVm.order || {};
    orVm.getIconStatus = CommonService.getStatusOrderIcon;
  }
})();
