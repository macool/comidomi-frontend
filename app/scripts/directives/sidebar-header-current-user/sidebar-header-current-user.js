(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('sidebarHeaderCurrentUser', sidebarHeaderCurrentUser);

  function sidebarHeaderCurrentUser(){
    var directive = {
      restrict: 'E',
      scope: {
        showProfileLink: '='
      },
      bindToController: true,
      controllerAs: 'sidebarHeaderCurrentUserVM',
      controller: sidebarHeaderCurrentUserController,
      link: sidebarHeaderCurrentUserLink,
      templateUrl: 'templates/directives/sidebar-header-current-user/sidebar-header-current-user.html'
    };
    return directive;
  }

  function sidebarHeaderCurrentUserController(){}

  function sidebarHeaderCurrentUserLink(scope){
    var sidebarHeaderCurrentUserVM = scope.sidebarHeaderCurrentUserVM;

    angular.forEach([
      'userName',
      'userImageURL'
    ], function (watchingProperty){
      scope.$parent.$watch(
        'siteVm.' + watchingProperty,
        function (newValue) {
          sidebarHeaderCurrentUserVM[watchingProperty] = newValue;
        }
      );
    });
  }
})();
