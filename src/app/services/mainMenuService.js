angular.module('app').service('mainMenuService', function ($rootScope) {
	this.reloadSavedImages = function () {
		$rootScope.$broadcast('mainMenuReloadSavedImages');
	};
});