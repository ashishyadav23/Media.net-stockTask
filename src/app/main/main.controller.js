(function () {
  'use strict';

  angular
    .module('mediaNet')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;
    activate();

    function activate() {
      vm.tablesList = [{
        id: 1,
        "name": 'Ashish',
        "date": new Date()
      }, {
        id: 2,
        "name": 'asfsf',
        "date": new Date()
      }, {
        id: 3,
        "name": 'safsafsh',
        "date": new Date()
      }, {
        id: 4,
        "name": 'Asds',
        "date": new Date()
      }, {
        id: 5,
        "name": 'Manis',
        "date": new Date()
      }]
    }
  }
})();
