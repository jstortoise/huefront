angular
  .module('app')
  .component('dailyInsightsComponent', {
    templateUrl: 'app/components/daily-insights/daily-insights.tmpl.html',
    controller: function ($http, appConfig, modalService, $location, anchorSmoothScroll, localStorageService) {
      var vm = this;
      vm.pageData = {};
      vm.items = [];
      vm.allDailies = [];
      vm.items = [];
      vm.flag = true;
      var count = 1;
      var numberOfElements = 3;

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'dailies.json')
          .then(function (res) {
            if (res && res.data) {
              angular.forEach(res.data, function (item) {
                item.date = moment(item.published_year + '-' + item.published_month + '-' + item.published_day).format('dddd, MMMM D, YYYY');
                item.published_date = moment(item.published_year + '-' + item.published_month + '-' + item.published_day).format('YYYY-MM-DD');
              });
              vm.allDailies = _.sortBy(res.data, 'published_date').reverse();
              vm.emptyData = Boolean(vm.allDailies[0]);
              vm.pageData = vm.allDailies.shift();
              vm.sortItems();
            }
          });
      };

      vm.sortItems = function () {
        vm.allDailies.forEach(function (elem, index) {
          if (index > numberOfElements * count - 1) {
            elem.style = 'display: none';
            vm.flag = false;
          } else {
            elem.style = '';
            vm.flag = true;
          }
          vm.items.push(elem);
        });
      };

      vm.more = function () {
        vm.items = [];
        count++;
        vm.sortItems();
      };

      vm.onGraphicClick = function (item) {
        if (item) {
          modalService.showModal(3, null, item);
        }
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
