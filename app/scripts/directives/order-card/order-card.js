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
        orderCardController
      ],
      controllerAs: 'orVm',
      bindToController: true
    };

    return directive;
  }

  function orderCardController() {
    var orVm = this;

    orVm.order = orVm.order || {};
    orVm.getTime = getTime;

    function getTime(date){
      return date ? moment(date).format('h:mm a') : 'N/A';
    }
  }
})();
