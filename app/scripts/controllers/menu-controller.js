(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('MenuController', MenuController);

  function MenuController($state, $scope) {
    $scope.state = $state;

    $scope.hideBackButtonInStates = {
      'app.services.providers': true,
      'app.errands.new': true,
      'app.customerorders.index': true,
      'app.profile.info': true
    };

  }
})();
