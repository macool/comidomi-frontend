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
        dispatchAt: '='
      },
      templateUrl: 'templates/directives/shipping-request-dispatch-at/shipping-request-dispatch-at.html'
    };
    return directive;
  }

  function shippingRequestDispatchAtController(){
    // jshint validthis:true
    var dispatchAtVM = this;
    dispatchAtVM.timeInFuture = getIsTimeInFuture();

    function getIsTimeInFuture(){
      return moment(dispatchAtVM.dispatchAt).diff() > 0;
    }
  }
})();
