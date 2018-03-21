(function() {
  'use strict';

  angular
    .module('mediaNet')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
