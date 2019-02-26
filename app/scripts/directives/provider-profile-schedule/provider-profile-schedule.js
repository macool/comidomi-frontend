(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('providerProfileSchedule', providerProfileSchedule);

  function providerProfileSchedule() {
    var directive = {
      restrict: 'EA',
      controller: ['CommonService', providerProfileScheduleController],
      controllerAs: 'ppSVm',
      bindToController: true,
      scope: {
        providerProfile: '='
      },
      templateUrl: 'templates/directives/provider-profile-schedule/provider-profile-schedule.html'
    };

    return directive;

    function providerProfileScheduleController(CommonService) {
      // jshint validthis:true
      var ppSVm = this,
          providerOffices = ppSVm.providerProfile.provider_offices, // jshint ignore:line
          mainOffice = providerOffices[0];

      ppSVm.isOpen = false;

      if (mainOffice) {
        var officeSchedule = CommonService.officeScheduleDay(mainOffice);
        ppSVm.openingTime = officeSchedule.openingTime;
        ppSVm.closingTime = officeSchedule.closingTime;
        ppSVm.isOpen = officeSchedule.isOpen;
      }
    }
  }
})();
