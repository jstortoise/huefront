angular
  .module('app')
  .component('profileComponent', {
    templateUrl: 'app/components/profile/profile.tmpl.html',
    controller: function ($state, $http, appConfig, categoryValues, dataValidate, localStorageService, authService, $scope, $q, $timeout, Upload) {
      var vm = this;
      $scope.uploadFiles = function (file) {
        if (file.$ngfBlobUrl) {
          vm.userData.image_url = file.$ngfBlobUrl;
          file.upload = Upload.upload({
            url: appConfig.dashboardServiceUrl + 'members/' + vm.userID + '.json',
            method: 'PUT',
            fields: {'member[image]': file, flag: true},
            file: file,
            fileFormDataName: 'member[image]'
          });
        }
      };

      vm.job_function = categoryValues('job function');
      vm.country = categoryValues('country');
      vm.industry = categoryValues('industry');
      vm.company_size = categoryValues('company size');
      vm.editFlag = false;
      vm.fileFlag = true;

      vm.init = function () {
        authService.loadCurrentUser().then(function (res) {
          vm.userID = res.data.user.id;
          $http.get(appConfig.dashboardServiceUrl + 'members/' + vm.userID + '.json', {params: {token: authService.token}})
            .then(function (res) {
              if (res && res.data) {
                vm.userData = res.data;
                vm.date = moment(vm.userData.date_year + '-' + vm.userData.date_month + '-' + vm.userData.date_day).format('YYYY-MM-DD');

                vm.indexes = {
                  job_function: vm.searchIndex(vm.job_function, vm.userData.job_function),
                  company_size: vm.searchIndex(vm.company_size, vm.userData.company_size),
                  country: vm.searchIndex(vm.country, vm.userData.country),
                  industry: vm.searchIndex(vm.industry, vm.userData.industry)
                };
                vm.intEditData();
              }
            });
        });
      };

      vm.intEditData = function () {
        vm.data = {
          first_name: {value: vm.userData.first_name, required: true, name: 'first name', type: 'provide'},
          last_name: {value: vm.userData.last_name, required: true, name: 'last name', type: 'provide'},
          email: {value: vm.userData.email, required: true, name: 'email', type: 'provide'},
          company: {value: vm.userData.company, required: true, name: 'company name', type: 'provide'},
          job_title: {value: vm.userData.job_title, required: true, name: 'job title', type: 'provide'},
          bio: {value: vm.userData.bio, name: 'bio', type: 'provide'},
          job_function: {
            value: vm.job_function[vm.indexes.job_function] || vm.userData.job_function,
            required: true,
            name: 'job function',
            type: 'select'
          },
          company_size: {
            value: vm.company_size[vm.indexes.company_size] || vm.userData.company_size,
            required: true,
            name: 'company size',
            type: 'select'
          },
          industry: {
            value: vm.industry[vm.indexes.country] || vm.userData.industry,
            required: true,
            name: 'industry',
            type: 'select'
          },
          country: {
            value: vm.country[vm.indexes.industry] || vm.userData.country,
            required: true,
            name: 'country',
            type: 'select'
          }
        };
      };

      vm.searchIndex = function (arr, value) {
        return _.findIndex(arr, function (item) {
          return item.title === value;
        });
      };

      vm.goCart = function () {
        $state.go('cart-page', {wayBack: 'profile'});
      };

      vm.goPurchase = function () {
        $state.go('my-purchases');
      };

      vm.cancel = function () {
        vm.editFlag = false;
        vm.intEditData();
      };

      vm.save = function () {
        if (dataValidate.validate(vm.data)) {
          var data = {};
          for (var item in vm.data) {
            if (vm.data[item].type === 'select') {
              data[item] = vm.data[item].value.title;
            } else {
              data[item] = vm.data[item].value;
            }
          }
          data.flag = 'profile';
          data.token = authService.token;
          $http.put(appConfig.dashboardServiceUrl + 'members/' + vm.userID, data)
            .then(function (res) {
              if (res.status !== 200) {
                console.log(res);
              }
            });
          vm.editFlag = false;
        }
      };

      vm.editProfile = function () {
        for (var key in vm.indexes) {
          if (vm.indexes[key] < 0) {
            vm.data[key].value = vm[key][0];
          }
        }
        vm.editFlag = true;
      };
    }
  });
