(function () {
  'use strict';

  angular
    .module('porttare.config')
    .config(touchProvider);

  function touchProvider($touchProvider) {
    $touchProvider.ngClickOverrideEnabled(true);
  }
})();
