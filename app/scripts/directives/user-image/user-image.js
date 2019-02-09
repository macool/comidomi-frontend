(function () {
  'use strict';
  /* jshint validthis:true */
  angular
    .module('porttare.directives')
    .directive('userImage', userImage);

  function userImage() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/user-image/user-image.html',
      scope: {
        user: '='
      },
      controller: ['ProfileService', userImageController],
      controllerAs: 'uimVm',
      bindToController: true,
      replace:true
    };

    return directive;

    function userImageController(ProfileService) {
      var uimVm = this;
      uimVm.getUserImageURL = getUserImageURL;

      function getUserImageURL() {
        return ProfileService.getUserImageURL(uimVm.user);
      }
    }

  }
})();
