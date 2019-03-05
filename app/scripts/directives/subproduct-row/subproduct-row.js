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
        onChangeAmount: '='
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

    spcVm.active = false;

    spcVm.counterOptions = {
      cantidad: 1,
      limit: 0,
      cartItem: cartItem,
      providerItem: spcVm.product,
      priceCents: spcVm.product.precio_cents,
      currencyCode: spcVm.product.precio_currency,
      onChangeValue: function(data){
        if (data.itemsCount === 0){
          spcVm.active = false;
        }
        triggerCallback(data.itemsCount);
      }
    };

    spcVm.clickItem = function (){
      spcVm.active = !spcVm.active;
      if (spcVm.active){
        triggerCallback(spcVm.counterOptions.cantidad);
      }else{
        triggerCallback(0);
      }
    };

    function triggerCallback(cantidad){
      var canAdd = CartService.canAddItem(cartItem, cantidad, spcVm.product);
      if (spcVm.onChangeAmount && angular.isFunction(spcVm.onChangeAmount) && canAdd) {
        var productSummary = {
          cantidad: cantidad,
          provider_item_id: spcVm.product.id,
          product: spcVm.product
        };
        spcVm.onChangeAmount(productSummary);
      }
    }
  }
})();
