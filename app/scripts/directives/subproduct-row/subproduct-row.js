(function () {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

  angular
    .module('porttare.directives')
    .directive('subproductRow', subproductRow);

  function subproductRow() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/subproduct-row/subproduct-row.html',
      scope: {
        product: '=',
        onClick: '@'
      },
      controller: [
        '$auth',
        'CartService',
        subproductRowController
      ],
      controllerAs: 'spcVm',
      bindToController: true
    };

    return directive;
  }

  function subproductRowController($auth,
                                   CartService) {
    var spcVm = this,
        cartItem;

    cartItem = CartService.findCartItem(
      $auth.user.customer_order,
      spcVm.product
    );

    console.log(cartItem);

    spcVm.counterOptions = {
      cantidad: 1,
      limit: 5,
      cartItem: cartItem,
      providerItem: spcVm.product,
      priceCents: spcVm.product.precio_cents,
      currencyCode: spcVm.product.precio_currency,
      onChangeValue: function(){
        console.log('onChangeValue');
      }
    };
  }
})();
