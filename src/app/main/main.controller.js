(function () {
  'use strict';

  angular
    .module('mediaNet')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(AppService, $rootScope) {
    var vm = this;
    activate();

    function activate() {
      vm.formatDate = formatDate;
      var dataEvent = $rootScope.$on('mesageArrived', function ($event, data) {
        vm.stockList = data;
      });
    }

    $rootScope.$on('destroy', function () {
      dataEvent();
    });

    function formatDate(dt) {
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      var stDt = new Date();

      var dt = new Date(dt);
      // var hours = Math.abs(stDt - dt) / 36e5;
      var showTime = false;
      if (dt.getDate() == stDt.getDate() && dt.getMonth() == stDt.getMonth() && dt.getFullYear() == stDt.getFullYear()) {
        showTime = true;
      }


      var dtday = dt.getDate();
      if (dt.getDate() < 10) {
        dtday = '0' + dt.getDate();
      }
      var dtzone = "am";
      if (dt.getHours() >= 12) {
        dtzone = 'pm';
      }

      var hh = dt.getHours() % 12;
      if (hh == 0) {
        hh = 12;
      }
      if (hh < 10) {
        //hh = "0" + hh;
      }

      var mm = dt.getMinutes();
      if (mm < 10) {
        mm = "0" + mm;
      }

      var dtOp = dtday + "-" + (monthNames[dt.getMonth()]) + "-" + dt.getFullYear() + "   " + hh + ":" + mm + "" + dtzone;
      if (showTime == false) {
        dtOp = dtday + "-" + (monthNames[dt.getMonth()]) + "-" + dt.getFullYear() + "" + hh + ":" + mm + " " + dtzone;
      } else {
        if (mm == stDt.getMinutes()) {
          return "A few seconds ago";
        } else {
          dtOp = hh + ":" + mm + " " + dtzone;
        }

      }
      return dtOp;
    }

  }
})();
