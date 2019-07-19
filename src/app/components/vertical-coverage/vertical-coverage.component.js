angular
  .module('app')
  .component('verticalCoverageComponent', {
    templateUrl: 'app/components/vertical-coverage/vertical-coverage.tmpl.html',
    controller: function ($http, appConfig, $location, anchorSmoothScroll, localStorageService) {
      var vm = this;
      vm.pageData = {};

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'about_vertical_coverages.json')
          .then(function (res) {
            if (res && res.data) {
              vm.pageData = angular.copy(res.data);
              vm.pageData.forEach(function (item) {
                item.editor = item.editor.split('</ul>');
                item.editor = item.editor.map(function (t) {
                  return t + '</ul>';
                });
              });
            }
          });
      };

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
