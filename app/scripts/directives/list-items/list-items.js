(function () {
  'use strict';
  /* jshint validthis:true */
  angular
    .module('porttare.directives')
    .directive('listItems', slickItem);

  function slickItem() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/list-items/list-items.html',
      scope: {
        data: '=',
        onClick: '&',
        slickFlag: '='
      },
      controller: listItemsController,
      controllerAs: 'liVm',
      bindToController: true
    };

    return directive;

    function listItemsController() {
    }
  }
})();
