(function () {
  'use strict';

  angular
    .module('porttare.services')
    .factory('CommonService', CommonService);

  function CommonService($http, ENV, $filter) {

    var service = {
      editObject: editObject,
      newObject: newObject,
      getObjects: getObjects,
      getObject: getObject,
      deleteObject:deleteObject,
      officeScheduleDay: officeScheduleDay,
      getStatusOrderIcon: getStatusOrderIcon
    };

    var STATUS_ICONS = {
      assigned: 'directions_bike',
      delivered: 'check_circle',
      in_progress: 'person_pin' //jshint ignore:line
    };

    return service;

    function getObjects(url, modelName) {
      return $http({
        method: 'GET',
        url: ENV.apiHost + url
      })
        .then(function success(resp) {
          var collection = resp.data;
          if (modelName) {
            collection = collection[modelName];
          }
          return collection;
        });
    }

    function newObject(data, url) {
      return $http({
        method: 'POST',
        url: ENV.apiHost + url,
        data: data
      })
        .then(function success(resp){
          return resp.data;
        });
    }

    function editObject(data, url) {
      return $http({
        method: 'PATCH',
        url: ENV.apiHost + url + data.id,
        data: data
      })
        .then(function success(resp){
          return resp.data;
        });
    }

    function getObject(url, objectId, modelName) {
      return getObjects(url + objectId).then(function(resp){
        var resource = resp;
        if (modelName) {
          resource = resource[modelName];
        }
        return resource;
      });
    }

    function deleteObject(objectId, url){
      return $http({
        method: 'DELETE',
        url: ENV.apiHost + url + objectId
      })
        .then(function success(resp){
          return resp.data;
        });
    }


    function officeScheduleDay(office){
      var dia = getTodayStr(),
          openingTime = '',
          closingTime = '',
          isOpen = false;

      var officeWeekday = office.weekdays.find(function(wday){
        return wday.day === dia;
      });

      if (officeWeekday) {
        var horaDeApertura = officeWeekday.hora_de_apertura || '', // jshint ignore:line
            openHour = horaDeApertura.split(' ')[0];
        openingTime = convertToDate(
          openHour 
        );
        var horaDeCierre = officeWeekday.hora_de_cierre || '', // jshint ignore:line
            closeHour = horaDeCierre.split(' ')[0];
        closingTime = convertToDate(
          closeHour
        );
        isOpen = getIsOpen(officeWeekday, openingTime, closingTime);
      }

      return {
        isOpen: isOpen,
        openingTime: openingTime,
        closingTime: closingTime
      };
    }

    function getIsOpen(officeWeekday, openingTime, closingTime) {
      if (angular.element.isEmptyObject(openingTime)) {
        return;
      }
      if (angular.element.isEmptyObject(closingTime)) {
        return;
      }

      var horaActual = moment(),
          isInRange = horaActual.isBetween(
                        openingTime,
                        closingTime
                      );

      if (officeWeekday.abierto && isInRange) {
        return true;
      }
      return false;
    }

    function getTodayStr(){
      return moment().locale('en').format('ddd').toLowerCase();
    }

    function convertToDate(horaStr){
      if (!angular.element.isEmptyObject(horaStr)) {
        return $filter('toDate')(horaStr, 'timeSchedule');
      }
    }

    function getStatusOrderIcon (status){
      return STATUS_ICONS[status];
    }

  }
})();
