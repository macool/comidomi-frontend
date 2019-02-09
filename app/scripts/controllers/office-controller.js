(function () {
'use strict';

  angular
    .module('porttare.controllers')
    .controller('OfficeController', OfficeController);

  function OfficeController(places,
                            office,
                            OfficesService,
                            ModalService,
                            $ionicLoading,
                            $ionicPopup,
                            $scope,
                            $filter) {

    var officesVm = this;
    officesVm.places = places;
    officesVm.showEditOffice = showEditOffice;
    officesVm.showDeleteOffice = showDeleteOffice;
    officesVm.closeModal = closeModal;
    officesVm.submitOffice = submitOffice;
    officesVm.submitOfficeDelete = submitOfficeDelete;
    officesVm.updateOfficeState = updateOfficeState;
    officesVm.officeDetail = office;
    officesVm.mapDefaultInCurrentGeolocation = false;

    initializeOffice();

    function initializeOffice(){
      officesVm.officeDetail.place = getCurrentPlace();
    }

    function getCurrentPlace(){
      return places.find(function(place){
        return place.id === officesVm.officeDetail.place_id; // jshint ignore:line
      });
    }

    function showEditOffice() {
      officesVm.office = angular.copy(officesVm.officeDetail);
      officesVm.office.weekdays_attributes = weekdaysAttributesForEdit();  // jshint ignore:line
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/offices/new-edit.html'
      });
    }

    function weekdaysAttributesForEdit() {
      return officesVm.office.weekdays.map(function (weekday){
        var newWeekday = angular.copy(weekday);
        if (weekday.hora_de_apertura) { // jshint ignore:line
          newWeekday.hora_de_apertura = toTimeSchedule(weekday.hora_de_apertura); // jshint ignore:line
        }
        if (weekday.hora_de_cierre) { // jshint ignore:line
          newWeekday.hora_de_cierre = toTimeSchedule(weekday.hora_de_cierre); // jshint ignore:line
        }
        return newWeekday;
      });
    }

    function showDeleteOffice() {
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/offices/delete.html'
      });
    }

    function closeModal() {
      officesVm.office = {};
      officesVm.messages = {};
      return ModalService.closeModal();
    }

    function submitOffice(){
      if(officesVm.form.$valid){
        loading('globals.updating');
        OfficesService.updateOffice(
          officesVm.office
        ).then(function success(resp){
          $ionicLoading.hide().then(function(){
            officesVm.officeDetail = resp.provider_office; //jshint ignore:line
            closeModal().then(initializeOffice);
          });
        }, function(rpta){
          officesVm.messages = rpta.status===422 ? rpta.data.errors:undefined;
          $ionicLoading.hide();
        });
      }
    }

    function submitOfficeDelete(){
      $ionicPopup.alert({
        title: 'Error',
        template: '{{::("office.taskInProgress"|translate)}} !!!'
      }).then(function(){
        officesVm.closeModal();
      });
    }

    function loading(template){
      $ionicLoading.show({
        template: '{{::("'+template+'"|translate)}}'
      });
    }

    function updateOfficeState() {
      OfficesService.updateOffice({
        id: officesVm.officeDetail.id,
        enabled: officesVm.officeDetail.enabled
      }).then(function (response) {
        officesVm.officeDetail = response.provider_office; // jshint ignore:line
        initializeOffice();
      });
    }

    function toTimeSchedule(timeStr){
      $filter('toDate')(timeStr, 'timeSchedule').toDate();
    }
  }
})();
