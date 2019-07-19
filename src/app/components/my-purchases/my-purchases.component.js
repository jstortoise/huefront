angular
  .module('app')
  .component('myPurchasesComponent', {
    templateUrl: 'app/components/my-purchases/my-purchases.tmpl.html',
    controller: function ($state, $http, appConfig, $scope, authService, localStorageService) {
      var vm = this;
      vm.data = [];

      function init() {
        if (vm.user && vm.user.id) {
          $http.get(appConfig.dashboardServiceUrl + '/members/bought_items.json', {params: {id: vm.user.id, token: authService.token}})
            .then(function (res) {
              for (var key in res.data) {
                res.data[key].forEach(function (item) {
                  item.purchaseDate = moment(item.purchase_date).format('DD.MM.YYYY');
                  if (key === 'teaching_materials') {
                    item.type = 'color-teaching-materials';
                  } else if (key === 'reports') {
                    item.type = 'color-reports';
                  } else if (key === 'courses') {
                    item.type = 'color-education-courses';
                  }
                  vm.data.push(item);
                });
              }
              vm.data.sort(vm.sortByDate);
            });
        }
      }

      vm.sortByDate = function(a, b) {
        if (Date.parse(a.purchase_date) < Date.parse(b.purchase_date)) return 1;
        if (Date.parse(a.purchase_date) > Date.parse(b.purchase_date)) return -1;
      };



      $scope.$watch(function () {
        return authService.currentUser;
      }, function (newVal) {
        vm.user = localStorageService.get('currentUser');
        init();
      });
    }
  });
