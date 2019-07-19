angular
  .module('app')
  .component('contactUsComponent', {
    templateUrl: 'app/components/contact-us/contact-us.tmpl.html',
    controller: function ($state, $http, appConfig, dataValidate) {
      this.data = {
        firstName: {value: '', required: true, name: 'first name', type: 'provide'},
        lastName: {value: '', required: true, name: 'last name', type: 'provide'},
        title: {value: '', required: true, name: 'title', type: ''},
        company: {value: '', required: true, name: 'company name', type: 'provide'},
        phone: {value: '', name: 'phone number', type: 'enter'},
        companyEmail: {value: '', required: true, name: 'company email', type: 'provide'},
        comments: {value: '', required: true, name: 'comments', type: 'enter'}
      };

      this.contactUs = function () {
        if (dataValidate.validate(this.data)) {
          var data = {};
          for (var item in this.data) {
            data[item] = this.data[item].value;
          }
          $http.get(appConfig.dashboardServiceUrl + 'contact_us', {
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
