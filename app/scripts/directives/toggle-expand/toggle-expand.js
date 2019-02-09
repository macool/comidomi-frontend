(function () {
  'use strict';
  /* jshint validthis:true */
  angular
    .module('porttare.directives')
    .directive('toggleExpand', toggleExpand);

  function toggleExpand() {
    var directive = {
      restrict: 'A',
      scope: {
        toggleExpand: '=',
      },
      controller: ['$timeout', '$ionicScrollDelegate', toggleExpandController],
      controllerAs: 'tecVm',
      bindToController: true,
      transclude: true,
      templateUrl: 'templates/directives/toggle-expand/toggle-expand.html'
    };

    return directive;
  }

  function toggleExpandController($timeout, $ionicScrollDelegate) {
    var tecVm = this;
    tecVm.toggleExpanding = toggleExpanding;
    
    function toggleExpanding(){
      tecVm.toggleExpand = !tecVm.toggleExpand;
      $timeout(function(){
        $ionicScrollDelegate.resize();
      }, 250); // animation takes 0.2s
    }
  }
})();
