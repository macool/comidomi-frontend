(function () {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

  angular
    .module('porttare.directives')
    .directive('skeleton', skeleton);

  function skeleton() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/skeleton/skeleton.html',
      scope: {
        number: '=',
        kind: '='
      },
      controller: [
        skeletonController
      ],
      controllerAs: 'skVm',
      bindToController: true
    };

    return directive;
  }

  function skeletonController() {

    var skVm = this;
    skVm.number = skVm.number || 1;
    skVm.elements = new Array(skVm.number);
  }
})();
