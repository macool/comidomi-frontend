(function () {
  'use strict';
  /*jshint camelcase:false */
  describe('ProfileCreateAddressesController', function () {
    var ctrl,
      $controller,
      dependencies,
      ProfileAddressesService,
      $rootScope;

    beforeEach(module('porttare.controllers'));
    beforeEach(angular.mock.module(function ($provide) {
      $provide.factory('ProfileAddressesService', function ($q) {
        return {
          runAction: sinon.stub().returns($q.defer().promise),
        };
      });
    }));

    beforeEach(inject(function (_$rootScope_,
                                _$controller_,
                                _ProfileAddressesService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      ProfileAddressesService = _ProfileAddressesService_;

      dependencies = {
        ProfileAddressesService: ProfileAddressesService
      };
      ctrl = $controller('ProfileCreateAddressesController', dependencies);
    }));

    it('Should add data to scope', function () {
      expect(ctrl.addressFormData).to.deep.equal({});
    });

   describe('Create address', function () {
      it('Should call to createAddresses', function () {
        ctrl.addressFormData = {
          nombre: 'test2',
          direccion_uno: 'test'
        };
        var options = {
          acionName: 'create',
          data: ctrl.addressFormData
        };
        ctrl.processAddress();
        sinon.assert.calledOnce(ProfileAddressesService.runAction);
        sinon.assert.calledWithExactly(ProfileAddressesService.runAction, options);
      });
    });

  });
})();
