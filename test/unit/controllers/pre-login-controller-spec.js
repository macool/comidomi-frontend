(function () {
  'use strict';

  describe('PreController', function () {
    var $rootScope,
        controller,
        deferredLogin,
        deferredAuth,
        $auth,
        $state,
        $ionicPopup,
        $window,
        SessionService,
        $localStorage,
        $location,
        deferLoginWithFB,
        APP;

    beforeEach(module('porttare.controllers'));

    beforeEach(inject(
      function ($q,
                $rootScope,
                _$window_) {

      deferredLogin     = $q.defer();
      deferLoginWithFB  = $q.defer();
      deferredAuth  = $q.defer();
      $ionicPopup       = {
        alert: sinon.stub().returns(deferredLogin.promise),
        show: sinon.stub().returns(deferredLogin.promise)
      };
      $window           = _$window_;
      $localStorage     = {
        getItem: sinon.stub().returns(true)
      };
      $auth = {
        validateUser: function() {
          return deferredAuth.promise;
        }
      };
      $location = {
        absUrl: function(){
          return 'http://localhost:8100/?error=access_denied&error_code=200';
        }
      };
      SessionService = {
        loginWithFB: sinon.stub().returns(deferLoginWithFB.promise)
      };
      APP = {
        successState: 'app.categories.index'
      };
    }));

    describe('#load', function() {

      beforeEach(inject(function(_$rootScope_, $controller) {
        controller = $controller('PreController', {
          '$auth': $auth,
          '$state': $state,
          '$ionicPopup': $ionicPopup,
          '$localStorage': $localStorage,
          'SessionService': SessionService,
          '$location': $location,
          'APP': APP
        });
        $rootScope = _$rootScope_;
      }));

      describe('when the login with Facebook is executed,', function() {
        it('if unsuccessful, should show a popup', function() {
          deferredAuth.reject();
          $rootScope.$digest();
          sinon.assert.calledOnce($ionicPopup.alert);
        });

      });

    });
  });
})();
