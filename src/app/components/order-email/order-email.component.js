angular
  .module('app')
  .component('orderEmailComponent', {
    templateUrl: 'app/components/order-email/order-email.tmpl.html',
    controller: function ($state, $http, appConfig, $stateParams) {
      var vm = this;
      vm.token = $stateParams.token;
      vm.products = [];

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'order-email.json', {
          params: {
            token: vm.token
          }
        }).then(function (res) {
          if (res.data) {
            vm.success = res.data.success;
            if (res.data.success) {
              vm.orderId = res.data.orderId;
              vm.products = res.data.products;
            } else {
              vm.error = 'We did not find email you provided in our base';
            }
          }
        });
      };
    }
  });
