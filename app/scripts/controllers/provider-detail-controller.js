(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderDetailController', ProviderDetailController);

  function ProviderDetailController($scope,
                                    $ionicLoading,
                                    data,
                                    CommonService) {
    var providerDetVm = this;
    providerDetVm.provider = data.provider_profile; //jshint ignore:line
    var office = providerDetVm.provider.provider_offices[0]; //jshint ignore:line
    providerDetVm.isOpen = CommonService.officeScheduleDay(office).isOpen;
    providerDetVm.closedMsgTranslation = {
      providerName: providerDetVm.provider.nombre_establecimiento //jshint ignore:line
    };

    // HACK:
    // fixes a bug where transitioning (back) to this
    // screen using the hardware back button gets stuck
    // on $ionicLoading
    $scope.$on('$ionicView.enter', function(){
      $ionicLoading.hide();
    });
  }
})();
