angular
  .module('app')
  .component('publicationScheduleComponent', {
    templateUrl: 'app/components/publication-schedule/publication-schedule.tmpl.html',
    controller: function ($http, appConfig, $location, anchorSmoothScroll, localStorageService) {
      var vm = this;
      vm.result = [];

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'publication_schedules.json')
          .then(function (res) {
            if (res && res.data) {
              vm.quarter1 = _.groupBy(res.data, 'quater_year1');
              vm.quarter2 = _.groupBy(res.data, 'quater_year2');

              var quarters1 = [];
              var quarters2 = [];
              for (var year1 in vm.quarter1) {
                var test1 = vm.quarter1[year1].reduce(function (acc, nv) {
                  return acc + nv.editor1;
                }, '');

                quarters1.push({
                  year: year1,
                  q: 1,
                  list: test1
                });
              }

              for (var year2 in vm.quarter2) {
                var test = vm.quarter2[year2].reduce(function (acc, nv) {
                  return acc + nv.editor2;
                }, '');

                quarters2.push({
                  year: year2,
                  q: 2,
                  list: test
                });
              }
              vm.result = _.sortBy(quarters1.concat(quarters2), ['year', 'q']);
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
