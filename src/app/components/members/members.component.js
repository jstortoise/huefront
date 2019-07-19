angular
  .module('app')
  .component('membersComponent', {
    templateUrl: 'app/components/members/members.tmpl.html',
    controller: function ($http, appConfig, $location, anchorSmoothScroll, localStorageService) {
      var vm = this;
      vm.filter = '';
      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'members/names.json')
          .then(function (res) {
            if (res && res.data) {
              var rows = res.data.length > 0 ? Math.ceil(res.data.length / 4) : 1;
              vm.pageData = res.data;
              vm.dataGroups = _.chunk(res.data, rows);
            }
          });
      };

      vm.filterChange = function () {
        vm.dataGroups = _.chunk(vm.pageData.filter(function (item) {
          var fullName = item.first_name + ' ' + item.last_name;
          return fullName.toLowerCase().indexOf(vm.filter) >= 0;
        }));
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
