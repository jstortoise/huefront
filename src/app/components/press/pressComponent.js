angular
  .module('app')
  .component('pressComponent', {
    templateUrl: 'app/components/press/press.tmpl.html',
    controller: function ($state, $http, appConfig, dataValidate) {
      var vm = this;
      vm.pageData = {};
      vm.data = {
        firstName: {value: '', required: true, name: 'first name', type: 'provide'},
        lastName: {value: '', required: true, name: 'last name', type: 'provide'},
        email: {value: '', required: true, name: 'email', type: 'provide'},
        company: {value: '', required: true, name: 'company name', type: 'provide'},
        message: {value: '', required: true, name: 'message', type: 'enter'},
        research: {value: '-'}
      };

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'presses.json')
          .then(function (res) {
            if (res && res.data && res.data.data) {
              vm.pageData = angular.copy(res.data);
            }
          });
        $http.get(appConfig.dashboardServiceUrl + 'reports.json')
          .then(function (res) {
            if (res && res.data) {
              vm.pageData.reports = angular.copy(res.data.data);
            }
          });
      };
      vm.press = function () {
        if (dataValidate.validate(vm.data)) {
          var data = {};
          for (var item in this.data) {
            data[item] = this.data[item].value;
          }
          $http.get(appConfig.dashboardServiceUrl + 'press_contact', {
            params: data
          })
            .then(function (res) {
              if (res.status === 200) {
                $state.go('thank-you');
              }
            });
        }
      };
      vm.makeDate = function (item) {
        return moment(item.data.published_year + '-' + item.data.published_month + '-' + item.data.published_day).format('MMMM D, YYYY');
      };
    }
  });
