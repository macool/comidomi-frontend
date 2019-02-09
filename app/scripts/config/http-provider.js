(function () {
'use strict';

  angular
    .module('porttare.config')
    .config(requestsOverwrite);

  function requestsOverwrite($httpProvider) {
    $httpProvider.interceptors.push('InterceptorsService');
  }

})();
