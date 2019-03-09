(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive(
      'shippingRequestDispatchAt',
      shippingRequestDispatchAt
    );

  function shippingRequestDispatchAt(){
    var directive = {
      restrict: 'E',
      bindToController: true,
      controllerAs: 'dispatchAtVM',
      controller: [
        shippingRequestDispatchAtController
      ],
      scope: {
        dispatchAt: '=',
        simpleDate: '@'
      },
      templateUrl: 'templates/directives/shipping-request-dispatch-at/shipping-request-dispatch-at.html'
    };
    return directive;
  }

  function shippingRequestDispatchAtController(){
    // jshint validthis:true
    var dispatchAtVM = this;
    dispatchAtVM.timeInFuture = getIsTimeInFuture();
    dispatchAtVM.date = date();

    function getIsTimeInFuture(){
      return moment(dispatchAtVM.dispatchAt).diff() > 0;
    }

    function date(){
      return moment(dispatchAtVM.dispatchAt).format('YYYY-MM-DD');
    }
  }
})();
