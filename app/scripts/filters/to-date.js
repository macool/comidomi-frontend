(function () {
  'use strict';

  angular
    .module('porttare.filters')
    .filter('toDate', toDate);

  function toDate(){
    return function (value, format) {
      if (format === undefined) {
        // default format
        format = 'YYYY/MM/DD HH:mm Z';
      } else if (format === 'timeSchedule') {
        format = 'HH:mm Z';
      }
      return moment(value, format);
    };
  }
})();
