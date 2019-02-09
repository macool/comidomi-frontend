(function () {
  'use strict';
  /*jshint camelcase:false */
  describe('CartController', function () {
    var ctrl,
      $q,
      $controller,
      dependencies,
      $scope,
      $state,
      CartService,
      ModalService,
      $ionicLoading,
      $ionicHistory,
      deferCheckout,
      deferAddress,
      deferBilling,
      deferStateGo,
      $auth,
      $ionicPopup,
      $translate,
      translateDeferred,
      billingAddresses,
      deliveryAddresses,
      CustomerOrderDeliveryService;

    beforeEach(module('porttare.controllers'));
    beforeEach(module('porttare.services', function ($provide) {
      $provide.factory('CartService', function ($q) {
        deferCheckout = $q.defer();
        return {
          checkout: sinon.stub().returns(deferCheckout.promise)
        };
      });
      $provide.factory('BillingAddressesService', function ($q) {
        deferBilling = $q.defer();
        return {
          createBillingAddress: sinon.stub().returns(deferBilling.promise)
        };
      });
      $provide.factory('ProfileAddressesService', function ($q) {
        deferAddress = $q.defer();
        return {
          createAddresses: sinon.stub().returns(deferAddress.promise)
        };
      });
      $provide.factory('$auth', function () {
        return {
          user: {
            customer_order: [],
            current_place: { currency_iso_code: 'USD' }
          }
        };
      });
      $provide.factory('ModalService', function () {
        return {
          showModal: sinon.stub(),
          closeModal: sinon.stub()
        };
      });
      $provide.factory('CustomerOrderDeliveryService', function () {
        return {};
      });
      $provide.value('APP', {
        deliveryMethods: []
      });
      $provide.factory('$ionicLoading', function () {
        return {
          show: sinon.stub(),
          hide: sinon.stub()
        };
      });
      $provide.factory('$ionicPopup', function ($q) {
        return {
          alert: sinon.stub().returns($q.defer().promise)
        };
      });
      $provide.factory('$state', function ($q) {
        deferStateGo = $q.defer();
        return {
          go: sinon.stub().returns(deferStateGo.promise)
        };
      });
      $provide.factory('$translate', function ($q) {
        translateDeferred = $q.defer();
        return sinon.stub().returns(translateDeferred.promise);
      });
      $provide.factory('$ionicHistory', function(){
        return {
          nextViewOptions: sinon.stub()
        };
      });
    }));

    beforeEach(inject(function (_$q_, _$rootScope_, _$controller_,
      _CartService_, _$ionicPopup_,
      _$state_, _ModalService_, _$ionicLoading_, _$ionicHistory_, _$auth_, _APP_, _$translate_, _CustomerOrderDeliveryService_) {

      $scope = _$rootScope_.$new();
      $q = _$q_;
      $controller = _$controller_;
      $state = _$state_;
      CartService = _CartService_;
      ModalService = _ModalService_;
      deliveryAddresses = [1,2,3];
      billingAddresses = [1,2,3];
      $ionicLoading = _$ionicLoading_;
      $auth = _$auth_;
      $ionicPopup= _$ionicPopup_;
      $translate = _$translate_;
      CustomerOrderDeliveryService = _CustomerOrderDeliveryService_;
      $ionicHistory = _$ionicHistory_;

      dependencies = {
        $scope: $scope,
        CartService: CartService,
        ModalService: ModalService,
        $ionicPopup: $ionicPopup,
        $state: $state,
        $ionicLoading: $ionicLoading,
        $ionicHistory: $ionicHistory,
        $auth: $auth,
        CustomerOrderDeliveryService: CustomerOrderDeliveryService,
        deliveryAddresses: deliveryAddresses,
        billingAddresses: billingAddresses,
        APP: _APP_,
        $q: _$q_
      };

      ctrl = $controller('CartController', dependencies);
    }));

    describe('Order checkout', function () {
      it('Should start loading', function () {
        ctrl.runCheckout();
        sinon.assert.calledOnce($ionicLoading.show);

      });
      it('Should run checkout', function () {
        sinon.spy($scope, '$emit');
        ctrl.runCheckout();
        deferCheckout.resolve({customer_order: {id: null}});
        $scope.$digest();
        sinon.assert.calledOnce($state.go);
      });
      it('Should run checkout', function () {
        ctrl.runCheckout();
        deferCheckout.resolve({customer_order: {id: null}});
        $scope.$digest();
        deferStateGo.resolve();
        $scope.$digest();
        expect($auth.user.customer_order).to.be.equal(null);
        sinon.assert.calledOnce($ionicPopup.alert);
      });
    });
  });
})();
