(function () {
  'use strict';

  angular
    .module('porttare.filters')
    .filter('formatDate', formatDate);

  function formatDate() {
    return function (currentValue, formatStr) {
      var defaultFormat = 'DD/MM/YYYY HH:mm',
          timeScheduleFormat = 'HH:mm Z';

      if (formatStr === undefined) {
        formatStr = defaultFormat;
      } else if (formatStr === 'timeSchedule') {
        formatStr = timeScheduleFormat;
      } else if (formatStr === 'hourAndDate') {
        formatStr = 'hh:mma DD MMM YYYY';
      }

      return moment(currentValue).format(formatStr);
    };
  }

})();
