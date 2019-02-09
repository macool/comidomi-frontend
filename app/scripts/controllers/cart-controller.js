(function () {
  'use strict';
  /*jshint camelcase:false */
  angular
    .module('porttare.controllers')
    .controller('CartController', CartController);

  function CartController($auth,
                          $scope,
                          $state,
                          $translate,
                          $ionicPopup,
                          $ionicHistory,
                          $ionicLoading,
                          APP,
                          billingAddresses,
                          deliveryAddresses,
                          ModalService,
                          BillingAddressesService,
                          ProfileAddressesService,
                          CartService,
                          CustomerOrderDeliveryService) {
    var cartVm = this,
        performingPost = false;
    cartVm.total = 0;
    cartVm.showCheckoutModal = showCheckoutModal;
    cartVm.closeModal = closeModal;
    cartVm.runCheckout = runCheckout;
    cartVm.paymentMethods = APP.paymentMethods;
    cartVm.assignBillingAddress = assignBillingAddress;
    cartVm.assignAddress = assignAddress;
    cartVm.messages = {};
    cartVm.clearDeliveryTime = clearDeliveryTime;
    cartVm.updateOrderItem = updateOrderItem;
    cartVm.removeOrderItem = removeOrderItem;
    cartVm.chooseAnonBillingAddress = chooseAnonBillingAddress;
    cartVm.showCustomerOrderDelivery = showCustomerOrderDelivery;
    cartVm.submitCustomerOrderDelivery = submitCustomerOrderDelivery;
    cartVm.CustomerOrderDeliverySelect = CustomerOrderDeliverySelect;
    cartVm.checkoutFormAddBillingAddress = checkoutFormAddBillingAddress;
    cartVm.customerOrderDeliveryNewAddress = customerOrderDeliveryNewAddress;
    cartVm.editCustomerOrderDeliveryAddress = editCustomerOrderDeliveryAddress;
    cartVm.customerOrderDeliverySelectPickup = customerOrderDeliverySelectPickup;
    cartVm.currentCurrency = getCurrentCurrency();
    cartVm.openEditModal = openEditModal;
    cartVm.slickSettings = {
      infinite: false,
      lazyLoad: 'progressive',
      responsive: [
        {
          breakpoint: 320,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 6
          }
        }
      ]
    };

    init();

    function init() {
      cartVm.cart = $auth.user.customer_order;
      cartVm.total = calculateTotal();
      cartVm.billingAddresses = billingAddresses;
      cartVm.addresses = deliveryAddresses;
      cartVm.slickFlag = true; // https://github.com/devmark/angular-slick-carousel#slide-data
      getDeliveryMethods();
    }

    function saveNewBillingAddress(){
      if ($scope.billingAddressesVm.form.$valid) {
        BillingAddressesService.createBillingAddress(
          $scope.billingAddressesVm.billingAddress
        ).then(function success(resp){
          cartVm.billingAddresses.push(resp.customer_billing_address); //jshint ignore:line
          closeModal().then(showCheckoutModal);
        }, function(error){
          $scope.billingAddressesVm.messages = error.data.errors;
        });
      }
    }

    function saveNewAddress(){
      if (!performingPost && $scope.pfaVm.addressForm.$valid) {
        performingPost = true;
        ProfileAddressesService.createAddresses(
          $scope.pfaVm.addressFormData
        ).then(function(response){
          var newCustomerAddress = response.customer_address; //jshint ignore:line
          cartVm.addresses.push(newCustomerAddress);
          assignAddress(newCustomerAddress);
          if (cartVm.providerProfile) {
            // AKA if editing order delivery
            submitCustomerOrderDelivery(cartVm.providerProfile)
              .then(clearCurrentOrderDelivery);
          }
          setAddressInEmptyDeliveries(newCustomerAddress);
          closeModal().then(function (){
            performingPost = false;
          });
        }, function(error){
          $scope.pfaVm.messages = error.errors;
        });
      }
    }

    function setAddressInEmptyDeliveries(newCustomerAddress){
      angular.forEach(
        cartVm.cart.provider_profiles,
        function (providerProfile){
          var delivery = providerProfile.customer_order_delivery,
              isShipping = delivery.delivery_method === 'shipping',
              withoutAddress = delivery.customer_address_id === null;
          if (isShipping && withoutAddress) {
            setAddressInProviderProfile(
              newCustomerAddress,
              providerProfile
            );
            submitCustomerOrderDelivery(providerProfile);
          }
        }
      );
    }

    function updateAddress(){
      if ($scope.pfaVm.addressForm.$valid) {
        ProfileAddressesService.updateAddresses(
          $scope.pfaVm.addressFormData
        ).then(function (response){
          var newAddress = response.customer_address,
              oldAddress = cartVm.addresses.find(function (address){
            return address.id === newAddress.id;
          });
          angular.merge(oldAddress, newAddress);
          closeModal();
        }, function(error){
          $scope.pfaVm.messages = error.errors;
        });
      }
    }

    function showCheckoutModal() {
      if (needsToAddDeliveryAddress()) {
        customerOrderDeliveryNewAddress();
      } else {
        prepareForModal();
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/cart/checkout.html'
        });
      }
    }

    function prepareForModal(){
      cartVm.checkoutForm = {
        forma_de_pago: 'efectivo' // only method supported ATM
      };
      if (cartVm.billingAddresses.length === 0) {
        chooseAnonBillingAddress();
      } else if (cartVm.billingAddresses.length === 1) {
        assignBillingAddress(cartVm.billingAddresses[0]);
      }
    }

    function closeModal() {
      clearData();
      return ModalService.closeModal();
    }

    function clearData() {
      cartVm.checkoutForm = {};
      cartVm.messages = {};
      cartVm.updateErrors = {};
      cartVm.currentItem = null;
      $scope.billingAddressesVm = {};
      $scope.pfaVm = {};
    }

    function runCheckout() {
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
      CartService.checkout(cartVm.checkoutForm)
        .then(function success(response) {
          nextViewIsRoot();
          $state.go('app.customerorders.show', {
            id: response.customer_order.id,
            customerOrder: response.customer_order
          }).then(function () {
              $auth.user.customer_order = null;
              $ionicPopup.alert({
                title: 'Alerta',
                template: '{{::("cart.successfullyOrder"|translate)}}'
              }).then(closeModal);
            });
        }, function error(res) {
          $ionicLoading.hide();
          if (res && res.errors) {
            cartVm.messages = res.errors;
          } else {
            var message = '{{::("globals.pleaseTryAgain"|translate)}}';
            $ionicPopup.alert({
              title: 'Error',
              template: message
            });
          }
        });
    }

    function assignBillingAddress(billingAddress) {
      selectItem(cartVm.billingAddresses, billingAddress);
      if (billingAddress) {
        cartVm.checkoutForm.anon_billing_address = null;
        cartVm.checkoutForm.customer_billing_address_id = billingAddress.id;
      }
    }

    function assignAddress(address) {
      selectItem(cartVm.addresses, address);
      if (cartVm.providerProfile) {
        // AKA when editing
        setAddressInProviderProfile(
          address,
          cartVm.providerProfile
        );
      }
    }

    function setAddressInProviderProfile(address,
                                         providerProfile){
      providerProfile.customer_order_delivery.delivery_method = 'shipping'; // jshint ignore:line
      providerProfile.customer_order_delivery.customer_address_id = address.id;
    }

    function selectItem(items, item) {
      angular.forEach(items, function (elem) {
        elem.selected = false;
      });
      if (item) {
        item.selected = true;
      }
    }

    function calculateTotal() {
      var totalCents = 0;

      if (cartVm.cart && cartVm.cart.provider_profiles) {
        angular.forEach(cartVm.cart.provider_profiles, function (provider) {
          totalCents = totalCents + getTotalValueItems(provider);
        });
      }
      return totalCents;
    }

    function getTotalValueItems(provider) {
      var total = 0;
      if(provider.customer_order_items) {
        angular.forEach(provider.customer_order_items, function (item) {
          total = total + (item.provider_item_precio_cents * item.cantidad);
        });
      }
      return total;
    }

    function clearDeliveryTime(){
      cartVm.providerProfile.customer_order_delivery.deliver_at = null;
    }

    function getDeliveryMethods(){
      var methodsKeys, translationMapping, translationKeys;
      methodsKeys = APP.deliveryMethods;
      translationMapping = methodsKeys.reduce(function (memo, method) {
        memo['cart.deliveryMethods.' + method] = method;
        return memo;
      }, {});
      translationKeys = Object.keys(translationMapping);
      $translate(translationKeys).then(function (translations) {
        var formattedMethods = translationKeys.map(function (translationKey) {
          return {
            value: translationMapping[translationKey],
            label: translations[translationKey]
          };
        });
        cartVm.formattedDeliveryMethods = formattedMethods;
      });
    }

    function openEditModal(item){
      cartVm.currentItem = angular.copy(item);
      // jshint ignore:start

      cartVm.counterOptions = {
        cantidad: cartVm.currentItem.cantidad,
        providerItem: cartVm.currentItem.provider_item,
        priceCents: cartVm.currentItem.provider_item_precio_cents,
        currencyCode: cartVm.currentItem.provider_item_precio_currency,
        onChangeValue: function (data) {
          cartVm.currentItem.cantidad = data.itemsCount;
        }
      };
      // jshint ignore:end
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/cart/order-item.html',
        backdropClickToClose: true,
        focusFirstInput: false
      });
    }

    function updateOrderItem(){
      cartVm.slickFlag = false;
      CartService.updateOrderItem(cartVm.currentItem).then(function(response){
        $auth.user.customer_order = response.customer_order; //jshint ignore:line
        cartVm.cart = response.customer_order; //jshint ignore:line
        cartVm.total = calculateTotal();
        cartVm.slickFlag = true;
        closeModal();
      }, function(errorResponse){
        cartVm.updateErrors = errorResponse.errors;
      });
    }

    function removeOrderItem(item){
      cartVm.slickFlag = false;
      CartService.removeOrderItem(item).then(function success(resp){
        $auth.user.customer_order = resp.data.customer_order;  //jshint ignore:line
        cartVm.cart=resp.data.customer_order;
        cartVm.total= calculateTotal();
        cartVm.slickFlag = true;
        $scope.$emit('update-number');
        closeModal();
        if( CartService.isCartEmpty(cartVm.cart) ){
          nextViewIsRoot();
          $state.go(APP.successState);
        }
      });
    }

    function CustomerOrderDeliverySelect(){
      angular.forEach(cartVm.addresses, function (elem) {
        if (elem.id==cartVm.providerProfile.customer_order_delivery.customer_address_id){ //jshint ignore:line
          selectItem(cartVm.addresses, elem);
          return;
        }
      });
    }

    function showCustomerOrderDelivery(providerProfile){
      cartVm.providerProfile = angular.copy(providerProfile);
      if (providerProfile.customer_order_delivery.deliver_at){ //jshint ignore:line
        cartVm.providerProfile.customer_order_delivery.deliver_at = new Date(providerProfile.customer_order_delivery.deliver_at); //jshint ignore:line
      }
      cartVm.CustomerOrderDeliverySelect();
      ModalService.showModal({
        parentScope: $scope,
        backdropClickToClose: true,
        fromTemplateUrl: 'templates/cart/customer-order-delivery-modal.html',
      });
    }

    function submitCustomerOrderDelivery(providerProfile) {
      $ionicLoading.show({
        template: '{{::("globals.updating"|translate)}}'
      });
      return CustomerOrderDeliveryService.updateCustomerOrderDelivery(
        providerProfile.customer_order_delivery //jshint ignore:line
      ).then(function success(resp){
        $ionicLoading.hide().then(function(){
          $auth.user.customer_order = resp.customer_order; //jshint ignore:line
          init();
          closeModal();
        });
      }, function error(res) {
        $ionicLoading.hide();
        if (res && res.data.errors ) {
          cartVm.messages = res.data.errors;
        } else {
          var message = '{{::("globals.pleaseTryAgain"|translate)}}';
          $ionicPopup.alert({
            title: 'Error',
            template: message
          });
        }
      });
    }

    function customerOrderDeliverySelectPickup(){
      selectItem(cartVm.addresses);
      cartVm.providerProfile.customer_order_delivery.customer_address_id = null;
      cartVm.providerProfile.customer_order_delivery.delivery_method = 'pickup';
    }

    function customerOrderDeliveryNewAddress(){
      closeModal().then(function(){
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

    function nextViewIsRoot(){
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
    }

    function anyDeliveryIsShipping(){
      return cartVm.cart.provider_profiles.some(function (providerProfile){
        return providerProfile.customer_order_delivery.delivery_method === 'shipping'; // jshint ignore:line
      });
    }

    function needsToAddDeliveryAddress(){
      return cartVm.addresses.length === 0 && anyDeliveryIsShipping();
    }

    function chooseAnonBillingAddress(){
      cartVm.checkoutForm.anon_billing_address = true;
      assignBillingAddress(null);
    }

    function checkoutFormAddBillingAddress(){
      closeModal().then(function(){
        $scope.billingAddressesVm = {
          billingAddress: initBillingAddress(),
          closeModal: closeModal,
          submitModal: saveNewBillingAddress
        };
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/billing-addresses/new-edit.html'
        });
      });
    }

    function initBillingAddress() {
      var billingAddress = {};
      billingAddress.email = $auth.user.email;
      billingAddress.ciudad = $auth.user.ciudad;
      if ($auth.user.provider_profile){ // jshint ignore:line
        billingAddress.ruc = $auth.user.provider_profile.ruc;// jshint ignore:line
        billingAddress.razon_social = $auth.user.provider_profile.razon_social;// jshint ignore:line
        billingAddress.telefono = $auth.user.provider_profile.telefono;// jshint ignore:line
      }
      return billingAddress;
    }

    function clearCurrentOrderDelivery(){
      cartVm.providerProfile = null;
    }

    function editCustomerOrderDeliveryAddress(customerAddress) {
      closeModal().then(function(){
        $scope.pfaVm = {
          closeModal: closeModal,
          processAddress: updateAddress,
          addressFormData: angular.copy(customerAddress)
        };
        ModalService.showModal({
          parentScope: $scope,
          fromTemplateUrl: 'templates/profile/addresses/modal-form.html'
        });
      });
    }

    function getCurrentCurrency(){
      // jshint ignore:start
      if (cartVm.cart && cartVm.cart.subtotal_items_currency) {
        return cartVm.cart.subtotal_items_currency;
      } else {
        return $auth.user.current_place.currency_iso_code;
      }
      // jshint ignore:end
    }
  }
})();
