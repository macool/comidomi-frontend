(function () {
  'use strict';
  /*jshint camelcase:false */
  describe('ProductController', function () {
    var ctrl,
      $q,
      $controller,
      dependencies,
      $scope,
      $state,
      WishlistsService,
      CartService,
      ErrorHandlerService,
      ModalService,
      deferGetWishlist,
      deferUpdateWishlist,
      deferCreateWishlist;

    beforeEach(module('porttare.controllers'));
    beforeEach(module('porttare.services', function ($provide) {
      $provide.factory('CartService', function () {
        return {
          findCartItem: sinon.stub(),
          canAddItem: sinon.stub()
        };
      });
      $provide.factory('WishlistsService', function ($q) {
        deferGetWishlist = $q.defer();
        deferUpdateWishlist = $q.defer();
        deferCreateWishlist = $q.defer();
        return {
          getWishlists: sinon.stub().returns(deferGetWishlist.promise),
          updateWishlist: sinon.stub().returns(deferUpdateWishlist.promise),
          createWishlist: sinon.stub().returns(deferCreateWishlist.promise),
        };
      });
      $provide.factory('ModalService', function () {
        return {
          showModal: sinon.stub(),
          closeModal: sinon.stub()
        };
      });
      $provide.factory('$auth', function () {
        return { user: {} };
      });
      $provide.factory('ErrorHandlerService', function () {
        return {};
      });
      $provide.value('providerItem', {
        id: 1,
        precio_cents: 100
      });
      $provide.factory('$ionicPopup', function () {
        return {};
      });
      $provide.factory('$state', function ($q) {
        return {
          go: sinon.stub().returns($q.defer().promise),
          params: {
            categoryId: 1,
            providerId: 1
          }
        };
      });
      $provide.factory('$ionicLoading', function () {
        return {
          show: sinon.stub(),
          hide: sinon.stub()
        };
      });
      $provide.factory('$ionicScrollDelegate', function (){
        return {
          resize: sinon.stub()
        };
      });
    }));

    beforeEach(inject(function (_$q_, _$rootScope_, _$controller_,
      _WishlistsService_, _providerItem_, _CartService_, _$ionicPopup_,
      _$state_, _ModalService_, _ErrorHandlerService_, _$ionicLoading_, _$auth_, _$ionicScrollDelegate_) {

      $scope = _$rootScope_.$new();
      $q = _$q_;
      $controller = _$controller_;
      $state = _$state_;
      CartService = _CartService_;
      WishlistsService = _WishlistsService_;
      ModalService = _ModalService_;
      ErrorHandlerService = _ErrorHandlerService_;

      dependencies = {
        WishlistsService: WishlistsService,
        $scope: $scope,
        CartService: CartService,
        ModalService: ModalService,
        ErrorHandlerService: ErrorHandlerService,
        providerItem: _providerItem_,
        $ionicPopup: _$ionicPopup_,
        $state: $state,
        $ionicLoading: _$ionicLoading_,
        $auth: _$auth_,
        $ionicScrollDelegate: _$ionicScrollDelegate_
      };

      ctrl = $controller('ProductController', dependencies);
    }));

    describe('Add Items to wishlist', function () {
      it('Should get the wishlists', function () {
        ctrl.runAction(ctrl.actions.wishlist);
        sinon.assert.calledOnce(WishlistsService.getWishlists);
        $scope.$digest();
      });

      it('Should show Modal', function () {
        ctrl.runAction(ctrl.actions.wishlist);
        sinon.assert.calledOnce(ModalService.showModal);
        sinon.assert.calledWith(ModalService.showModal, {
          parentScope: $scope,
          fromTemplateUrl: 'templates/product/add-to-wishlist.html'
        });

      });

      it('Should add item to wishlist', function () {
        ctrl.item.provider_item_id = 60;
        var wlist = {
          id: 2,
          provider_items: [{
            id: 50
          }]
        };
        var dataExpect = {
          id: 2,
          provider_items: [{
            id: 50
          }],
          provider_items_ids: [50, 60]
        };

        ctrl.onWishlistSelect(wlist);
        sinon.assert.calledWith(WishlistsService.updateWishlist, dataExpect);
      });

      it('Should redirect to product view', function () {
        var wlist = {
          id: 2,
          provider_items: [{
            id: 50
          }]
        };
        var providerRoute = 'app.categories.provider';
        var params = {
          categoryId: 1,
          providerId: 1
        };
        ctrl.onWishlistSelect(wlist);
        deferUpdateWishlist.resolve();
        $scope.$digest();
        sinon.assert.calledWith($state.go, providerRoute, params);
      });
    });

    describe('Create wishlist', function () {
      it('Should create wishlist', function () {
        ctrl.wishlistName = 'test';
        ctrl.createNewWishlist();
        sinon.assert.calledWith(WishlistsService.createWishlist, {
          nombre: 'test'
        });
      });

      it('Add wishlist to list', function () {
        ctrl.wishlists = [{
          id: 2
        }];
        ctrl.createNewWishlist();
        deferCreateWishlist.resolve({
          customer_wishlist: {
            id: 1
          }
        });
        $scope.$digest();
        expect(ctrl.wishlists.length).to.be.equal(2);
      });
    });
  });
})();
