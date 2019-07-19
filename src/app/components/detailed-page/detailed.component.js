angular
  .module('app')
  .component('detailedComponent', {
    templateUrl: 'app/components/detailed-page/detailed.tmpl.html',
    controller: function ($location, anchorSmoothScroll, localStorageService) {
      var vm = this;

      vm.gotoElement = function (eID) {
        $location.hash('prefooter');
        anchorSmoothScroll.scrollTo(eID);
        $location.hash('');
      };
      vm.getUser = function () {
          return localStorageService.get('currentUser').id === undefined;
      };
    }
  });
