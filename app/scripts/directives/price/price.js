(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('price', price);

  function price() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'templates/price/price.html',
      scope: {
        amount: '@',
        currency: '@'
      },
      controller: [
        '$translate',
        '$filter',
        '$scope',
        'APP',
        priceController
      ],
      controllerAs: 'priceVm',
      bindToController: true
    };

    return directive;
  }

  function priceController($translate, $filter, $scope, APP){
    var priceVm = this; //jshint ignore:line

    init();

    function init(){
      $translate('item.currency.' + priceVm.currency).then(function(currency){
        priceVm.price = $filter('currency')(priceVm.amount / APP.centsInDollar, currency);
      });
    }

    $scope.$watch('priceVm.amount', function(){
      init();
    });
  }
})();
