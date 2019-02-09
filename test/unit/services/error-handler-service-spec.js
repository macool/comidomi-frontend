(function () {
  'use strict';

  describe('ErrorHandlerService', function () {
    var service,
      $ionicPopup,
      $ionicLoading;

    beforeEach(module('porttare.services'));
    beforeEach(module('porttare.services', function ($provide) {
      $provide.factory('$ionicPopup', function () {
        return {
          alert: sinon.stub()
        };
      });
      $provide.factory('$ionicLoading', function () {
        return {
          show: sinon.stub(),
          hide: sinon.stub()
        };
      });
    }));

    beforeEach(inject(function (_ErrorHandlerService_, _$ionicPopup_, _$ionicLoading_) {
      service = _ErrorHandlerService_;
      $ionicPopup = _$ionicPopup_;
      $ionicLoading = _$ionicLoading_;
    }));

    it('Should hide loading', function () {
      service.handleCommonErrorGET({status: 411});
      sinon.assert.calledOnce($ionicLoading.hide);
    });

    it('Should show a message in popup', function () {
      service.handleCommonErrorGET({status: 411, error: 'test message'});
      sinon.assert.calledOnce($ionicPopup.alert);
      sinon.assert.calledWithExactly($ionicPopup.alert, {
        title: 'Error',
        template: 'test message'
      });
    });

    it('Should show a default message in popup', function () {
      service.handleCommonErrorGET({status: 411});
      sinon.assert.calledOnce($ionicPopup.alert);
      sinon.assert.calledWithExactly($ionicPopup.alert, {
        title: 'Error',
        template: '{{::("globals.pleaseTryAgain"|translate)}}'
      });
    });

    it('Should not excecute on 401', function () {
      service.handleCommonErrorGET({status: 401});
      sinon.assert.notCalled($ionicPopup.alert);
    });
  });
})();
