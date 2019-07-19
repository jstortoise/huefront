angular
  .module('app')
  .component('colorEmotionComponent', {
    templateUrl: 'app/components/color-emotion/color-emotion.tmpl.html',
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
