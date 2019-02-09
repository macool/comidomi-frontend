(function () {
  'use strict';

  describe('ResetController', function () {
    var $rootScope,
      controller,
      deferredReset,
      deferredSendEmail,
      deferPasswordReset,
      $auth,
      $state,
      $ionicPopup,
      deferredStateGo,
      $ionicLoading,
      $window,
      APP,
      $scope;

    beforeEach(module('porttare.controllers'));

    beforeEach(inject(
      function ($q,
        $rootScope,
        $controller) {

        deferredReset = $q.defer();
        deferredStateGo = $q.defer();
        deferredSendEmail = $q.defer();
        deferPasswordReset = $q.defer();
        $ionicPopup = {
          alert: sinon.stub()
        };
        $ionicLoading = { show: sinon.stub(), hide: sinon.stub() };
        $state = {
          go: sinon.stub().returns(deferredStateGo.promise),
          href: sinon.stub().returns('#/app/category')
        };
        $auth = {
          updatePassword: sinon.stub()
            .returns(deferredReset.promise),
          requestPasswordReset: sinon.stub()
            .returns(deferredSendEmail.promise),
        };
        $window = {
          location: { href: '#/reset' }
        };
        APP = {
          successState: 'app.categories.index'
        };

        controller = $controller('ResetController', {
          '$ionicPopup': $ionicPopup,
          '$ionicLoading': $ionicLoading,
          '$state': $state,
          '$auth': $auth,
          '$window': $window,
          '$scope': $scope,
          'APP': APP
        });
      }));

    describe('#reset_password', function () {

      beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
        controller.updatePassword();
      }));

      it('ionicLoading.show should be called', function () {
        sinon.assert.calledOnce($ionicLoading.show);
      });

      describe('#resetPassword', function () {
        beforeEach(inject(function (_$rootScope_) {
          $rootScope = _$rootScope_;
          controller.resetPasswordForm.email = 'test1@test.com';
          controller.resetPassword();
        }));

        it('should call resetPassword on authService', function () {
          deferredSendEmail.resolve({ email: 'test1@test.com' });
          $rootScope.$digest();
          sinon.assert.alwaysCalledWithExactly($auth.requestPasswordReset, {
            email: 'test1@test.com'
          });
        });

        describe('when restore password is selected,', function () {
          var successMessage = 'Se enviaron las intrucciones al correo.';
          var loginState = 'login';

          it('if successful, should show a message', function () {
            deferredSendEmail.promise.then(function () {
              deferredStateGo.resolve();
            });
            deferredSendEmail.resolve();
            $rootScope.$digest();
            sinon.assert.calledWithExactly($state.go, loginState);
            sinon.assert.calledWithMatch($ionicLoading.show, {
              template: successMessage
            });

          });

          it('if unsuccessful, should show an alert', function () {
            deferredSendEmail.reject({ data: { errors: [] } });

            $rootScope.$digest();
            sinon.assert.calledOnce($ionicPopup.alert);
          });

        });
      });

      describe('when reset password is executed,', function () {
        var successState = 'app.categories.index';

        it('if successful, should change state', function () {
          deferredReset.resolve();
          $rootScope.$digest();
          $rootScope.$emit('auth:password-change-success');
          sinon.assert.alwaysCalledWithExactly($state.href, successState);
          expect($window.location.href).to.equal('/#/app/category');
        });

        it('if unsuccessful, should show a popup', function () {
          deferredReset.reject({ errors: [] });
          $rootScope.$digest();
          /*jshint camelcase: false */
          var res = {
            'success': false,
            'errors':{
              'password_confirmation':['no coincide'],
              'password':['es demasiado corto (8 caracteres mínimo)']
            }
          };
          $rootScope.$emit('auth:password-change-error', res);
          expect(controller.messages).to.equal(res.errors);
        });
      });
    });
  });
})();
