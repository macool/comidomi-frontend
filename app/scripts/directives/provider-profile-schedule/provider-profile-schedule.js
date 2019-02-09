(function () {
  'use strict';

  angular
    .module('porttare.directives')
    .directive('providerProfileSchedule', providerProfileSchedule);

  function providerProfileSchedule() {
    var directive = {
      restrict: 'EA',
      controller: ['$filter', providerProfileScheduleController],
      controllerAs: 'ppSVm',
      bindToController: true,
      scope: {
        providerProfile: '='
      },
      templateUrl: 'templates/directives/provider-profile-schedule/provider-profile-schedule.html'
    };

    return directive;

    function providerProfileScheduleController($filter) {
      // jshint validthis:true
      var ppSVm = this,
          providerOffices = ppSVm.providerProfile.provider_offices, // jshint ignore:line
          mainOffice = providerOffices[0];

      ppSVm.isOpen = false;

      if (mainOffice) {
        showScheduleFor(mainOffice);
      }

      function showScheduleFor(office){
        var dia = getTodayStr();

        var officeWeekday = office.weekdays.find(function(wday){
          return wday.day === dia;
        });

        if (officeWeekday) {
          ppSVm.openingTime = convertToDate(
            officeWeekday.hora_de_apertura // jshint ignore:line
          );
          ppSVm.closingTime = convertToDate(
            officeWeekday.hora_de_cierre // jshint ignore:line
          );
          ppSVm.isOpen = getIsOpen(officeWeekday);
        }
      }

      function getIsOpen(officeWeekday) {
        if (angular.element.isEmptyObject(ppSVm.openingTime)) {
          return;
        }
        if (angular.element.isEmptyObject(ppSVm.closingTime)) {
          return;
        }

        var horaActual = moment(),
            isInRange = horaActual.isBetween(
          ppSVm.openingTime,
          ppSVm.closingTime
        );

        if (officeWeekday.abierto && isInRange) {
          return true;
        }
        return false;
      }

      function getTodayStr(){
        return moment().locale('en').format('ddd').toLowerCase();
      }

      function convertToDate(horaStr){
        if (!angular.element.isEmptyObject(horaStr)) {
          return $filter('toDate')(horaStr, 'timeSchedule');
        }
      }
    }
  }
})();
