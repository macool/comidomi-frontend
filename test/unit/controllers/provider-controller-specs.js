(function () {
  'use strict';

  describe('ProviderController', function () {
    var ctrl,
      $controller,
      dependencies,
      $rootScope,
      $ionicLoading,
      ProviderService,
      deferCreateProvider,
      deferStateGo,
      $state,
      $auth,
      $filter,
      $ionicPopup,
      $ionicScrollDelegate,
      $translate,
      stateRedirect,
      deferTranslate,
      providerCategories;

    beforeEach(module('porttare.controllers'));
    beforeEach(module('porttare.filters'));

    beforeEach(inject(
      function ($q,
        _$filter_,
        _$controller_,
        _$rootScope_) {

        $filter = _$filter_;
        deferCreateProvider = $q.defer();
        deferStateGo = $q.defer();
        deferTranslate = $q.defer();
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $ionicLoading = {
          show: sinon.stub(),
          hide: sinon.stub()
        };
        $ionicScrollDelegate = {
          scrollTop: sinon.stub()
        };
        $state = {
          go: sinon.stub().returns(deferStateGo.promise)
        };
        $ionicPopup = {
          alert: sinon.stub()
        };
        $translate = sinon.stub().returns(deferTranslate.promise);
        ProviderService = {
          createNewProvider: sinon.stub().returns(deferCreateProvider.promise)
        };
        $auth = {
          user: {name:'', email:''}
        };
        providerCategories = [];
        stateRedirect = 'provider.items.index';
      })
    );


    describe('Create provider', function () {
      beforeEach(function () {
        dependencies = {
          $ionicLoading: $ionicLoading,
          ProviderService: ProviderService,
          $ionicPopup: $ionicPopup,
          $state: $state,
          $auth: $auth,
          $filter: $filter,
          $translate: $translate,
          $ionicScrollDelegate: $ionicScrollDelegate,
          providerCategories: providerCategories
        };

        ctrl = $controller('ProviderController', dependencies);
      });

      beforeEach(inject(function () {
        ctrl.step = 2;
        ctrl.provider = {'ruc':'222222222','razon_social':'Movvigo','nombre_establecimiento':'Movvigo','actividad_economica':'Gasdro','representante_legal':'Movvigo','telefono':'6666666666','email':'something@movvigo.com','website':'www.moviggo.com'};
        ctrl.matrizProvider = {'direccion':'Aqui','hora_de_apertura':'1899-12-31T11:28:00.000Z','hora_de_cierre':'1899-12-31T15:28:00.000Z','inicio_de_labores':{'label':'Lunes','name':'mon','$$hashKey':'object:159'},'final_de_labores':{'label':'Domingo','name':'sun','$$hashKey':'object:165'},'telefono':'666666666'};
        ctrl.submit();
      }));

      it('name and email should exist in authenticated user', function () {
        expect($auth.user.name).to.exist; //jshint ignore:line
        expect($auth.user.email).to.exist; //jshint ignore:line
      });

      it('legal representative and email  should not be empty', function () {
        chai.assert.isNotNull(ctrl.provider.representante_legal, 'exists!'); //jshint ignore:line
        chai.assert.isNotNull(ctrl.provider.email, 'exists!');
      });

      it('ionicLoading.show should be called', function () {
        sinon.assert.calledOnce($ionicLoading.show);
      });

      it('if successful, ionicLoading.hide should be called', function () {
        deferCreateProvider.resolve({provider_profile: {}}); //jshint ignore:line
        $rootScope.$digest();
        sinon.assert.calledOnce($ionicLoading.hide);
      });

      it('if successful, should change state', function () {
        deferCreateProvider.resolve({provider_profile: {}}); //jshint ignore:line
        $rootScope.$digest();
        sinon.assert.alwaysCalledWithExactly($state.go, stateRedirect);
      });

      it('if successful, should show a alert', function () {
        deferCreateProvider.resolve({provider_profile: {}}); //jshint ignore:line
        $rootScope.$digest();
        deferStateGo.resolve();
        $rootScope.$digest();
        sinon.assert.calledOnce($ionicPopup.alert);
      });

      it('if unsuccessful, should show first template', function () {
        deferCreateProvider.reject({ data: { error: 'error' } });
        $rootScope.$digest();
        expect(ctrl.step).to.be.equal(1);
      });

    });
  });
})();
