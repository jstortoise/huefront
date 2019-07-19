angular
  .module('app')
  .component('membersAnalyticsComponent', {
    templateUrl: 'app/components/members-analytics/members-analytics.tmpl.html',
    controller: function ($http, appConfig, $location, anchorSmoothScroll, authService, localStorageService) {
      var vm = this;
      vm.searchModel = '';
      vm.all = [];
      vm.pageData = [];
      vm.items = [];
      var count = 0;

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + '/member_analytics.json', {params: {token: authService.token}})
          .then(function (res) {
            vm.pageData = angular.copy(res.data.data);
            vm.all = angular.copy(res.data.data);
            vm.search();
          });
      };
      vm.more = function () {
        vm.all[count++].forEach(function (i) {
          vm.items.push(i);
        });
      };

      vm.search = function () {
        if (vm.searchModel) {
          vm.filterData = [];
          vm.pageData.forEach(function (t) {
            if (new RegExp('^' + vm.searchModel, 'i').test(t.member_name)) {
              vm.filterData.push(t);
            }
          });
        } else {
          vm.filterData = angular.copy(vm.pageData);
        }
        vm.items = [];
        vm.all = _.chunk(angular.copy(vm.filterData), 5);
        count = 0;
        vm.more();
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
