(function () {
  'use strict';
  /*jshint camelcase:false */
  describe('ProfileUpdateAddressesController', function () {
    var ctrl,
      $controller,
      dependencies,
      ProfileAddressesService,
      $rootScope,
      localData;

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

      $rootScope = _$rootScope_;
      $controller = _$controller_;
      ProfileAddressesService = _ProfileAddressesService_;
      localData = {
        nombre: 'test 1',
        id: '1'
      };

      dependencies = {
        data: localData,
        ProfileAddressesService: ProfileAddressesService
      };
      ctrl = $controller('ProfileUpdateAddressesController', dependencies);
    }));

    it('Should add data to scope', function () {
      expect(ctrl.addressFormData).to.equal(localData);
      expect(ctrl.inUpdateMode).to.be.equal(true);
    });

    describe('Update address', function () {
      it('Should call to createAddresses', function () {
        ctrl.addressFormData = {
          id: '1',
          nombre: 'test2',
          direccion_uno: 'test'
        };
        var options = {
          acionName: 'update',
          data: ctrl.addressFormData
        };
        ctrl.processAddress();
        sinon.assert.calledOnce(ProfileAddressesService.runAction);
        sinon.assert.calledWithExactly(ProfileAddressesService.runAction, options);
      });
    });

  });
})();
