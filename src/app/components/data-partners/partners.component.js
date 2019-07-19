angular
  .module('app')
  .component('partnersComponent', {
    templateUrl: 'app/components/data-partners/partners.tmpl.html',
    controller: function ($state, $http, appConfig, categoryValues, dataValidate) {
      var vm = this;

      vm.jobs = categoryValues('job function');
      vm.companySizes = categoryValues('company size');
      vm.industries = categoryValues('industry');
      vm.countries = categoryValues('country');

      vm.data = {
        first_name: {value: '', required: true, name: 'first name', type: 'provide'},
        last_name: {value: '', required: true, name: 'last name', type: 'provide'},
        email: {value: '', required: true, name: 'email', type: 'provide'},
        company: {value: '', required: true, name: 'company name', type: 'provide'},
        job_title: {value: '', required: true, name: 'job title', type: 'provide'},
        job_function: {value: vm.jobs[0], required: true, name: 'job function', type: 'select'},
        company_size: {value: vm.companySizes[0], required: true, name: 'company size', type: 'select'},
        industry: {value: vm.industries[0], required: true, name: 'industry', type: 'select'},
        country: {value: vm.countries[0], required: true, name: 'country', type: 'select'},
        description: {value: '', required: false, name: 'description', type: 'enter'}
      };

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'top_data_partners.json')
          .then(function (res) {
            if (res && res.data) {
              vm.pageData = res.data;
            }
          });
      };

      vm.send = function () {
        if (dataValidate.validate(vm.data)) {
          var data = {};
          for (var item in vm.data) {
            if (vm.data[item].type === 'select') {
              data[item] = vm.data[item].value.title;
            } else {
              data[item] = vm.data[item].value;
            }
          }
          $http.get(appConfig.dashboardServiceUrl + 'new_data_partners', {
            params: data
          }).then(function (res) {
            if (res.status === 200) {
              $state.go('thank-you');
            }
          });
        }
      };
    }
  });
