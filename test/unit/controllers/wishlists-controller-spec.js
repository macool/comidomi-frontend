(function () {
  'use strict';
  /*jshint camelcase:false */
  describe('WishlistsController', function () {
    var ctrl,
      dependencies,
      $controller,
      $scope,
      $ionicLoading,
      $ionicScrollDelegate,
      ModalServiceMock,
      $state;

    beforeEach(module('porttare.controllers'));
    beforeEach(angular.mock.module(function ($provide) {
      $provide.value('data', {});
      $provide.value('APP', {
        defaultSlickConfig: {}
      });
      $provide.factory('ModalService', function () {
        return {
          showModal: sinon.stub(),
          closeModal: sinon.stub()
        };
      });
      $provide.factory('WishlistsService', function () {
        return {};
      });
      $provide.factory('$ionicPopup', function(){
        return {
          alert: sinon.stub()
        };
      });
      $provide.factory('$state', function(){
        return {
          go: sinon.stub()
        };
      });
    }));

    beforeEach(inject(function (_$rootScope_,
      _$controller_,
      data,
      APP,
      ModalService,
      WishlistsService,
      _$ionicPopup_,
      _$state_) {
      $ionicLoading = {
        show: sinon.stub(),
        hide: sinon.stub()
      };
      $ionicScrollDelegate = {
        scrollTop: sinon.stub()
      };
      ModalServiceMock = ModalService;
      $scope = _$rootScope_.$new();
      $controller = _$controller_;
      $state=_$state_;
      dependencies = {
        data: data,
        APP: APP,
        ModalService: ModalServiceMock,
        $ionicLoading: $ionicLoading,
        $ionicScrollDelegate: $ionicScrollDelegate,
        $scope: $scope,
        $state: $state,
        WishlistsService: WishlistsService,
        $ionicPopup: _$ionicPopup_
      };
      ctrl = $controller('WishlistsController', dependencies);
    }));

    describe('Modal events', function () {
      it('Should send the right params', function () {
        ctrl.modalSettings= {
          newWishlist: {
            parentScope: $scope,
            fromTemplateUrl: 'templates/wishlist/new.html'
          },
          editWishlist: {
            parentScope: $scope,
            fromTemplateUrl: 'templates/wishlist/edit.html'
          },
          showWishlistItems: {
            parentScope: $scope,
            fromTemplateUrl: 'templates/wishlist/wishlists.html'
          }
        };
        ctrl.showModal(ctrl.modalSettings);
        sinon.assert.calledWith(ModalServiceMock.showModal, ctrl.modalSettings);
      });

      it('Should send a ID', function () {
        ctrl.closeModal();
        sinon.assert.calledOnce(ModalServiceMock.closeModal);
      });

      it('Should clear info', function () {
        ctrl.closeModal();
        expect(ctrl.query).to.equal('');
        expect(ctrl.wishlist).to.equal(null);
        expect(ctrl.messages).to.deep.equal({});
        expect(ctrl.editing).to.equal(false);
      });

      it('Should show the main modal', function () {
        var wlist = {
          'id': 1,
          'nombre': 'Parrillada del sábado',
          'items': [],
          'compartir_con': [],
          'fecha_entrega': '2016-10-02T10:44:18.609-05:00'
        };
        ctrl.modalSettings.editWishlist = {
          parentScope: $scope,
          fromTemplateUrl: 'templates/wishlist/edit.html'
        };
        sinon.stub(ctrl, 'showModal');
        ctrl.showEditModal(wlist);
        expect(ctrl.wishlist.id).to.deep.equal(wlist.id);
        sinon.assert.calledWith(ctrl.showModal, ctrl.modalSettings.editWishlist);
      });

    });

  });
})();
