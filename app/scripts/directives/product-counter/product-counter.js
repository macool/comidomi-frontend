(function () {
  'use strict';
  /* jshint validthis:true */
  angular
    .module('porttare.directives')
    .directive('productCounter', productCounter);

  function productCounter() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/product-counter/product-counter.html',
      scope: {
        options: '='
      },
      controller: [
        'CartService',
        productCounterController
      ],
      controllerAs: 'pcVm',
      bindToController: true
    };

    return directive;
  }

  function productCounterController(CartService) {
    var pcVm = this,
      options = {},
      actions = {
        subtract: 'subtract',
        add: 'add'
      };

    pcVm.handleClickMinus = handleClickMinus;
    pcVm.handleClickPlus = handleClickPlus;
    pcVm.disabledMinus = disabledMinus;
    init();

    pcVm.itemsCount = options.cantidad;
    pcVm.currencyCode = options.currencyCode;
    pcVm.canIncrement = getCanIncrement();
    pcVm.priceTotalCents = getTotal();

    function processData(option) {
      if (isInRange(pcVm.itemsCount)) {
        if (option === actions.subtract) {
          if (pcVm.itemsCount !== options.limit) {
            changeCounter(option);
          }
        } else {
          changeCounter(option);
        }
      }
    }

    function changeCounter(option) {
      if (option === actions.add) {
        pcVm.itemsCount++;
      } else if (option === actions.subtract) {
        pcVm.itemsCount--;
      }
      pcVm.priceTotalCents = getTotal();
      pcVm.canIncrement = getCanIncrement();
      if (options.onChangeValue && angular.isFunction(options.onChangeValue)) {
        var data = {
          itemsCount: pcVm.itemsCount,
          priceTotalCents: pcVm.priceTotalCents
        };
        options.onChangeValue(data);
      }
    }

    function handleClickMinus() {
      runAction('onClickMinus');
      processData(actions.subtract);
    }

    function handleClickPlus() {
      runAction('onClickPlus');
      processData(actions.add);
    }

    function runAction(name) {
      if (options[name] && angular.isFunction(options[name])) {
        options[name]();
      }
    }

    function init() {

      var defaultOptions = {
        priceCents: 0,
        onClickMinus: null,
        onClickPlus: null,
        onChangeValue: null,
        cantidad: 0,
        limit: 1,
        currencyCode: 'USD'
      };

      if (!isValidNumber(pcVm.options.priceCents)) {
        throw 'Invalid value for option \'priceCents\'';
      }

      options = angular.merge({}, defaultOptions, pcVm.options);
    }

    function isValidNumber(value) {
      return angular.isNumber(value) && Number.isInteger(value);
    }

    function isInRange(value) {
      return value >= options.limit;
    }

    function getTotal() {
      return pcVm.itemsCount * (options.priceCents);
    }

    function getCanIncrement() {
      return CartService.canAddItem(
        pcVm.options.cartItem,
        pcVm.itemsCount,
        pcVm.options.providerItem
      );
    }

    function disabledMinus(){
      return pcVm.itemsCount === options.limit;
    }
  }
})();
