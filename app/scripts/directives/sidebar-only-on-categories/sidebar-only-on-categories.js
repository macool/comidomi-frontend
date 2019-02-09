(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('sidebarOnlyOnCategories', sidebarOnlyOnCategories);

  function sidebarOnlyOnCategories(){
    var directive = {
      restrict: 'E',
      transclude: true,
      controllerAs: 'sidebarOnlyVM',
      bindToController: true,
      controller: ['$location', '$rootScope', sidebarOnlyOnCategoriesController],
      templateUrl: 'templates/directives/sidebar-only-on-categories/sidebar-only-on-categories.html'
    };
    return directive;
  }

  function sidebarOnlyOnCategoriesController($location,
                                             $rootScope){
    // jshint validthis:true
    var sidebarOnlyVM = this;

    $rootScope.$on('$stateChangeSuccess', initialize);

    initialize();

    function initialize(){
      sidebarOnlyVM.shouldDisplayContent = getShouldDisplayContent();
    }

    function getShouldDisplayContent(){
      var categoriesPath = /app\/categories/;
      return $location.path().match(categoriesPath);
    }
  }
})();
