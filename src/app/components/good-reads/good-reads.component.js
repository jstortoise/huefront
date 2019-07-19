angular
  .module('app')
  .component('goodReadsComponent', {
    templateUrl: 'app/components/good-reads/good-reads.tmpl.html',
    controller: function ($http, appConfig, $location, anchorSmoothScroll, localStorageService) {
      var vm = this;
      vm.all = [];
      vm.items = [];
      vm.flag = true;
      var count = 1;
      var numberOfElements = 6;

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'good_reads.json')
          .then(function (res) {
            if (res && res.data && res.data.data) {
              vm.pageData = res.data.data.map(function (item) {
                item.data.image_url = item.images && item.images[0] && item.images[0].image_url;
                return item.data;
              });
            }
            vm.sortItems();
          });
      };

      vm.sortItems = function () {
        vm.pageData.forEach(function (elem, index) {
          if (index > numberOfElements * count - 1) {
            elem.style = 'display: none';
            vm.flag = false;
          }else{
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
