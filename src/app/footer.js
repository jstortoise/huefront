angular
  .module('app')
  .component('appFooter', {
    templateUrl: 'app/footer.html',
    controller: function ($state, $scope, $stateParams, scrollService, modalService, $http, appConfig, dataValidate) {
      var self = this;
      this.email = '';
      this.permissions = {
        'Daily Insights': false,
        'Research Partner': false,
        'Education Offerings': false
      };
      this.relationship = {
        'Expert Panelist': false
      };

      this.modalUpdate = function (number) {
        modalService.showModal(number);
      };

      this.scroll = function () {
        scrollService.scrollMember();
      };

      this.submitEmail = function () {
        var data = {
          email: {value: '', required: true, name: 'email', type: 'provide'}
        };
        var permissions = [];
        data.email.value = this.email;

        for (var i in this.permissions) {
          if (this.permissions[i]) {
            permissions.push(i);
          }
        }

        if (dataValidate.validate(data)) {
          data = {
            email: data.email.value,
            permissions: permissions
          };
          if (this.relationship['Expert Panelist']) {
            data.relationship = 'Expert Panelist';
          }
          data.permissions = JSON.stringify(data.permissions);
          $http.get(appConfig.dashboardServiceUrl + 'new_member_email', {
            params: data
          }).then(function (res) {
            if (res.data.status === 'ok') {
              self.email = '';
              modalService.showModal(0, null, ['Thank you for signing up! Welcome to the HUEDATA community! Check your inbox!'], true);
            } else {
              modalService.showModal(0, null, ['Please try again'], false);
            }
          });
        }
      };

      this.hidePrefooter = function () {
        return $state.current.name === 'login' ||
          $state.current.name === 'staffLogin' ||
          $state.current.name === 'privacy' ||
          $state.current.name === 'contact' ||
          $state.current.name === 'terms' ||
          $state.current.name === 'recover' ||
          $state.current.name === 'password-recover' ||
          $state.current.name === 'press';
      };
    }
  });
