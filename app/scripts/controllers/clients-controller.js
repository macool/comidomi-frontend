(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ClientsController', ClientsController);

  function ClientsController(ClientsService,
                             ModalService,
                             $ionicLoading,
                             $ionicPopup,
                             $scope,
                             $translate,
                             providerClients) {
    var clientsVm = this;
    clientsVm.showNewModal = showNewModal;
    clientsVm.showEditModal = showEditModal;
    clientsVm.closeModal = closeModal;
    clientsVm.submitProcess = submitProcess;
    clientsVm.askToDeleteClient = askToDeleteClient;
    // TODO translate these keys?
    clientsVm.listOptions = [
      {name: 'Nombres', filterField: 'nombres'},
      {name: 'Antigüedad', filterField: 'created_at'}
    ];
    clientsVm.query = '';
    clientsVm.clients = providerClients;
    var selectedClientIndex;

    function submitProcess(id){
      (id) ? editClient() : newClient(); //jshint ignore:line
    }

    function newClient() {
      $ionicLoading.show({
        template: '{{::("globals.saving"|translate)}}'
      });
      ClientsService.newClient(clientsVm.client)
        .then(function success(resp){
          $ionicLoading.hide();
          clientsVm.clients.push(resp);
          $ionicPopup.alert({
            title: 'Éxito',
            template: '{{::("client.successClientSave"|translate)}}'
          }).then(closeModal);
        },
        function error(resp){
          clientsVm.messages = resp.status===422 ? resp.data.errors:undefined;
          $ionicLoading.hide();
        });
    }

    function editClient() {
      $ionicLoading.show({
        template: '{{::("globals.updating"|translate)}}'
      });
      ClientsService.editClient(clientsVm.client)
        .then(function success(resp) {
          $ionicLoading.hide();
          clientsVm.clients[selectedClientIndex] = resp.provider_client; //jshint ignore:line
          $ionicPopup.alert({
            title: 'Éxito',
            template: '{{::("client.successUpdateClient"|translate)}}'
          }).then(closeModal);
        },
        function error(resp){
          clientsVm.messages = resp.status===422 ? resp.data.errors:undefined;
          $ionicLoading.hide();
        });
    }

    function askToDeleteClient(clientId) {
      $translate('globals.confirmTitle').then(function(confirmationTitle) {
        $ionicPopup.confirm({
          title: confirmationTitle,
          template: '{{::("client.confirmDisable"|translate)}}'
        }).then(function (confirmed) {
          if (confirmed) {
            deleteClient(clientId);
          }
        });
      });
    }

    function deleteClient(clientId) {
      $ionicLoading.show({
        template: '{{::("globals.deleting"|translate)}}'
      });
      ClientsService.deleteClient(clientId)
        .then(function success(){
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Éxito',
            template: '{{::("client.successDeleteClient"|translate)}}'
          });
          clientsVm.clients.splice(selectedClientIndex, 1);
        },
        function error(){
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: '{{::("globals.pleaseTryAgain"|translate)}}'
          });
        });
    }

    function showNewModal() {
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/client/new-edit.html'
      });
    }

    function showEditModal(index) {
      selectedClientIndex = index;
      clientsVm.client = angular.copy(clientsVm.clients[index]);
      clientsVm.showNewModal();
    }

    function closeModal() {
      ModalService.closeModal();
      selectedClientIndex = null;
      clientsVm.client = null;
      clientsVm.messages = {};
      clientsVm.query = '';
    }
  }
})();
