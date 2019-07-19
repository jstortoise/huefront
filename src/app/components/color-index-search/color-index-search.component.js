angular
	.module('app')
	.component('colorIndexSearchComponent', {
		templateUrl: 'app/components/color-index-search/color-index-search.tmpl.html',
		controller: function (dataValidate, appConfig, $window, $location, anchorSmoothScroll, $http, $scope, searchColor, colorRequest) {
			var vm = this;
			vm.paintColorNamesData = [];
			vm.colorAssociationNames = [];

			this.colorSearch = function () {
				if (this.data.color != ' ') {
					colorRequest.getShortNames(vm.data.color)
						.then(function(data){
							vm.colorValidDataShort = data.short_name;

							if (data && data.short_name.length > 0) {
								vm.paintColorNamesData = data.short_name;
								vm.colorAssociationNames = data.short_namecontains;
								searchColor.set(vm.paintColorNamesData, vm.colorAssociationNames);
								$location.url('/color-index-accordion')
							}
					});
				}
			};
		}
	});
