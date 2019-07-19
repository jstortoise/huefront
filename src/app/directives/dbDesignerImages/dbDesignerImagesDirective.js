angular.module('app').directive('hueDbDesignerImages', [
	'$timeout', 'dashboardRepository', function (timeout, dashboardRepository) {
		function link(scope, element, attrs) {
			scope.data = [];
			scope.collectionData = [];
			scope.showCollection = false;
			scope.showImageDetails = false;
			scope.collectionLoading = false;
			scope.imageDetailsData = null;
			window.scr = scope
			scope.page_num = 0;
			scope.page_limit = 18;
			scope.page_count = 1;
			scope.page_num1 = 0;
			scope.page_limit1 = 12;
			scope.page_count1 = 1;
			scope.collectionDataList = [];

			scope.getNumber = function(num) {
				return new Array(num);   
			}

			scope.setPage = function(num) {
				if (num >= 0 && num < scope.page_count) {
					scope.page_num = num;
					adjustPreviewData();
				}
			}

			scope.setPage1 = function(num) {
				if (num >= 0 && num < scope.page_count1) {
					scope.page_num1 = num;
					adjustPreviewData();
				}
			}

			scope.openFullCollection = function (index) {
				scope.page_num = 0;
				// if (scope.collectionLoading)
				//   return;
				scope.collectionData = [];
				dashboardRepository.designer.getDesignerImages(scope.data[index].id, scope.menus)
					.then(function (data) {
						scope.collectionLoading = false;
						scope.collectionData = data;
						timeout(function () {
							scope.showCollection = true;
						}, 300);
						adjustPreviewData();
					});
				scope.collectionLoading = true;
			};

			scope.closeFullCollection = function () {
				scope.showCollection = false;
				adjustPreviewData();
			};

			scope.toggleImageDetails = function () {
				scope.showImageDetails = scope.showImageDetails ? false : true;
			};

			scope.$on('mood_state_changed',function(){
				scope.toggleImageDetails();
			})

			scope.imageClickHandler = function (index) {
				// scope.imageDetailsData = scope.singleDesigner ? scope.data[index] : scope.collectionData[index];
				let data = {
					index: index,
					data: []
				};
				// calc by page num
				data.index = scope.page_num * scope.page_limit + index;
				if (scope.singleDesigner) {
					data.data = scope.data;
				} else {
					data.data = scope.collectionData;
				}
				scope.imageDetailsData = data;
				scope.toggleImageDetails();
			};

			var adjustPreviewData = function () {
				var elemCount = 12;
				var windowWidth = $(window).width();
				scope.page_limit = 18;
				if (windowWidth <= 900) {
					elemCount = 8;
					scope.page_limit = 12;
				}
				if (windowWidth <= 360) {
					elemCount = 2;
					scope.page_limit = 3;
				}
				scope.page_limit1 = elemCount;
				scope.page_count1 = Math.ceil(scope.originalData.length / scope.page_limit1);
				var from = scope.page_num1 * scope.page_limit1;
				var to = (scope.page_num1 + 1) * scope.page_limit1;
				if (scope.originalData.length < to) {
					to = scope.originalData.length;
				}
				// scope.data = scope.originalData.slice(0, elemCount);
				scope.data = scope.originalData.slice(from, to);

				// collection data list
				if (scope.singleDesigner) {
					scope.page_count = Math.ceil(scope.data.length / scope.page_limit);
					if (scope.page_num >= scope.page_count) {
						scope.page_num = scope.page_count - 1;
					}
					var from = scope.page_num * scope.page_limit;
					var to = (scope.page_num + 1) * scope.page_limit;
					if (scope.data.length < to) {
						to = scope.data.length;
					}
					scope.collectionDataList = scope.data.slice(from, to)
				} else {
					scope.page_count = Math.ceil(scope.collectionData.length / scope.page_limit);
					if (scope.page_num >= scope.page_count) {
						scope.page_num = scope.page_count - 1;
					}
					var from = scope.page_num * scope.page_limit;
					var to = (scope.page_num + 1) * scope.page_limit;
					if (scope.collectionData.length < to) {
						to = scope.collectionData.length;
					}
					scope.collectionDataList = scope.collectionData.slice(from, to)
				}
			};

			$(window).resize(function (event) {
				if (!scope.isExpanded) {
					adjustPreviewData();
					scope.$digest();
				}
			});

			scope.$watch('originalData', function (newValue, oldValue) {
				adjustPreviewData();
			});

			scope.$watch('isExpanded', function (newValue, oldValue) {
				scope.showCollection = false;

				if (newValue)
					scope.data = scope.originalData;
				else
					adjustPreviewData();
			});
		}

		return {
			restrict: 'E',
			templateUrl: 'app/directives/dbDesignerImages/dbDesignerImagesView.html',
			link: link,
			scope: {
				originalData: '=data',
				isExpanded: '=',
				singleDesigner: '=',
				yearId: '=',
				seasonId: '=',
				categoryId: '=',
				cityId: '=',
				regionId: '=',
				colorId: '=',
				menus: '='
			}
		};
	}
]);
