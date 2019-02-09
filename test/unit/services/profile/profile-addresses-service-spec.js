(function () {
  'use strict';
  /*jshint camelcase:false */
  describe('ProfileAddressesService', function () {
    var service,
      $httpBackend,
      ENV,
      $state,
      $ionicLoading,
      deferStateGo,
      ErrorHandlerService,
      $rootScope;

    beforeEach(module('porttare.services'));
    beforeEach(module('porttare.services', function ($provide) {
      $provide.constant('ENV', {
        name: 'development',
        apiHost: 'http://localhost:3785'
      });
      $provide.factory('$ionicLoading', function () {
        return {
          show: sinon.stub(),
          hide: sinon.stub()
        };
      });
      $provide.factory('$state', function ($q) {
        deferStateGo = $q.defer();
        return {
          go: sinon.stub().returns(deferStateGo.promise)
        };
      });
      $provide.factory('ErrorHandlerService', function () {
        return {
          handleCommonErrorGET: sinon.stub()
        };
      });
    }));

    beforeEach(inject(function (_ProfileAddressesService_,
                                _$httpBackend_,
                                _ENV_,
                                _ErrorHandlerService_,
                                _$ionicLoading_,
                                _$state_,
                                _$rootScope_) {
                                $rootScope = _$rootScope_;
                                service = _ProfileAddressesService_;
                                $state = _$state_;
                                $ionicLoading = _$ionicLoading_;
                                ErrorHandlerService = _ErrorHandlerService_;
                                ENV = _ENV_;
                                $httpBackend = _$httpBackend_;
    }));

    describe('Get addresses', function () {
      var resData = null;
      beforeEach(function () {
        resData = {
          'customer_addresses': [{
            'id': 1,
            'nombre': 'Departamento',
            'ciudad': 'Quito',
            'parroquia': 'Quito',
            'barrio': 'Cumbayá',
            'direccion_uno': 'Calle Miguel Ángel',
            'direccion_dos': 'Lorem Impusm',
            'codigo_postal': '124455',
            'numero_convencional': '2342-5678',
            'referencia': 'Cerca a la cuchara, casa de 2 pisos amarilla'
          }, {
            'id': 2,
            'nombre': 'Casa',
            'ciudad': 'Quito',
            'parroquia': 'Quito',
            'barrio': 'Cumbayá',
            'direccion_uno': 'Calle Miguel Ángel',
            'direccion_dos': 'Lorem Impusm',
            'codigo_postal': '124455',
            'numero_convencional': '2342-4444',
            'referencia': 'Lorem Impusm'
          }]
        };
        var expectedUrl = ENV.apiHost + '/api/customer/addresses';
        $httpBackend.expectGET(expectedUrl).respond(resData);
      });

      it('should get all addresses', function () {
        service.getAddresses().then(function (customer_addresses) {
          expect(customer_addresses).to.be.an('array');
          expect(customer_addresses.length).to.be.equal(2);
        });
        $httpBackend.flush();
      });
    });

    describe('Get address', function () {
      var resData = null;
      beforeEach(function () {
        resData = {
          'customer_address': {
            'id': 2,
            'nombre': 'Casa',
            'ciudad': 'Quito',
            'parroquia': 'Quito',
            'barrio': 'Cumbayá',
            'direccion_uno': 'Calle Miguel Ángel',
            'direccion_dos': 'Lorem Impusm',
            'codigo_postal': '124455',
            'numero_convencional': '2342-4444',
            'referencia': 'Lorem Impusm'
          }
        };
        var expectedUrl = ENV.apiHost + '/api/customer/addresses/2';
        $httpBackend.expectGET(expectedUrl).respond(resData);
      });

      it('should get an address', function () {
        var expectData = {
          'id': 2,
          'nombre': 'Casa',
          'ciudad': 'Quito',
          'parroquia': 'Quito',
          'barrio': 'Cumbayá',
          'direccion_uno': 'Calle Miguel Ángel',
          'direccion_dos': 'Lorem Impusm',
          'codigo_postal': '124455',
          'numero_convencional': '2342-4444',
          'referencia': 'Lorem Impusm'
        };
        service.getAddress('2').then(function (response) {
          expect(response).to.be.an('object');
          expect(response).to.deep.equal(expectData);
        });
        $httpBackend.flush();
      });
    });

    describe('Update address', function () {

      var address = null;
      beforeEach(function () {
        var id = 1;
        var expectedUrl = ENV.apiHost + '/api/customer/addresses/' + id;
        address = {
          'id': 1,
          'nombre': 'Casa',
          'ciudad': 'Quito',
          'parroquia': 'Quito',
          'barrio': 'Cumbayá',
          'direccion_uno': 'Calle Miguel Ángel',
          'direccion_dos': 'Lorem Impusm',
          'codigo_postal': '124455',
          'numero_convencional': '2342-4444',
          'referencia': 'Lorem Impusm'
        };

        $httpBackend.expectPUT(expectedUrl).respond(address);
      });

      it('should update an address', function () {
        service.updateAddresses(address).then(function (response) {
          expect(response).to.be.an('object');
          expect(response).to.deep.equal(address);
        });
        $httpBackend.flush();
      });

      it('Should start loading', function () {
        var options = {
          acionName: 'update',
          data: {}
        };

        service.runAction(options);
        sinon.assert.calledOnce($ionicLoading.show);
        sinon.assert.calledWithExactly($ionicLoading.show, {
          template: '{{::("globals.loading"|translate)}}'
        });
      });

      it('On success: should redirect', function () {
        var addressListState = 'app.profile.addresses.index';
        var options = {
          acionName: 'update',
          data: {
            id: '1',
            nombre: 'test2',
            direccion_uno: 'test'
          }
        };
        service.runAction(options);
        $httpBackend.flush();
        sinon.assert.calledOnce($state.go);
        sinon.assert.calledWithExactly($state.go, addressListState);
      });

    });

    describe('Create address', function () {

      var address = null;
      beforeEach(function () {
        var expectedUrl = ENV.apiHost + '/api/customer/addresses';
        address = {
          'nombre': 'Casa',
          'ciudad': 'Quito',
          'parroquia': 'Quito',
          'barrio': 'Cumbayá',
          'direccion_uno': 'Calle Miguel Ángel',
          'direccion_dos': 'Lorem Impusm',
          'codigo_postal': '124455',
          'numero_convencional': '2342-4444',
          'referencia': 'Lorem Impusm'
        };
        var expectData = address;
        expectData.id = '1';
        $httpBackend.expectPOST(expectedUrl).respond(expectData);
      });

      it('should create a new address', function () {
        service.createAddresses(address).then(function (response) {
          expect(response).to.be.an('object');
          expect(response).to.deep.equal(address);
        });
        $httpBackend.flush();
      });

      it('On success: should redirect', function () {
        var addressListState = 'app.profile.addresses.index';
        var options = {
          acionName: 'create',
          data: {
            nombre: 'test1',
            direccion_uno: 'test'
          }
        };

        service.runAction(options);
        $httpBackend.flush();
        sinon.assert.calledOnce($state.go);
        sinon.assert.calledWithExactly($state.go, addressListState);
      });
    });
  });
})();
