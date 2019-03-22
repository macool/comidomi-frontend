(function () {
    'use strict';
    /* jshint validthis:true */
    angular
      .module('porttare.directives')
      .directive('providerCard', providerCard);

    function providerCard() {
      var directive = {
        restrict: 'E',
        templateUrl: 'templates/directives/provider-card/provider-card.html',
        scope: {
          provider: '='
        },
        controller: [
          'CommonService',
          providerCardController
        ],
        controllerAs: 'pcVm',
        bindToController: true
      };

      return directive;
    }

    function providerCardController(CommonService) {
      var pcVm = this;
			pcVm.provider = pcVm.provider || {};
			var office = pcVm.provider.provider_offices[0]; //jshint ignore:line
			pcVm.provider.officeIsOpen = CommonService.officeScheduleDay(office);
    }
  })();
