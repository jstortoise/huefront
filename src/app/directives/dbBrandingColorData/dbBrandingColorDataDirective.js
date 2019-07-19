angular.module('app').directive('brandingcolordata', [
	'$timeout', 'dashboardRepository', 'searchMenuRepository',function (timeout, dashboardRepository,searchMenuRepository) {
		function link(scope, element, attrs) {
			scope.data = [];
			scope.showCollection = false;
			scope.showImageDetails = false
			scope.imageDetailsData = null;
			window.scr = scope
			scope.collectionDataList = [];

			scope.showDashboard = true;

		}

		return {
			restrict: 'E',
			templateUrl: 'app/directives/dbBrandingColorData/dbBrandingColorDataView.html',
			link: link,
			scope: {
				originalData: '=data',
				companies:"="
			}
		};
	}
]);
