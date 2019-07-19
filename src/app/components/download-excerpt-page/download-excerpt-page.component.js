angular
  .module('app')
  .component('downloadExcerptPageComponent', {
    templateUrl: 'app/components/download-excerpt-page/download-excerpt-page.tmpl.html',
    controller: function ($state, $http, appConfig, categoryValues, dataValidate, $stateParams, $window, $scope, localStorageService) {

      var self = this;
      this.jobs = categoryValues('job function');
      this.companySizes = categoryValues('company size');
      this.industries = categoryValues('industry');
      this.countries = categoryValues('country');
      self.flag = false;

      switch ($stateParams.type) {
        case 'reports':
          self.wayBackName = 'reportsDetails';
          break;
        case 'courses':
          self.wayBackName = 'coursesDetails';
          break;
        case 'teachingMaterials':
          self.wayBackName = 'teachingDetailsMaterials';
          break;
        default:
          self.wayBackName = 'profile';

      }

      this.data = {
        first_name: {value: '', required: true, name: 'first name', type: 'provide'},
        last_name: {value: '', required: true, name: 'last name', type: 'provide'},
        email: {value: '', required: true, name: 'email', type: 'provide'},
        company: {value: '', required: true, name: 'company name', type: 'provide'},
        job_title: {value: '', required: true, name: 'job title', type: 'provide'},
        job_function: {value: self.jobs[0], required: true, name: 'job function', type: 'select'},
        company_size: {value: self.companySizes[0], required: true, name: 'company size', type: 'select'},
        industry: {value: self.industries[0], required: true, name: 'industry', type: 'select'},
        country: {value: self.countries[0], required: true, name: 'country', type: 'select'},
        relationship: {expert: true, daily: true, newReportNotification: true, emotionIndexInsights: true},
        contact: {becoming: true}
      };

      this.send = function () {
        if (dataValidate.validate(this.data)) {
          var data = {};
          data.productType = $stateParams.type;
          data.productID = $stateParams.id;
          for (var item in this.data) {
            if (item !== 'relationship' && item !== 'contact') {
              if (this.data[item].type === 'select') {
                data[item] = this.data[item].value.title;
              } else {
                data[item] = this.data[item].value;
              }
            } else if (item === 'relationship') {
              data.relationship = [];
              _.forEach(this.data[item], function (i, k) {
                if (i === true) {
                  data.relationship.push(categoryValues('downloadExcerpt')[k]);
                }
              });
              data.relationship = JSON.stringify(data.relationship);
            } else if (item === 'contact' && this.data.contact.becoming) {
              data.contact = 'Contact about becoming a HUEDATA members';
            }
          }
          $window.open(localStorageService.get('link'), '_blank');
          $http.get(appConfig.dashboardServiceUrl + 'download-excerpt', {
            params: data
          }).then(function (res) {
            $state.go(self.wayBackName, {id: $stateParams.id});
          });
        }
      };
    }
  });
