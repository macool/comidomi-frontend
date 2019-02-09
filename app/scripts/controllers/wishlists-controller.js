(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('WishlistsController', WishlistsController);

  function WishlistsController( ModalService,
                                $ionicLoading,
                                $scope,
                                $ionicPopup,
                                data,
                                $state,
                                WishlistsService) {

    var wishlistsVm = this;
    var currentIndex = null;
    wishlistsVm.query = '';
    wishlistsVm.wishlists = data.customer_wishlists; //jshint ignore:line
    wishlistsVm.wishlist = null;
    wishlistsVm.closeModal = closeModal;
    wishlistsVm.showEditModal = showEditModal;
    wishlistsVm.showModal = showModal;
    wishlistsVm.runAction = runAction;
    wishlistsVm.redirectCategories=redirectCategories;
    wishlistsVm.messages = {};
    wishlistsVm.editing=false;
    wishlistsVm.modalSettings = {
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

    wishlistsVm.actions = {
      new: {
        listener: createWishlist
      },
      edit: {
        listener: updateWishlist
      },
      remove: {
        listener: removeWishlist
      },
      cancel: {
        listener: cancelAction
      }
    };

    function showModal(options) {
      ModalService.showModal(options);
    }

    function runAction(action) {
      if (action && action.listener) {
        action.listener();
      }
    }

    function closeModal() {
      ModalService.closeModal();
      clearData();
    }

    function clearData() {
      wishlistsVm.query = '';
      wishlistsVm.wishlist = null;
      wishlistsVm.messages = {};
      currentIndex = null;
      wishlistsVm.editing=false;
    }

    function showEditModal(wlist, index) {
      currentIndex = index;
      wishlistsVm.wishlist = angular.copy(wlist);
      if(wlist.entregar_en){//jshint ignore: line
        var entregar_en = moment(wlist.entregar_en, 'YYYY/MM/DD HH:mm Z');//jshint ignore: line
        wishlistsVm.wishlist.entregar_en = entregar_en.toDate(); //jshint ignore: line
      }
      wishlistsVm.editing=true;
      wishlistsVm.showModal(wishlistsVm.modalSettings.editWishlist);
    }

    function removeWishlist() {
      WishlistsService.removeWishlist(wishlistsVm.wishlist.id)
        .then(function success() {
          wishlistsVm.wishlists.splice(currentIndex, 1);
          cancelAction();
        }, onError);
    }

    function updateWishlist() {
      WishlistsService.updateWishlist(wishlistsVm.wishlist)
        .then(function success(res) {
          wishlistsVm.wishlists[currentIndex] = res.customer_wishlist; //jshint ignore: line
          cancelAction();
        }, onError);
    }

    function createWishlist() {
      WishlistsService.createWishlist(wishlistsVm.wishlist)
        .then(function success(res) {
          wishlistsVm.wishlists.push(res.customer_wishlist); //jshint ignore: line
          cancelAction();
        }, onError);
    }

    function redirectCategories(){
      cancelAction();
      var categoriesRoute = 'app.categories.index';
      $state.go(categoriesRoute);
    }

    function cancelAction() {
      $ionicLoading.hide();
      closeModal();
    }

    function onError(res) {
      $ionicLoading.hide();
      if (res && res.errors) {
        wishlistsVm.messages = res.errors;
      }else {
        var message = '{{::("globals.pleaseTryAgain"|translate)}}';
        $ionicPopup.alert({
          title: 'Error',
          template: message
        });
      }
    }
  }
})();
