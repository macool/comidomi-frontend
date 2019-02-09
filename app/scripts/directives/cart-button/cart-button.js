(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('cartButton', cartButton);

  function cartButton() {
    var directive = {
      restrict: 'E',
      bindToController: true,
      controllerAs: 'cartButtonVM',
      controller: [
        '$auth',
        '$scope',
        cartButtonController
      ],
      templateUrl: 'templates/directives/cart-button/cart-button.html'
    };
    return directive;
  }

  function cartButtonController($auth, $scope) {
    // jshint validthis:true
    var cartButtonVM = this;

    if ($auth.user.customer_order) {//jshint ignore:line
      getNumberItems();
    }

    function getNumberItems(){
      var povider_profiles = $auth.user.customer_order.provider_profiles;//jshint ignore:line
      var cantidadItem = povider_profiles.reduce(function(total,provider){//jshint ignore:line
        return total+getTotalItems(provider);
      }, 0);
      cartButtonVM.numberItems=cantidadItem;
    }

    function getTotalItems(provider) {
      var total = 0;
      if(provider.customer_order_items) {//jshint ignore:line
        total=provider.customer_order_items.length;//jshint ignore:line
      }
      return total;
    }

    $scope.$on('update-number', function() {
      getNumberItems();
    });
  }
})();
