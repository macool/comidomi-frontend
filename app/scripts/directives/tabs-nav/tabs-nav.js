(function () {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

  angular
    .module('porttare.directives')
    .directive('tabsNav', tabsNav);

  function tabsNav() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/tabs-nav/tabs-nav.html',
      scope: {
        options: '='
      },
      controller: [
        '$state',
        '$scope',
        tabsNavController
      ],
      controllerAs: 'tbVm',
      bindToController: true
    };

    return directive;
  }

  function tabsNavController($state, $scope) {
    var tbVm = this;
    tbVm.options = tbVm.options || {};
    tbVm.tabs = tbVm.options.tabs || [];
    $scope.state = $state;
  }
})();
