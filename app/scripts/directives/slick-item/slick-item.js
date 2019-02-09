(function () {
  'use strict';
  /* jshint validthis:true */
  angular
    .module('porttare.directives')
    .directive('slickItem', slickItem);

  function slickItem() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/slick-item/slick-item.html',
      scope: {
        settings: '=',
        data: '=',
        onClick: '&',
        slickFlag: '='
      },
      controller: slickItemController,
      controllerAs: 'sicVm',
      bindToController: true
    };

    return directive;

    function slickItemController() {
    }
  }
})();
