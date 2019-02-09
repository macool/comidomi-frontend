(function () {
  'use strict';

  describe('RegisterController', function () {
    var $rootScope,
        controller,
        deferredRegister,
        $auth,
        $state,
        $ionicPopup,
        deferredStateGo,
        $scope,
        $ionicLoading,
        SessionService,
        deferLoginWithFB,
        APP;

    beforeEach(module('porttare.controllers'));

    beforeEach(inject(
      function ($q,
                _$rootScope_,
                $controller) {

      deferredRegister  = $q.defer();
      deferredStateGo   = $q.defer();
      deferLoginWithFB  = $q.defer();
      $ionicPopup       = { alert: sinon.stub() };
      $ionicLoading     = { show: sinon.stub(), hide: sinon.stub()};
      $state            = { go: sinon.stub().returns(deferredStateGo.promise) };
      $auth             = {
        submitRegistration: sinon.stub()
                          .returns(deferredRegister.promise)
      };
      SessionService = {
        loginWithFB: sinon.stub().returns(deferLoginWithFB.promise)
      };
      $rootScope = _$rootScope_;
      $scope            = $rootScope.$new();
      APP = {
        placesState: 'places-state'
      };

      controller = $controller('RegisterController', {
        '$ionicPopup': $ionicPopup,
        '$ionicLoading': $ionicLoading,
        '$state': $state,
        '$auth': $auth,
        '$scope': $scope,
        'SessionService': SessionService,
        'APP': APP
      });
    }));

    describe('#register', function() {

      beforeEach(inject(function() {
        controller.registerForm = {
          $invalid: false,
          $setPristine: function() {
            return true;
          },
          $setUntouched: function() {
            return true;
          }
        };
        controller.register();
      }));

      it('ionicLoading.show should be called', function() {
        sinon.assert.calledOnce($ionicLoading.show);
      });

      describe('when the register is executed,', function() {

        it('if successful, should change state', function() {
          deferredRegister.resolve();
          $rootScope.$digest();

          sinon.assert.alwaysCalledWithExactly($state.go, APP.placesState);

          deferredStateGo.resolve();
          $rootScope.$digest();
          sinon.assert.calledOnce($ionicLoading.hide);
        });
      });
    });
  });
})();
