(function () {
  'use strict';

  describe('LoginController', function () {
    var $rootScope,
        controller,
        deferredLogin,
        $auth,
        $state,
        $scope,
        $ionicPopup,
        $ionicHistory,
        $window,
        $ionicLoading,
        $localStorage,
        deferredLogout,
        SessionService,
        deferLoginWithFB,
        APP;

    beforeEach(module('porttare.controllers'));

    beforeEach(inject(
      function ($q,
                $rootScope,
                _$window_) {

      deferredLogin     = $q.defer();
      deferredLogout    = $q.defer();
      deferLoginWithFB  = $q.defer();
      $ionicPopup       = {
        alert: sinon.stub().returns(deferredLogin.promise),
        show: sinon.stub().returns(deferredLogin.promise)
      };
      $ionicHistory     = {
        clearHistory: sinon.stub()
      };
      $ionicLoading     = { show: sinon.stub(), hide: sinon.stub()};
      $state            = { go: sinon.stub().returns($q.defer().promise) };
      $auth             = {
        user: {current_place: {}}, //jshint ignore:line
        submitLogin: sinon.stub()
                          .returns(deferredLogin.promise),
        validateUser: sinon.stub()
                          .returns(deferredLogin.promise),
        signOut: sinon.stub()
                          .returns(deferredLogout.promise)
      };
      $window           = _$window_;
      SessionService = {
        logOut: sinon.stub().returns($auth.signOut()),
        loginWithFB: sinon.stub().returns(deferLoginWithFB.promise)
      };
      APP = {
        successState: 'app.categories.index',
        preloginState: 'prelogin'
      };
      $localStorage = {
        setItem:sinon.stub(),
        removeItem: sinon.stub()
      };
    }));

    describe('#login', function() {

      beforeEach(inject(function(_$rootScope_, $controller) {
        controller = $controller('LoginController', {
          '$ionicPopup': $ionicPopup,
          '$ionicLoading': $ionicLoading,
          '$ionicHistory': $ionicHistory,
          '$state': $state,
          '$auth': $auth,
          '$window': $window,
          '$scope': $scope,
          'SessionService': SessionService,
          'APP': APP,
          '$localStorage': $localStorage
        });
        $rootScope = _$rootScope_;
        $window.localStorage.setItem('hasViewedTutorial','true');
        controller.loginForm.email = 'test1';
        controller.loginForm.password = 'password1';
        controller.login();
      }));

      it('should call submitLogin on authService', function() {
        sinon.assert.alwaysCalledWithExactly($auth.submitLogin, {
          email: 'test1',
          password: 'password1'
        });
      });

      describe('when the login is executed,', function() {
        var successState = 'app.categories.index';

        it('if successful, should change state', function() {
          deferredLogin.resolve();
          $rootScope.$digest();

          sinon.assert.alwaysCalledWithExactly($state.go, $auth.user.current_place ? successState:'app.places.index'); //jshint ignore:line
        });

        it('if unsuccessful, should show a popup', function() {
          $rootScope.$emit('auth:login-error', { errors: [] });
          $rootScope.$digest();

          sinon.assert.calledOnce($ionicPopup.alert);
        });

      });

    });

    describe('#logout', function () {
      beforeEach(inject(function (_$rootScope_, $controller) {
        controller = $controller('LoginController', {
          '$ionicPopup': $ionicPopup,
          '$ionicLoading': $ionicLoading,
          '$state': $state,
          '$auth': $auth,
          '$ionicHistory': $ionicHistory,
          '$scope': $scope,
          'SessionService': SessionService,
          'APP': APP,
          '$localStorage': $localStorage
        });
        $rootScope = _$rootScope_;
        controller.logout();
      }));

      it('should call signOut on authService', function () {
        sinon.assert.calledOnce($auth.signOut);
      });

      describe('when the logout is executed,', function () {
        var preloginState = 'prelogin';

        it('should show loading', function () {
          sinon.assert.calledOnce($ionicLoading.show);
        });

        it('if successful, should clear history', function () {
          deferredLogout.resolve();
          $rootScope.$digest();
          sinon.assert.calledOnce($ionicHistory.clearHistory);
        });

        it('if successful, should change state', function () {
          deferredLogout.resolve();
          $rootScope.$digest();

          sinon.assert.calledWithExactly($state.go,
            preloginState,
            {},
            { location: 'replace' });
        });

        it('if unsuccessful, should show a popup', function () {
          deferredLogout.reject({ errors: [] });
          $rootScope.$digest();
          sinon.assert.calledOnce($ionicPopup.alert);
        });

      });

    });
  });
})();
