(function () {
  'use strict';

  describe('ItemsService', function () {
    var service, $httpBackend, Upload, ENV, CommonService, deferUplod, $rootScope;

    beforeEach(module('porttare.services'));
    beforeEach(module('porttare.services', function ($provide) {

      $provide.constant('ENV', {
        name:'development',
        apiHost:'http://localhost:3785'
      });
      $provide.factory('Upload', function () {
        return {};
      });
      $provide.factory('CommonService', function($q){
        deferUplod = $q.defer();
        return {
          newObject: sinon.stub().returns(deferUplod.promise)
        };
      });
    }));

    describe('Items service', function(){
      beforeEach(inject(
        function (_$rootScope_,$q, _ItemsService_, _$httpBackend_,  _Upload_, _ENV_, _CommonService_) {
          $rootScope = _$rootScope_;
          ENV = _ENV_;
          $httpBackend = _$httpBackend_;
          service = _ItemsService_;
          Upload = _Upload_;
          CommonService = _CommonService_;
        })
      );

      it('should save a item with or without images', function(){
        var objectToRespond = {'provider_items':[]};
        var item = {
          email: 'test@test.com',
          imagenes: []
        };

        deferUplod.resolve(objectToRespond); //jshint ignore:line
        service.newItem(item).then(function(response){
          chai.assert.isObject(response, 'This is an object!');
          chai.expect(response).to.include.keys('provider_items');
        });
      });
    });
  });
})();
