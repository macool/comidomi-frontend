(function () {
  'use strict';

  describe('ErrorController', function () {
    var ctrl,
      dependencies,
      $controller,
      $window,
      $location,
      $scope;

    beforeEach(module('porttare.controllers'));
    beforeEach(inject(function (_$rootScope_,
      _$controller_) {
      $scope = _$rootScope_.$new();
      $controller = _$controller_;
      $window = {
        location: {
          assign: sinon.stub()
        }
      };
      $location = {
        absUrl: function () {
          return 'https://porttare-frontend.herokuapp.com/?error=error+message#/error';
        }
      };
    })
    );

    beforeEach(function () {
      dependencies = {
        $window: $window,
        $location: $location
      };

      ctrl = $controller('ErrorController', dependencies);
    });

    describe('On init', function () {

      it('should get the error message from url', function () {
        $scope.$digest();
        expect(ctrl.message).to.equal('error message');
      });

    });

    describe('When click on button', function () {

      it('should redirect to home', function () {
        ctrl.redirectToHome();
        $scope.$digest();
        sinon.assert.alwaysCalledWithExactly($window.location.assign, '/');
      });

    });
  });
})();
