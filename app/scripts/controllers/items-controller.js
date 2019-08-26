(function () {
  'use strict';

  angular
    .module('porttare.controllers')
    .controller('ItemsController', ItemsController);


  function ItemsController($auth,
                           $ionicLoading,
                           $ionicPopup,
                           $scope,
                           ItemsService,
                           ModalService,
                           ItemCategoriesService,
                           ErrorHandlerService,
                           APP) {
    var itemsVm = this,
        modalScope;
    itemsVm.loaded = false;
    itemsVm.newItemModal = launchModal;
    itemsVm.newLunchModal = lunchModal;
    itemsVm.sortingOptions = [
      { tkey: 'item.sortBy.titulo', filterField: 'titulo' },
      { tkey: 'item.sortBy.createdAt', filterField: 'created_at' },
      { tkey: 'item.sortBy.precio', filterField: 'precio_cents' }
    ];
    itemsVm.submitProcess = newItem; // NB currently here only to honour specs. wipe me?
    itemsVm.query = '';
    itemsVm.currentTab = 'products';
    itemsVm.tabs = [
      {
        key: 'products',
        onClick: switchTab
      },
      {
        key: 'lunches',
        onClick: switchTab
      },
    ];
    init();
    getProviderItemCategories();

    function init() {
      ItemsService.getItems()
        .then(function success(response) {
          itemsVm.items = response.provider_items; //jshint ignore:line
          itemsVm.loaded = true;
        }, ErrorHandlerService.handleCommonErrorGET);
    }

    function getProviderItemCategories(){
      ItemCategoriesService.getProviderItemCategories().then(function success(resp){
        itemsVm.selectize = ItemCategoriesService.getSelectizeItemCategorias();
        itemsVm.categorias = resp.provider_item_categories; //jshint ignore:line
      },ErrorHandlerService.handleCommonErrorGET);
    }

    function error(resp){
      modalScope.modalVm.messages = resp.status===422 ? resp.data.errors:undefined;
      $ionicLoading.hide();
    }

    function concatImages(files){
      modalScope.modalVm.item.imagenes = modalScope.modalVm.item.imagenes.concat(files);
      modalScope.modalVm.imagesUrls = modalScope.modalVm.item.imagenes;
    }

    function newItem() {
      $ionicLoading.show({
        template: '{{::("globals.saving"|translate)}}'
      });
      ItemsService.newItem(modalScope.modalVm.item).then(function success(response){
        $ionicLoading.hide().then(function(){
          itemsVm.items.push(response.provider_item); //jshint ignore:line
          getProviderItemCategories();
          $ionicPopup.alert({
            title: 'Éxito',
            template: '{{::("item.successItemSave"|translate)}}'
          }).then(closeModal);
        });
      }, error);
    }

    function launchModal() {
      modalScope = $scope.$new(true); // isolated
      modalScope.modalVm = itemsVm;
      // unfortunately item is the providerItem we'll edit
      modalScope.modalVm.availableCurrencies = getProviderCurrencies();
      // jshint ignore:start
      modalScope.modalVm.item = {
        imagenes: [],
        en_stock: true,
        unidad_medida: 'unidades',
        precio_currency: getProviderCurrencies()[0]
      };
      // jshint ignore:end
      modalScope.modalVm.closeModal = closeModal;
      modalScope.modalVm.submitProcess = newItem;
      modalScope.modalVm.concatImages = concatImages;
      modalScope.modalVm.imagesUrls = modalScope.modalVm.item.imagenes;
      ModalService.showModal({
        parentScope: modalScope,
        fromTemplateUrl: 'templates/item/new-edit.html'
      });
    }

    function lunchModal() {
      modalScope = $scope.$new(true); // isolated
      modalScope.modalVm = itemsVm;
      modalScope.modalVm.availableCurrencies = getProviderCurrencies();
      // jshint ignore:start
      modalScope.modalVm.menu = {
        mainplates: [{}],
        soups: [{}],
        drinks:[{}],
        desserts:[{}],
        precio: 0,
        cantidad: 1,
        imagenes: [],
        en_stock: true,
        unidad_medida: 'unidades',
        precio_currency: getProviderCurrencies()[0]
      };
      // jshint ignore:end
      modalScope.modalVm.closeModal = closeModal;
      modalScope.modalVm.submitProcess = function(){
        lunchModalPreview(modalScope.modalVm.menu);
      };
      modalScope.modalVm.concatImages = function concatImages(files){
        modalScope.modalVm.menu.imagenes = modalScope.modalVm.menu.imagenes.concat(files);
        modalScope.modalVm.imagesUrls = modalScope.modalVm.menu.imagenes;
      };
      modalScope.modalVm.imagesUrls = modalScope.modalVm.menu.imagenes;
      ModalService.showModal({
        parentScope: modalScope,
        fromTemplateUrl: 'templates/item/new-edit-lunch.html'
      });
    }

    function closeModal() {
      ModalService.closeModal();
      modalScope.modalVm.messages = {};
      modalScope.modalVm.item = null;
    }

    function getProviderCurrencies(){
      var providerAllowedCodes = $auth.user.provider_profile.allowed_currency_iso_codes; // jshint ignore:line
      if (providerAllowedCodes.length === 0) {
        providerAllowedCodes = [$auth.user.current_place.currency_iso_code]; // jshint ignore:line
      }
      return providerAllowedCodes;
    }


    function lunchModalPreview(menu){
      var lunch = angular.copy(menu);
      var modalScopeLunch = $scope.$new(true); // isolated
      modalScopeLunch.modalVm = itemsVm;

      lunch.mainplates = removeBlanks(lunch.mainplates);
      lunch.soups = removeBlanks(lunch.soups);
      lunch.drinks = removeBlanks(lunch.drinks);
      lunch.desserts = removeBlanks(lunch.desserts);

      modalScopeLunch.modalVm.closeModal = function(){
        ModalService.closeModal();
      };
      modalScopeLunch.modalVm.lunch = lunch;
      modalScopeLunch.modalVm.defaultImage = {
        imagen_url: APP.defaultImage //jshint ignore:line
      };
      modalScopeLunch.modalVm.submitLunch = function(lunch){
        var data = {
          precio: lunch.precio,
          lunch_items_attributes: buildLuchItemsAttributes(lunch) //jshint ignore:line
        };
        ItemsService.newLunch(data).then(function success(response){
          closeModal(response);
        }, error);
      };
      ModalService.showModal({
        parentScope: modalScopeLunch,
        fromTemplateUrl: 'templates/item/preview-lunch.html'
      });
    }

    function buildLuchItemsAttributes(lunch) {
      var attributesLunch = [
        { prop: 'desserts', key: 'dessert' },
        { prop: 'drinks', key: 'drink' },
        { prop: 'mainplates', key: 'mainplate' },
        { prop: 'soups', key: 'soup' }
      ],
      attributes = [];
      attributesLunch.forEach(function(attr){
        var values = lunch[attr.prop] || [];
        if (values.length) {
          values.forEach(function(val){
            attributes.push({
              kind: attr.key,
              name: val.name
            });
          });
        }
      });
      return attributes;
    }

    function removeBlanks(items) {
      var result = [];
      angular.forEach(items, function(item){
        if (item.name && !(/^\s*$/.test(item.name))) {
          result.push(item);
        }
      });
      return result;
    }

    function switchTab (key){
      itemsVm.orders = [];
      itemsVm.currentTab = key;
    }
  }
})();
