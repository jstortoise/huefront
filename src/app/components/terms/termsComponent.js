angular
  .module('app')
  .component('termsComponent', {
    templateUrl: 'app/components/terms/terms.tmpl.html',
    controller: function ($http, appConfig) {
      var vm = this;
      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'bottoms.json')
          .then(function (res) {
            if (res && res.data) {
              vm.pageData = res.data.find(function (item) {
                return item.name === 'Terms of Use';
              })
            }
          });
      };
    }
  });
