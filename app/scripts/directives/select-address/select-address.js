(function() {
  'use strict';

  /* jshint validthis:true */
  /* jshint camelcase:false */

  angular
    .module('porttare.directives')
    .directive('selectAddress', selectAddress);

  function selectAddress() {
    var directive = {
      restrict: 'E',
      templateUrl: 'templates/directives/select-address/select-address.html',
      scope: {
        addresses: '=',
        onSelected: '=?'
      },
      controller: [
        'ModalService',
        '$scope',
        'ProfileAddressesService',
        selectAddressController
      ],
      controllerAs: 'slAddressVm',
      bindToController: true
    };

    return directive;
  }

  function selectAddressController(ModalService,
                                  $scope,
                                  ProfileAddressesService) {
    var slAddressVm = this;

    slAddressVm.addresses = slAddressVm.addresses || [];
    slAddressVm.selectAddress = selectAddressesModal;
    slAddressVm.indexSelected = null;
    slAddressVm.errand = {};
    slAddressVm.newAddress = newAddress;
    slAddressVm.onSelected = slAddressVm.onSelected || function() {};

    var inputSelectOptions = {
      0: {
        onClick: newAddress,
        text: 'Agregar Dirección',
        address: null
      },
      1: {
        onClick: function() {},
        address: slAddressVm.addresses[0]
      },
      default: {
        onClick: selectAddressesModal,
        text: 'Seleccionar Dirección',
        address: null
      }
    };

    slAddressVm.inputOptions = inputSelectOptions[slAddressVm.addresses.length] || inputSelectOptions.default;

    function selectAddressesModal() {
      $scope.vm = {
        addresses: slAddressVm.addresses,
        clickAddress: clickAddress,
        addressSelected: slAddressVm.inputOptions.address,
        addAddress: addAddress,
        closeModal: closeModal
      };

      ModalService.showModal({
        parentScope: $scope,
        backdropClickToClose: true,
        fromTemplateUrl: 'templates/customer/errands/choose-address.html',
      });
    }

    function closeModal() {
      return ModalService.closeModal();
    }

    function clickAddress(address) {
      $scope.vm.addressSelected = address;
    }

    function addAddress(address) {
      slAddressVm.inputOptions.address = address;
      slAddressVm.onSelected(address);
      closeModal();
    }

    function newAddress() {
      closeModal().then(function() {
        $scope.pfaVm = {
          closeModal: closeModal,
          processAddress: saveNewAddress,
          defaultInCurrentGeolocation: true
        };
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/profile/addresses/modal-form.html'
        });
      });
    }

    function saveNewAddress(data) {
      ProfileAddressesService.createAddresses(data).then(function(response) {
        var newCustomerAddress = response.customer_address;
        slAddressVm.addresses.push(newCustomerAddress);
        slAddressVm.inputOptions.address = newCustomerAddress;
        closeModal();
      }, function(error) {
        $scope.pfaVm.messages = error.errors;
      });
    }
  }
})();
