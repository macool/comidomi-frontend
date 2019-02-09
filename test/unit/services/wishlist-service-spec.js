(function () {
  'use strict';

  describe('WishlistService', function () {
    var service,
      $httpBackend,
      ENV;

    beforeEach(module('porttare.services'));
    beforeEach(module('porttare.services', function ($provide) {
      $provide.constant('ENV', {
        name: 'development',
        apiHost: 'http://localhost:3785'
      });
    }));

    beforeEach(inject(function (_WishlistsService_, _$httpBackend_, _ENV_) {
      ENV = _ENV_;
      $httpBackend = _$httpBackend_;
      service = _WishlistsService_;
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });


    describe('Get', function () {
      it('success: should get all wishlists ', function () {
        var responseData = {
          'customer_wishlists': [{
            'id': 1,
            'nombre': 'test',
            'provider_items_ids': [],
            'entregar_en': '2016-11-30 13:00 -0500'
          }]
        };
        $httpBackend.expectGET(ENV.apiHost + '/api/customer/wishlists')
          .respond(200, responseData);

        service.getWishlists()
          .then(function success(res) {
            expect(res).to.deep.equal(responseData);
          });
        $httpBackend.flush();
      });

      it('error: should get an error ', function () {
        var responseData = {
          error: 'error message'
        };
        $httpBackend.expectGET(ENV.apiHost + '/api/customer/wishlists')
          .respond(400, responseData);

        service.getWishlists()
          .then(function success() {},
            function error(res) {
              expect(res).to.deep.equal(responseData);
            });
        $httpBackend.flush();
      });
    });

    describe('Create', function () {
      it('success: should create a wishlist', function () {
        var data = {
          'nombre': 'test',
          'provider_items_ids': [],
          'entregar_en': '2016-11-30 13:00 -0500'
        };
        var responseData = {
          'customer_wishlist': {
            'id': 1,
            'nombre': 'test',
            'provider_items_ids': [],
            'entregar_en': '2016-11-30 13:00 -0500'
          }
        };
        $httpBackend.expectPOST(ENV.apiHost + '/api/customer/wishlists')
          .respond(200, responseData);

        service.createWishlist(data)
          .then(function success(res) {
            expect(res).to.deep.equal(responseData);
          });
        $httpBackend.flush();
      });

      it('error: should get an error ', function () {
        var responseData = {
          error: 'error message'
        };
        var data = {
          'nombre': 'test',
          'provider_items_ids': [],
          'entregar_en': '2016-11-30 13:00 -0500'
        };
        $httpBackend.expectPOST(ENV.apiHost + '/api/customer/wishlists')
          .respond(400, responseData);

        service.createWishlist(data)
          .then(function success() {},
            function error(res) {
              expect(res).to.deep.equal(responseData);
            });
        $httpBackend.flush();
      });
    });
    describe('Update', function () {
      it('success: should update a wishlist', function () {
        var data = {
          'id': 1,
          'nombre': 'test',
          'provider_items_ids': [],
          'entregar_en': '2016-11-30 13:00 -0500'
        };
        var responseData = {
          'customer_wishlist': {
            'id': 1,
            'nombre': 'test_new',
            'provider_items_ids': [],
            'entregar_en': '2016-11-30 13:00 -0500'
          }
        };
        $httpBackend.expectPUT(ENV.apiHost + '/api/customer/wishlists/' + data.id)
          .respond(200, responseData);

        service.updateWishlist(data)
          .then(function success(res) {
            expect(res).to.deep.equal(responseData);
          });
        $httpBackend.flush();
      });

      it('error: should get an error ', function () {
        var responseData = {
          error: 'error message'
        };
        var data = {
          'id': 1,
          'nombre': 'test',
          'provider_items_ids': [],
          'entregar_en': '2016-11-30 13:00 -0500'
        };
        $httpBackend.expectPUT(ENV.apiHost + '/api/customer/wishlists/' + data.id)
          .respond(400, responseData);

        service.updateWishlist(data)
          .then(function success() {},
            function error(res) {
              expect(res).to.deep.equal(responseData);
            });
        $httpBackend.flush();
      });
    });
    describe('Delete', function () {
      it('success: should delete a wishlist', function () {
        var responseData = {
          'success': 'success'
        };
        $httpBackend.expectDELETE(ENV.apiHost + '/api/customer/wishlists/1')
          .respond(200, responseData);
        service.removeWishlist(1)
          .then(function success(res) {
            expect(res).to.deep.equal(responseData);
          });
        $httpBackend.flush();
      });

      it('error: should get an error ', function () {
        var responseData = {
          error: 'error message'
        };
        $httpBackend.expectDELETE(ENV.apiHost + '/api/customer/wishlists/1')
          .respond(400, responseData);

        service.removeWishlist(1)
          .then(function success() {},
            function error(res) {
              expect(res).to.deep.equal(responseData);
            });
        $httpBackend.flush();
      });
    });
  });
})();
