(function () {
  'use strict';

  describe('ProfileInfoController', function () {
    var ctrl,
      $controller,
      $rootScope,
      dependencies,
      $auth,
      ModalService,
      ProfileService,
      $ionicLoading,
      $ionicPopup,
      $scope,
      deferredUpdate,
      deferIonic,
      deferGetProfile,
      deferEditProfile;
    beforeEach(module('porttare.controllers'));
    beforeEach(module('porttare.services', function($provide){
      $provide.factory('ProfileService', function($q){
        return {
          getProfile: function(){
            deferGetProfile = $q.defer();
            return deferGetProfile.promise;
          },
          editProfile: function(){
            deferEditProfile = $q.defer();
            return deferEditProfile.promise;
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
    }));
    beforeEach(inject(
      function ($q,
        _$rootScope_,
        _$controller_,
        _ProfileService_,
        _ModalService_
        ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        deferredUpdate = $q.defer();
        deferIonic = $q.defer();
        ProfileService = _ProfileService_;
        ModalService = _ModalService_;
        $controller = _$controller_;
        $ionicLoading = {
          show: sinon.stub().returns(deferIonic.promise),
          hide: sinon.stub().returns(deferIonic.promise)
        };
        $auth             = {
          updateAccount: sinon.stub()
                            .returns(deferredUpdate.promise),
          user: {
            provider: 'email'
          }
        };
        $ionicPopup = {
          alert: sinon.stub().returns(deferIonic.promise)
        };
      })
    );

    describe('updateAccount', function () {
      beforeEach(function () {
        dependencies = {
          $auth: $auth,
          ModalService: ModalService,
          ProfileService: ProfileService,
          $ionicLoading: $ionicLoading,
          $ionicPopup: $ionicPopup,
          $scope: $scope
        };

        ctrl = $controller('ProfileInfoController', dependencies);
      });

      it('should show a popup if update account', function () {
        var user = {name:'Ana María Cornejo Vásquez',
                    email:'darlene@collierfranecki.biz',
                    ciudad:'Móstoles',
                    fecha_nacimiento:'1973-08-06' //jshint ignore:line
                  };
        ctrl.submitProcess(user);
        deferEditProfile.resolve({data: { user: {}}});
        deferIonic.resolve();
        $rootScope.$digest();
        sinon.assert.calledOnce($ionicPopup.alert);
      });
    });
  });
})();
