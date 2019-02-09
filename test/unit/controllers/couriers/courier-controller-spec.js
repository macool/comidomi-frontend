(function () {
  'use strict';

  describe('CourierController', function () {
    var ctrl,
      $controller,
      dependencies,
      $rootScope,
      $ionicLoading,
      CourierService,
      deferCreateCourier,
      ErrorHandlerService,
      deferStateGo,
      $state,
      $auth,
      $ionicPopup,
      stateRedirect,
      $ionicScrollDelegate,
      places;

    beforeEach(module('porttare.controllers'));

    beforeEach(inject(
      function ($q,
        _$controller_,
        _$rootScope_) {

        deferCreateCourier = $q.defer();
        deferStateGo = $q.defer();
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $ionicLoading = {
          show: sinon.stub(),
          hide: sinon.stub()
        };
        $state = {
          go: sinon.stub().returns(deferStateGo.promise)
        };
        $ionicPopup = {
          alert: sinon.stub()
        };
        $ionicScrollDelegate = {
          scrollTop: sinon.stub()
        };
        CourierService = {
          createNewCourier: sinon.stub().returns(deferCreateCourier.promise)
        };
        $auth = {
          user: {name:'', email:''}
        };
        ErrorHandlerService = {
          handleCommonErrorGET: sinon.stub()
        };
        stateRedirect = 'courier.orders';
        places = [ 0 ];
      })
    );

    describe('Manage options', function () {
      beforeEach(function () {
        dependencies = {
          $auth: $auth,
          $ionicLoading: $ionicLoading,
          $ionicPopup: $ionicPopup,
          $state: $state,
          $ionicScrollDelegate: $ionicScrollDelegate,
          ErrorHandlerService: ErrorHandlerService,
          CourierService: CourierService,
          places: places
        };

        ctrl = $controller('CourierController', dependencies);
      });

      it('should load array with options', function () {
        expect(ctrl.places).to.not.empty; //jshint ignore:line
        expect(ctrl.licenses).to.not.empty; //jshint ignore:line
        expect(ctrl.mobilization).to.not.empty; //jshint ignore:line
      });

      it('name and email should exist in authenticated user', function () {
        expect($auth.user.name).to.exist; //jshint ignore:line
        expect($auth.user.email).to.exist; //jshint ignore:line
      });

      it('names and email should not be empty', function () {
        chai.assert.isNotNull(ctrl.courier.nombres, 'exists!'); //jshint ignore:line
        chai.assert.isNotNull(ctrl.courier.email, 'exists!');
      });

    });

    describe('Create courier', function () {
      beforeEach(function () {
        dependencies = {
          $auth: $auth,
          $ionicLoading: $ionicLoading,
          $ionicPopup: $ionicPopup,
          $ionicScrollDelegate: $ionicScrollDelegate,
          $state: $state,
          CourierService: CourierService,
          places: places
        };

        ctrl = $controller('CourierController', dependencies);
      });

      beforeEach(inject(function () {
        ctrl.createCourier();
      }));

      it('ionicLoading.show should be called', function () {
        sinon.assert.calledOnce($ionicLoading.show);
      });

      it('if successful, ionicLoading.hide should be called', function () {
        deferCreateCourier.resolve({courier_profile: {}}); //jshint ignore:line
        $rootScope.$digest();
        sinon.assert.calledOnce($ionicLoading.hide);
      });

      it('if successful, should change state', function () {
        deferCreateCourier.resolve({courier_profile: {}}); //jshint ignore:line
        $rootScope.$digest();
        sinon.assert.alwaysCalledWithExactly($state.go, stateRedirect);
      });

      it('if successful, should show a alert', function () {
        deferCreateCourier.resolve({courier_profile: {}}); //jshint ignore:line
        $rootScope.$digest();
        deferStateGo.resolve();
        $rootScope.$digest();
        sinon.assert.calledOnce($ionicPopup.alert);
      });

      it('if unsuccessful by validation error, should create a object', function () {
        ctrl.messages = {};
        var backendErrors = {
          errors: [
            { field: 'message' }
          ]
        };
        deferCreateCourier.reject(backendErrors);
        $rootScope.$digest();
        expect(ctrl.messages).to.not.empty; //jshint ignore:line
      });

    });
  });
})();
