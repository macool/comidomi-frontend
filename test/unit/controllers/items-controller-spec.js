(function () {
  'use strict';

  describe('ItemsController', function () {
    var ctrl,
      $q,
      $controller,
      dependencies,
      ItemsService,
      deferGetItems,
      ModalService,
      $ionicLoading,
      $ionicPopup,
      $auth,
      $scope,
      $rootScope,
      $timeout,
      deferNewItem,
      deferEditItem,
      deferIonic,
      deferDeleteItem,
      apiResources,
      ErrorHandlerService,
      ItemCategoriesService;

    beforeEach(module('porttare.controllers'));
    beforeEach(module('porttare.services', function($provide){
      $provide.factory('ItemsService', function($q){
        return {
          getItems: function(){
            deferGetItems = $q.defer();
            return deferGetItems.promise;
          },
          newItem: function(){
            deferNewItem = $q.defer();
            return deferNewItem.promise;
          },
          editItem: function(){
            deferEditItem = $q.defer();
            return deferEditItem.promise;
          },
          deleteItem: function(){
            deferDeleteItem = $q.defer();
            return deferDeleteItem.promise;
          }
        };
      });
      $provide.factory('ModalService', function(){
        return {
          showModal: function(){
            return null;
          },
          closeModal: function(){
            return null;
          }
        };
      });
      $provide.factory('ErrorHandlerService', function(){
        return {};
      });
      $provide.factory('ItemCategoriesService', function($q){
        return {
          getProviderItemCategories: sinon.stub().returns($q.defer().promise)
        };
      });
      $provide.factory('$auth', function(){
        // jshint ignore:start
        return {
          user: {
            current_place: {},
            provider_profile: {
              allowed_currency_iso_codes: []
            }
          }
        };
        // jshint ignore:end
      });
    }));

    beforeEach(inject(
      function (_$q_,
        _$rootScope_,
        _$controller_,
        _$auth_,
        _ItemsService_,
        _ModalService_,
        _ErrorHandlerService_,
        _ItemCategoriesService_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = _$q_;
        deferGetItems = $q.defer();
        deferIonic = $q.defer();
        ItemsService = _ItemsService_;
        ModalService = _ModalService_;
        $controller = _$controller_;
        ErrorHandlerService = _ErrorHandlerService_;
        ItemCategoriesService = _ItemCategoriesService_;
        apiResources = {};
        $ionicLoading = {
          show: sinon.stub().returns(deferIonic.promise),
          hide: sinon.stub().returns(deferIonic.promise)
        };
        $ionicPopup = {
          alert: sinon.stub().returns(deferIonic.promise)
        };
        $auth = _$auth_;
        $timeout = sinon.stub();
      })
    );

    describe('All functions', function () {
      beforeEach(function () {
        dependencies = {
          $auth: $auth,
          $scope: $scope,
          ItemsService: ItemsService,
          ModalService: ModalService,
          $ionicLoading: $ionicLoading,
          $ionicPopup: $ionicPopup,
          apiResources: apiResources,
          ErrorHandlerService: ErrorHandlerService,
          ItemCategoriesService: ItemCategoriesService
        };

        ctrl = $controller('ItemsController', dependencies);
      });

      describe('Create item', function () {

        beforeEach(inject(function () {
          ctrl.itemsVm = {item: {}};
          ctrl.newItemModal();
          ctrl.submitProcess();
        }));

        it('ionicLoading.show should be called', function () {
          sinon.assert.calledOnce($ionicLoading.show);
        });

        it('if successful, ionicLoading.hide should be called', function () {
          ctrl.items = [];
          deferNewItem.resolve({data: 'data'});
          $scope.$digest();
          sinon.assert.calledOnce($ionicLoading.hide);
        });

        it('if successful, response should be added to clients', function () {
          ctrl.items = [];
          deferNewItem.resolve({data: 'data'});
          $scope.$digest();
          expect(ctrl.items).to.not.be.null; //jshint ignore:line
        });

        it('if successful, ionicPopup.alert should be called', function () {
          ctrl.items = [];
          deferNewItem.resolve({data: 'data'});
          deferIonic.resolve();
          $scope.$digest();
          sinon.assert.calledOnce($ionicPopup.alert);
        });

        it('if unsuccessful, ionicLoading.hide should be called', function () {
          ctrl.messages = {};
          var backendErrors = {
            status: 422,
            data: {
              errors: [
                { test: 'message' }
              ]
            }
          };
          deferNewItem.reject(backendErrors);
          $rootScope.$digest();
          expect(ctrl.messages).to.be.not.empty; //jshint ignore:line
        });

        it('if unsuccessful, ionicLoading.hide should be called', function () {
          ctrl.items = [];
          deferNewItem.reject({data: 'data'});
          $scope.$digest();
          sinon.assert.calledOnce($ionicLoading.hide);
        });
      });

      describe('Modal', function () {
        beforeEach(function () {
          dependencies = {
            $scope: $scope,
            ItemsService: ItemsService,
            ModalService: ModalService,
            $ionicLoading: $ionicLoading,
            $ionicPopup: $ionicPopup,
            apiResources: apiResources
          };

          ctrl = $controller('ItemsController', dependencies);
        });

        it('Show modal', function () {
          var spy = sinon.spy(ModalService, 'showModal');
          ctrl.newItemModal();
          chai.expect(spy.called).to.be.equal(true);
        });

        beforeEach(inject(function () {
          ctrl.items = [ { id: 0, imagenes: [] }, { id:1 } ];
          ctrl.newItemModal();
        }));

        it('Show edit modal', function () {
          var spy = sinon.spy(ModalService, 'showModal');
          ctrl.newItemModal();
          chai.expect(spy.called).to.be.equal(true);
          chai.assert.isObject(ctrl.item, 'This is an object!');
        });

        it('Close modal', function () {
          var spy = sinon.spy(ModalService, 'closeModal');
          ctrl.closeModal();
          expect(ctrl.item).to.be.null; //jshint ignore:line
          chai.expect(spy.called).to.be.equal(true);
        });
      });
    });
  });
})();
