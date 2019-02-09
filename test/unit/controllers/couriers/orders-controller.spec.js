(function () {
  'use strict';
  /*jshint camelcase:false */
  describe('OrdersController', function () {
    var ctrl,
      $controller,
      $rootScope,
      $scope,
      dependencies,
      deferCreateProvider,
      deferStateGo,
      deferTranslate;

    beforeEach(module('porttare.controllers'));

    beforeEach(module('porttare.controllers', function ($provide) {
      $provide.factory('$state', function(){
        return {
          go: sinon.stub()
        };
      });
    }));

    beforeEach(inject(
      function ($q,
                _$controller_,
                _$rootScope_,
                _$state_) {
        deferCreateProvider = $q.defer();
        deferStateGo = $q.defer();
        deferTranslate = $q.defer();
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        dependencies = {
          $state: _$state_,
          shippingRequests: []
        };
        ctrl = $controller('OrdersController', dependencies);
      })
    );

    describe('on load', function(){
      it('should controller.orders be the same of data', function(){
        chai.expect(ctrl.orders).to.deep.equals(dependencies.shippingRequests);
      });
    });

  });
})();
