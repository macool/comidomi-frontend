(function () {
'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProductsController', ProductsController);

  function ProductsController(ProductsService) {
    var productsVm = this;
    productsVm.query = '';
    init();

    function init(){
      var params = {page: 0};
      ProductsService.getProducts(params).then(function(results){
        productsVm.products = results.products;
      });
    }
  }
})();
