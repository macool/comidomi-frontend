(function () {
  'use strict';

  describe('ProductsController', function () {
    var ctrl,
      $q,
      $controller,
      dependencies,
      deferGetProducts,
      $scope,
      ProductsService;

    beforeEach(module('porttare.controllers'));
    beforeEach(module('porttare.services', function($provide){
      $provide.factory('ProductsService', function(){
        return {
          getProducts: function(){
            deferGetProducts = $q.defer();
            return deferGetProducts.promise;
          }
        };
      });
    }));

    beforeEach(inject(
      function (_$q_,
        _$rootScope_,
        _ProductsService_,
        _$controller_) {
        $scope = _$rootScope_;
        $q = _$q_;
        deferGetProducts = $q.defer();
        ProductsService = _ProductsService_;
        $controller = _$controller_;
      })
    );

    beforeEach(function () {
      dependencies = {
        ProductsService: ProductsService,
      };

      ctrl = $controller('ProductsController', dependencies);
    });

    describe('on init', function () {
      it('query should be empty', function () {
        expect(ctrl.query).to.equal('');
      });
      it('ProductsService response should be assigned to controller var', function(){
        var data = {products: []};
        deferGetProducts.resolve(data);
        $scope.$digest();
        expect(ctrl.products).to.equal(data.products);
      });

    });

  });
})();
