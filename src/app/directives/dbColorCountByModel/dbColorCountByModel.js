angular.module('app').directive('hueDbColorCountByModel', ['$location', function (location) {
	function link(scope, element, attrs) {
		scope.maxItems = 100;

		scope.$watch('isExpanded', function (newValue, oldValue) {
			if (newValue === true)
				scope.maxItems = 100;
			else if (newValue === false)
				scope.maxItems = 6;
		});
	}

	return {
		restrict: 'E',
		template: '<div class="db-color-count-by-model"><div class="color-count-row" ng-repeat="item in data | limitTo: maxItems"><div class="color-count" ng-bind="::item[0]"></div><div class="color-percentage">{{::item[1]}}</div></div></div>',
		link: link,
		scope: {
			data: '=',
			isExpanded: '='
		}
	};
}]);