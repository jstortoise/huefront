angular
  .module('app')
  .component('inquiriesComponent', {
    templateUrl: 'app/components/inquiries/inquiries.tmpl.html',
    controller: function ($state, $http, appConfig, categoryValues, dataValidate) {
      var currentName = $state.current.name;

      var self = this;
      this.jobs = categoryValues('job function');
      this.companySizes = categoryValues('company size');
      this.industries = categoryValues('industry');
      this.countries = categoryValues('country');

      this.data = {
        first_name: {value: '', required: true, name: 'first name', type: 'provide'},
        last_name: {value: '', required: true, name: 'last name', type: 'provide'},
        email: {value: '', required: true, name: 'email', type: 'provide'},
        company: {value: '', required: true, name: 'company name', type: 'provide'},
        job_title: {value: '', required: true, name: 'job title', type: 'provide'},
        job_function: {value: self.jobs[0], required: true, name: 'job function', type: 'select'},
        company_size: {value: self.companySizes[0], required: true, name: 'company size', type: 'select'},
        industry: {value: self.industries[0], required: true, name: 'industry', type: 'select'},
        country: {value: self.countries[0], required: true, name: 'country', type: 'select'}
      };

      switch (currentName) {
        case 'productInquiry':
          this.title = 'Product Inquiry';
          this.keywords = 'Color Product Inquiry, color database, color Product';
          this.data.permissions = {daily: true, research: true, edu: true};
          this.data.relationship = {expert: true};
          this.caption = 'Product Inquiry';
          this.inquire1 = true;
          this.url = 'product_partner';
          break;

        case 'partnershipInquire':
          this.title = 'Data Partnership Inquiry';
          this.keywords = 'Color data partnership, color database, color dataset, color data points in r';
          this.caption = 'Inquire about Data Partnership';
          this.inquire2 = true;
          this.url = 'new_data_partners';
          this.data.description = {value: '', required: false, name: 'description', type: 'enter'};
          break;

        default:
          this.title = 'Education Partnership Inquiry';
          this.keywords = 'Color Education partnership, color database, color Education, color Education points in r';
          this.caption = 'Inquire about Education Partnership';
          this.url = 'new_education_partners';
          this.inquire3 = true;
          this.jobs.splice(1, 0, {id: 7, title: 'Educator'});
          this.data.description = {value: '', required: false, name: 'description', type: 'enter'};
          break;
      }

      this.send = function (inquiryType) {
        if (dataValidate.validate(this.data)) {
          var data = {};
          for (var item in this.data) {
            if (item !== 'permissions' && item !== 'relationship') {
              if (this.data[item].type === 'select') {
                data[item] = this.data[item].value.title;
              } else {
                data[item] = this.data[item].value;
              }
            } else if (item === 'permissions') {
              data.permissions = [];
              _.forEach(this.data[item], function (i, k) {
                if (i === true) {
                  data.permissions.push(categoryValues('permissions')[k]);
                }
              });
              data.permissions = JSON.stringify(data.permissions);
            } else if (item === 'relationship' && this.data.relationship.expert) {
              data.relationship = 'Expert Panelist';
            }
          }
          $http.get(appConfig.dashboardServiceUrl + this.url, {
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
