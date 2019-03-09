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

    orVm.progress = {
      'new': {
        title: 'Enviado',
        active: [1]
      },
      'assigned': {
        title: 'Aceptado',
        active: [1,2]
      },
      'in_progress': {
        title: 'Progreso',
        active: [1,2,3]
      },
      'delivered': {
        title: 'Entregado',
        active: [1,2,3,4]
      }
    };
    
    orVm.order = orVm.order || {};
    orVm.getIconStatus = CommonService.getStatusOrderIcon;
    orVm.getTime = getTime;

    function getTime(date){
      if (date){
        return moment(date).format('h:mm a')
      }else{
        return 'N/A'
      }
    }
  }
})();
