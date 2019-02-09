(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('CourierController', CourierController);

  function CourierController(CourierService,
                            $ionicPopup,
                            $state,
                            $auth,
                            $ionicLoading,
                            $ionicScrollDelegate,
                            places) {
    var courierVm = this;
    var stateRedirect = 'courier.orders';

    courierVm.submit = submit;
    courierVm.step = 1;
    courierVm.createCourier = createCourier;
    courierVm.messages = {};
    courierVm.courierForm = {};
    courierVm.places = places;
    initCourier();

    courierVm.licenses = [
      'A',
      'A1',
      'B',
      'C1',
      'C',
      'D1',
      'D',
      'E1',
      'E',
      'F',
      'G'
    ];
    courierVm.mobilization = [
      'Motocicleta particular',
      'Motocicleta comercial',
      'Automóvil particular',
      'Automóvil estatal',
      'Automóvil comercial',
      'Bus escolar / turismo',
      'Bus pasajeros',
      'Pesado',
      'Especiales'
    ];

    function initCourier(){
      courierVm.courier = {};
      courierVm.courier.nombres = $auth.user.name;
      courierVm.courier.email = $auth.user.email;
      courierVm.courier.place_id = $auth.user.current_place_id; // jshint ignore:line
    }

    function createCourier() {
      courierVm.courierForm.submissionErrorCode = null;
      $ionicLoading.show({
        template: '{{::("globals.sending"|translate)}}'
      });

      CourierService.createNewCourier(courierVm.courier)
        .then(function success(courier) {
          //update auth user
          $auth.user.courier_profile = courier.courier_profile; //jshint ignore:line
          $ionicLoading.hide();
          $state.go(stateRedirect).then(function () {
            $ionicPopup.alert({
              title: 'Alerta',
              template: '{{::("courier.successCourierSave"|translate)}}'
            });
          });
        },
        function error(resp) {
          courierVm.step = 1;
          courierVm.courierForm.submissionErrorCode = 'wrongSubmission';
          if (resp && resp.errors) {
            courierVm.messages = resp.errors;
          }
          $ionicLoading.hide();
        });
    }

    function submit() {
      if(courierVm.step === 2){
        createCourier();
      }
      courierVm.step += 1;
      $ionicScrollDelegate.scrollTop();
    }
  }
})();
