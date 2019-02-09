(function () {
'use strict';

  angular
    .module('porttare.controllers')
    .controller('DispatchersController', DispatchersController);

  function DispatchersController(DispatchersService,
                                 ModalService,
                                 OfficesService,
                                 ErrorHandlerService,
                                 $scope,
                                 $ionicLoading,
                                 $ionicPopup) {

    var dispatchersVm = this;
    dispatchersVm.newDispatcherModal = newDispatcherModal;
    dispatchersVm.submitDispatcher = submitDispatcher;
    dispatchersVm.closeDispatcher = closeDispatcher;
    dispatchersVm.dispatcherName = dispatcherName;
    getDispatchers();

    function getDispatchers() {
      DispatchersService.getDispatchers().then(function(results){
        dispatchersVm.dispatchers = results.provider_dispatchers; //jshint ignore:line
      }, ErrorHandlerService.handleCommonErrorGET);
    }

    function newDispatcherModal(){
      if (dispatchersVm.offices) {
        triggerNewDispatcherModal();
      } else {
        OfficesService.getOffices().then(function success(respuesta){
          dispatchersVm.offices = respuesta.provider_offices; //jshint ignore:line
          triggerNewDispatcherModal();
        }, ErrorHandlerService.handleCommonErrorGET);
      }
    }

    function triggerNewDispatcherModal(){
      dispatchersVm.dispatcher = {};
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/dispatchers/new-edit.html'
      });
    }

    function submitDispatcher(){
      if(dispatchersVm.form.$valid){
        $ionicLoading.show({template: '{{::("globals.saving"|translate)}}'});
        DispatchersService.createDispatcher(dispatchersVm.dispatcher).then(function success(resp){
          $ionicLoading.hide().then(function(){
            dispatchersVm.dispatchers.push(resp.provider_dispatcher); //jshint ignore:line
            $ionicPopup.alert({
              title: 'Éxito',
              template: '{{::("dispatchers.dispatchersCreate"|translate)}}'
            }).then(function(){
              closeDispatcher();
            });
          });
        }, function(rpta){
          dispatchersVm.messages = rpta.status===422 ? rpta.data.errors:undefined;
          $ionicLoading.hide();
        });
      }
    }

    function closeDispatcher() {
      ModalService.closeModal();
      dispatchersVm.messages = {};
    }

    function dispatcherName(dispatcher) {
      if (dispatcher.user) {
        return dispatcher.user.to_s; // jshint ignore:line
      } else {
        return dispatcher.email;
      }
    }
  }
})();
