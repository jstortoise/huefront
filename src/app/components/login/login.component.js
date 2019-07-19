angular.module('app').component('loginComponent', {
	templateUrl: 'app/components/login/login.tmpl.html',
	controller: function (authService, $state, localStorageService, categoryValues, dataValidate, $http, appConfig) {
		var self = this;
		this.email = '';
		this.password = '';
		this.isRemembered = false;
		this.error = '';
		this.response = false;
		this.widgetId = '';
		this.countries = categoryValues('country');
		this.jobs = categoryValues('job function');
		var products = { courses: {}, reports: {}, teaching_materials: {} };
		localStorageService.set('products', products);

		this.registry = {
			first_name: { value: '', required: true, name: 'first name', type: 'provide' },
			last_name: { value: '', required: true, name: 'last name', type: 'provide' },
			email: { value: '', required: true, name: 'email', type: 'provide' },
			job_function: { value: self.jobs[0], required: true, name: 'job function', type: 'select' },
			country: { value: self.countries[0], required: true, name: 'country', type: 'select' },
			password: { value: '', required: true, name: 'password', type: 'provide' },
			sex: { value: 'MR', required: true, name: "sex" },
			repassword: { value: '', required: true, name: "Confirm Password", type: "provide" },
			read: { value: false },
			accept: { value: false },
			ticking: { value: false }
		};

		this.model = {
			key:'6LfDJqwUAAAAACHIqavpN1wTmv8xwZImTU79S2I6'
		};
    
		this.login = function () {
			self.error = false;
			authService.login(this.email, this.password, this.isRemembered).then(function (data) {
				if (data && data.success) {
					$state.go('aboutPage');
				} else {
					self.error = true;
				}
			});
		};

		this.register = function () {

			this.reg_error = false;
			for (item in this.registry) {
				if (this.registry[item].required) {
					if (!this.registry[item].value) {
						this.registry[item].$error = true;
						this.registry[item].$error_msg = 'Please Enter ' + this.registry[item].name;
						this.reg_error = true;
					}
				}
			}

			if (this.registry.password.value != this.registry.repassword.value) {
				this.registry.repassword.$error = true;
				this.registry.repassword.$error_msg = "Confirm Password must be same as Password";
				this.registry.repassword.value = '';
				this.reg_error = true;
			} else {
				this.registry.repassword.$error = false;
			}

			var data = {};
			for (item in this.registry) {
				if (item == 'read' || item == 'ticking' || item == 'accept') {
					if (!this.registry[item].value) {
						this.registry[item].$error = true;
						this.reg_error = true;
					} else {
						this.registry[item].$error = false;
					}
				} else if (item == 'rpassword') {
					this.registry[item].repassword.$error = false;
				} else {
					if (this.registry[item].type == 'select') {
						data[item] = this.registry[item].value.title;
					} else {
						data[item] = this.registry[item].value;
					}
				}
			}

			if (this.reg_error) {
				return;
			} else {
				if (!this.response) {
					this.reg_error = false;
					return;
				}
				$http.get(appConfig.dashboardServiceUrl + 'new_member', {
					params: data
				}).then(function (res) {
					if (res.status === 200) {
						$state.go('thank-you');
					}
				});

				this.response = false;
			}
		};

		this.setResponse = function(res) {
			this.response = res;
		}

		this.setWidgetId = function(widgetId) {
			this.widgetId = widgetId;
		}

		this.cbExpiration = function() {
			vcRecaptchaService.reload(this.widgetId);
            this.response = false;
		}
	}
});
