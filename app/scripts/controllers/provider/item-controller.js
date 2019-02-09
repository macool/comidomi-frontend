(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ProviderItemController', ProviderItemController);

  function ProviderItemController($scope,
                                  $state,
                                  $translate,
                                  $ionicPopup,
                                  $ionicLoading,
                                  APP,
                                  apiResources,
                                  ModalService,
                                  ItemsService,
                                  ItemCategoriesService,
                                  ErrorHandlerService) {
    var providerItemVm = this,
        modalScope,
        productScope;

    providerItemVm.providerItem = apiResources.provider_item;  // jshint ignore:line
    providerItemVm.updateStock = updateStock;
    providerItemVm.showEditModal = launchModal;
    providerItemVm.unregisterItem = unregisterItem;
    providerItemVm.seeAsCustomer = seeAsCustomer;
    providerItemVm.slickSettings = {
      dots: true,
      lazyLoad: 'progressive'
    };

    init();
    getProviderItemCategories();

    function init() {
      providerItemVm.imagesLoaded = true;
    }

    function getProviderItemCategories(){
      ItemCategoriesService.getProviderItemCategories().then(function success(resp){
        providerItemVm.selectize = ItemCategoriesService.getSelectizeItemCategorias();
        providerItemVm.categorias = resp.provider_item_categories; //jshint ignore:line
        getProviderItemCategoryName();
      },ErrorHandlerService.handleCommonErrorGET);
    }

    function updateStock() {
      ItemsService.editItem({
        id: providerItemVm.providerItem.id,
        en_stock: providerItemVm.providerItem.en_stock // jshint ignore:line
      }).then(function (response) {
        providerItemVm.providerItem = response.provider_item; // jshint ignore:line
        init();
      });
    }

    function loadImagesUrls() {
      return modalScope.modalVm.item.imagenes.map(function(imagen) {
        if (imagen.constructor === File) {
          return imagen;
        } else if (imagen.constructor === Object) {
          return imagen.imagen_url; // jshint ignore:line
        }
      });
    }

    function concatImages(files) {
      modalScope.modalVm.item.imagenes = modalScope.modalVm.item.imagenes.concat(files);
      modalScope.modalVm.imagesUrls = loadImagesUrls();
    }

    function launchModal() {
      modalScope = $scope.$new(true); // isolated
      modalScope.modalVm = providerItemVm;
      // unfortunately item is the providerItem we'll edit
      modalScope.modalVm.item = angular.copy(providerItemVm.providerItem);
      modalScope.modalVm.item.precio = modalScope.modalVm.item.precio_cents / APP.centsInDollar; // jshint ignore:line
      modalScope.modalVm.closeModal = closeModal;
      modalScope.modalVm.submitProcess = editItem;
      modalScope.modalVm.concatImages = concatImages;
      modalScope.modalVm.imagesUrls = loadImagesUrls();
      modalScope.modalVm.availableCurrencies = getAvailableCurrencies();
      ModalService.showModal({
        parentScope: modalScope,
        fromTemplateUrl: 'templates/item/new-edit.html'
      });
    }

    function closeModal() {
      ModalService.closeModal();
      providerItemVm.messages = {};
      providerItemVm.item = null;
    }

    function editItem() {
      $ionicLoading.show({
        template: '{{::("globals.updating"|translate)}}'
      });
      providerItemVm.imagesLoaded = false;
      ItemsService.editItem(modalScope.modalVm.item).then(function success(resp) {
        providerItemVm.imagesLoaded = true;
        providerItemVm.providerItem = resp.provider_item; //jshint ignore:line
        init();
        getProviderItemCategories();
        $ionicLoading.hide().then(function () {
          $ionicPopup.alert({
            title: 'Éxito',
            template: '{{::("item.successUpdateItem"|translate)}}'
          }).then(closeModal);
        });
      }, error);
    }

    function error(resp){
      providerItemVm.imagesLoaded = true;
      modalScope.modalVm.messages = resp.status===422 ? resp.data.errors:undefined;
      $ionicLoading.hide();
    }

    function seeAsCustomer() {
      productScope = $scope.$new(true);
      productScope.productVm = {
        more: false,
        disableInputs: true,
        closeModal: closeModal,
        product: providerItemVm.providerItem,
        slickConfig: providerItemVm.slickSettings
      };
      ModalService.showModal({
        parentScope: productScope,
        focusFirstInput: false,
        fromTemplateUrl: 'templates/item/as-customer.html'
      });
    }

    function getAvailableCurrencies(){
      return [providerItemVm.providerItem.precio_currency]; // jshint ignore:line
    }

    function getProviderItemCategoryName() {
      var providerItemCategory,
          categories,
          providerItem;

      categories = providerItemVm.categorias;
      providerItem = providerItemVm.providerItem;
      providerItemCategory = categories.find(function (providerItemCategory) {
        return providerItemCategory.id === providerItem.provider_item_category_id; // jshint ignore:line
      });
      providerItemVm.providerItemCategoryName = providerItemCategory && providerItemCategory.nombre;
    }

    function unregisterItem() {
      $translate('globals.confirmTitle').then(function (confirmationTitle) {
        $ionicPopup.confirm({
          title: confirmationTitle,
          template: '{{::("item.confirmUnregisterItem"|translate)}}'
        }).then(function(confirmed) {
          if (confirmed) {
            $ionicLoading.show({
              template: '{{::("globals.deleting"|translate)}}'
            });
            ItemsService.deleteItem(providerItemVm.providerItem.id).then(function success(){
              $ionicLoading.hide();
              $state.go('provider.items.index');
            }, function error(){
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: 'Error',
                template: '{{::("globals.pleaseTryAgain"|translate)}}'
              });
            });
          }
        });
      });
    }
  }
})();
