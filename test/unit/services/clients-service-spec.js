(function () {
  'use strict';

  describe('ClientsService', function () {
    var service, $httpBackend, ENV;

    beforeEach(module('porttare.services'));
    beforeEach(module('porttare.services', function ($provide) {

      $provide.constant('ENV', {
        name:'development',
        apiHost:'http://localhost:3785'
      });
    }));

    describe('Client service', function(){
      beforeEach(inject(
        function (_ClientsService_, _$httpBackend_, _ENV_) {
          ENV = _ENV_;
          $httpBackend = _$httpBackend_;
          service = _ClientsService_;
        })
      );

      it('should get all clients', function(){
        var expectedUrl = ENV.apiHost + '/api/provider/clients';
        var objectToRespond = {'provider_clients':[{}]};

        $httpBackend.expectGET(expectedUrl)
          .respond(objectToRespond);

        service.getClients().then(function(response){
          chai.assert.isArray(response, 'This is an object!');
          chai.expect(response.length).to.eq(1);
        });

        $httpBackend.flush();
      });

      it('should save a provider client', function(){
        var expectedUrl = ENV.apiHost + '/api/provider/clients';
        var objectToRespond = {'provider_client':[]};
        var client = {'provider_client':[
                        {
                          'id':1,
                          'notas':'jerarquía analizada Diverso',
                          'ruc':'961770900-7',
                          'nombres':'Urías S.A.',
                          'direccion':'Subida Clemente Zapata, 9 Esc. 773',
                          'telefono':'972 299 498',
                          'email':'karelle@luettgenlueilwitz.name'
                        }
                      ]};

        $httpBackend.expectPOST(expectedUrl)
          .respond(objectToRespond);

        service.newClient(client).then(function(response){
          chai.assert.isArray(response);
        });

        $httpBackend.flush();
      });

      it('should update a provider client', function(){
        var clientId = 1;
        var expectedUrl = ENV.apiHost + '/api/provider/clients/' + clientId;
        var objectToRespond = {'provider_client':[]};
        var client = {
                      'id':1,
                      'notas':'jerarquía analizada Diverso',
                      'ruc':'961770900-7',
                      'nombres':'Urías S.A.',
                      'direccion':'Subida Clemente Zapata, 9 Esc. 773',
                      'telefono':'972 299 498',
                      'email':'karelle@luettgenlueilwitz.name'
                      };

        $httpBackend.expectPATCH(expectedUrl)
          .respond(objectToRespond);

        service.editClient(client).then(function(response){
          chai.assert.isObject(response, 'This is an object!');
          chai.expect(response).to.include.keys('provider_client');
        });

        $httpBackend.flush();
      });

      it('should delete a provider client', function(){
        var clientId = 1;
        var expectedUrl = ENV.apiHost + '/api/provider/clients/' + clientId;

        $httpBackend.expectDELETE(expectedUrl)
          .respond(201);

        service.deleteClient(clientId).then(function(response){
          chai.expect(response.status).to.be.equal(201);
        });

        $httpBackend.flush();
      });
    });
  });
})();
