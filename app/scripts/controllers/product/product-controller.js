(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProductController', ProductController);

  function ProductController(providerItem, CartService, $ionicPopup, $state,
                            $scope, WishlistsService, ModalService,
                            ErrorHandlerService, $ionicLoading, $auth, APP) {
    var productVm = this,
        defaultImage = {
          imagen_url: APP.defaultImage //jshint ignore:line
        },
        itemsObject = {};

    productVm.more = false;
    productVm.product = providerItem;
    productVm.subProducts = productVm.product.children || [];
    productVm.runAction = runAction;
    productVm.closeModal = closeModal;
    productVm.item = {};
    productVm.item.provider_item_id = productVm.product.id; //jshint ignore:line
    productVm.item.cantidad = 1;
    productVm.wishlists = [];
    productVm.cartItem = CartService.findCartItem($auth.user.customer_order, productVm.product); //jshint ignore:line
    productVm.canAdd = productVm.product.is_group ? false : getCanAdd();//jshint ignore:line
    productVm.onWishlistSelect = onWishlistSelect;
    productVm.createNewWishlist = createNewWishlist;
    productVm.showNewWishlistInput = false;
    productVm.showNewWishlist = showNewWishlist;
    productVm.wishlistName = '';
    productVm.clearData = clearData;
    productVm.imagenes = productVm.product.imagenes.length > 0 ? productVm.product.imagenes : [defaultImage];
    productVm.multipleItems = [];
    productVm.onChangeChildrenItem = onChangeChildrenItem;
    // jshint ignore:start
    productVm.counterOptions = {
      cantidad: productVm.item.cantidad,
      cartItem: productVm.cartItem,
      providerItem: productVm.product,
      priceCents: providerItem.precio_cents,
      currencyCode: providerItem.precio_currency,
      onChangeValue: function (data) {
        productVm.item.cantidad = data.itemsCount;
        productVm.canAdd = getCanAdd();
      }
    };
    // jshint ignore:end

    productVm.slickConfig = {
      arrows: false,
      dots: true
    };

    productVm.actions = {
      cart: {
        onActionSelect: addToCart
      },
      wishlist: {
        onActionSelect: addToWishlist
      },
      buyNow: {
        onActionSelect: buyNow
      },
      cartMultipleItems: {
        onActionSelect: addMultipleItemsToCart
      },
    };

    function runAction(action) {
      if (action && action.onActionSelect) {
        action.onActionSelect();
      }
    }

    function addToCart() {
      CartService.addItem(productVm.item)
        .then(onAddSuccess, onError);
    }

    function addMultipleItemsToCart() {
      CartService.addMultipleItems(productVm.multipleItems)
        .then(onAddSuccess, onError);
    }

    function getWishlists() {
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
      productVm.wishlists = [];
      WishlistsService.getWishlists()
        .then(function success(res) {
          $ionicLoading.hide();
          productVm.wishlists = res.customer_wishlists; //jshint ignore:line
        }, ErrorHandlerService.handleCommonErrorGET);
    }

    function addToWishlist() {
      getWishlists();
      ModalService.showModal({
        parentScope: $scope,
        fromTemplateUrl: 'templates/product/add-to-wishlist.html'
      });
    }

    function showNewWishlist() {
      productVm.showNewWishlistInput = true;
    }

    function createNewWishlist() {
      $ionicLoading.show({
        template: '{{::("globals.loading"|translate)}}'
      });
      var wishlistData = {
        nombre: productVm.wishlistName
      };
      WishlistsService.createWishlist(wishlistData)
        .then(function success(res) {
          $ionicLoading.hide();
          clearData();
          productVm.wishlists.push(res.customer_wishlist); //jshint ignore:line
        }, function error(res) {
          $ionicLoading.hide();
          if (res && res.errors) {
            productVm.messages = res.errors;
          } else {
            var message = '{{::("globals.pleaseTryAgain"|translate)}}';
            $ionicPopup.alert({
              title: 'Error',
              template: message
            });
          }
        });
    }

    function clearData() {
      productVm.showNewWishlistInput = false;
      productVm.wishlistName = '';
    }

    function onAddSuccess(res) {
      var route = 'app.categories.provider';
      var params = {
        categoryId: $state.params.categoryId,
        providerId: $state.params.providerId
      };

      onSuccess(res, route, params);
    }

    function onSuccess(res, route, params) {
      if (res && res.customer_order) {//jshint ignore:line
        validateOrderCreated(res.customer_order);//jshint ignore:line
      }

      $state.go(route, params)
        .then(closeModal);
    }

    function onError(response) {
      if(response.errors.cantidad){
        productVm.messages = response.errors.cantidad.join(', ');
      }
      $ionicPopup.alert({
        title: 'Error',
        template: '{{::("globals.pleaseTryAgain"|translate)}}'
      });
    }

    function closeModal() {
      ModalService.closeModal();
      clearData();
    }

    function onWishlistSelect(wlist) {
      var wishlist = angular.copy(wlist);
      var item = productVm.item.provider_item_id; //jshint ignore:line
      wishlist.provider_items_ids = filterItemsIds(wlist); //jshint ignore:line
      wishlist.provider_items_ids.push(item); //jshint ignore:line
      WishlistsService.updateWishlist(wishlist)
        .then(function success() {
          onAddSuccess();
        }, onError);
    }

    function buyNow() {
      CartService.addItem(productVm.item)
        .then(onBuyNowSuccess, onError);
    }

    function onBuyNowSuccess(res) {
      var route = 'app.cart.index';
      var params = null;
      onSuccess(res, route, params);
    }

    function validateOrderCreated(order) {
      if (!$auth.user.customer_order) { //jshint ignore:line
        $auth.user.customer_order = order//jshint ignore:line
      } else {
        $auth.user.customer_order = order//jshint ignore:line
        $scope.$emit('update-number');
      }
    }

    //jshint ignore:start
    function filterItemsIds(wlist) {
      var ids = [];
      if (wlist.provider_items) {
        angular.forEach(wlist.provider_items, function (item) {
          ids.push(item.id);
        });
      }
      return ids;
    }
    //jshint ignore:end

    function getCanAdd(){
      return CartService.canAddItem(productVm.cartItem, productVm.item.cantidad , productVm.product);
    }

    function onChangeChildrenItem(product){
      itemsObject[product.provider_item_id] = product;//jshint ignore:line
      if (product.cantidad === 0){
        delete itemsObject[product.provider_item_id];//jshint ignore:line
      }
      var result = Object.keys(itemsObject).map(function(key) {
        return itemsObject[key];
      });
      productVm.multipleItems = result;
    }
  }
})();
