angular.module('app').service('searchMenuService', function ($rootScope) {
	this.openTab = function (tabName) {
		$rootScope.$broadcast('searchMenuOpenTab', tabName);
	};
});