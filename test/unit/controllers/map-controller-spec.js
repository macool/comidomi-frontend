(function () {
  'use strict';

  describe('MapController', function () {
    var $rootScope,
      controller,
      deferredGeolocation,
      deferredMaps,
      $ionicPopup,
      GeolocationService,
      $scope,
      MapsService,
      $ionicLoading;

    beforeEach(module('porttare.controllers'));

    beforeEach(angular.mock.module(function ($provide) {
      $provide.value('ENV', {
        gMapsgMapsKey: 'key'
      });
    }));

    beforeEach(inject(
      function ($q,
        $rootScope,
        $controller) {
        deferredGeolocation = $q.defer();
        deferredMaps = $q.defer();
        $ionicPopup = { alert: sinon.stub() };
        $ionicLoading = { show: sinon.stub(), hide: sinon.stub() };
        GeolocationService = {
          getCurrentPosition: sinon.stub().returns(deferredGeolocation.promise)
        };
        MapsService = {
          loadGMaps: sinon.stub().returns(deferredMaps.promise)
        };
        $scope = $rootScope.$new();
        window.google = {
          maps: {
            MapTypeId: {
              ROADMAP: 'ROADMAP'
            },
            LatLng: function (lat, lng) {
              return {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),

                lat: function () { return this.latitude; },
                lng: function () { return this.longitude; }
              };
            },
            Marker: function () {
              return {};
            },
            Map: function () {
              return {
                controls: {
                  TOP_CENTER: []
                }
              };
            },
            ControlPosition: {
              TOP_CENTER: 'TOP_CENTER',
            },
            MapTypeControlStyle: {
              VERTICAL_BAR: 'VERTICAL_BAR'
            },
            places: {
              SearchBox: function () {
                return {
                  addListener: function () { return true; }
                };
              }
            }
          }
        };

        controller = $controller('MapController', {
          '$ionicPopup': $ionicPopup,
          '$ionicLoading': $ionicLoading,
          'GeolocationService': GeolocationService,
          'MapsService': MapsService,
          '$scope': $scope
        });
      }));

    describe('#geolocation map', function () {

      beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
        MapsService.loadGMaps();
      }));

      it('ionicLoading.show should be called', function () {
        sinon.assert.calledOnce($ionicLoading.show);
      });

      describe('when MapController is loaded', function () {

        beforeEach(inject(function (_$rootScope_) {
          $rootScope = _$rootScope_;
          deferredMaps.resolve();
        }));

        it('if successful, should create map', function () {
          var spyMap = sinon.spy(window.google.maps, 'Map');
          var spySB = sinon.spy(window.google.maps.places, 'SearchBox');
          deferredGeolocation.resolve({
            coords:
            {
              latitude: -3.9866901,
              longitude: -79.19683399999997
            }
          });
          $rootScope.$digest();
          sinon.assert.calledOnce(GeolocationService.getCurrentPosition);
          sinon.assert.calledOnce(spyMap);
          sinon.assert.calledOnce(spySB);
        });

        it('if exist an error, should show a popup', function () {
          //Error code 1 - 3
          var errorCode = Math.floor(Math.random() * 3) + 1;
          deferredGeolocation.reject({ code: errorCode });
          $rootScope.$digest();
          sinon.assert.calledOnce(GeolocationService.getCurrentPosition);
          sinon.assert.calledOnce($ionicPopup.alert);
        });

        it('if exist an error, should load a default location', function () {
          var defaultPosition = {
            coords: {
              latitude: -4.0078909,
              longitude: -79.21127690000003
            }
          };
          var LatLng = sinon.spy(window.google.maps, 'LatLng');
          var errorCode = Math.floor(Math.random() * 3) + 1;
          deferredGeolocation.reject({ code: errorCode });
          $rootScope.$digest();
          var status = LatLng.calledWith(defaultPosition.coords.latitude, defaultPosition.coords.longitude);
          chai.expect(status).to.be.true; //jshint ignore:line
        });
      });
    });
  });
})();
