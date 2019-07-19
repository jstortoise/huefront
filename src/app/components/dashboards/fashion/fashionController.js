angular.module('app').controller('fashionController',
	[
		'$scope',
		'dashboardRepository',
		'dashboardOverlayService',
		'dashboardService',
		'exportService',
		'searchMenuRepository',
		'$state',
		'anchorSmoothScroll',
		'$location',
		function (scope,
			dashboardRepository,
			dashboardOverlayService,
			dashboardService,
			exportService,
			searchMenuRepository,
			$state, anchorSmoothScroll, $location) {
			scope.tempColor = null;

			scope.gotoElement = function (eID) {
				$location.hash('prefooter');
				anchorSmoothScroll.scrollTo(eID);
				$location.hash('');
			};

			scope.menus = {
				season: '',
				year: '',
				category: '',
				city: '',
				region: '',
				color: '',
				designer: ''
			};

			scope.disabledControls = {
				season: false,
				year: false,
				category: false,
				region: false,
				city: false,
				color: false,
				designer: false
			};

			scope.controlsParams = function () {
				return {
					season_id: scope.menus.season,
					year: scope.menus.year,
					category_id: scope.menus.category,
					region_id: scope.menus.region,
					city_id: scope.menus.city,
					color_id: scope.menus.color,
					designer_id: scope.menus.designer
				};
			};

			scope.mainParam = null;
			scope.mainParamId = null;
			scope.secondaryParams = {};

			scope.showDashboard = false;
			scope.title = scope.year;
			scope.subtitle = null;

			scope.showSeason = true;
			scope.showYear = true;
			scope.showCategory = true;
			scope.isLoadingControls = true;

			// Pages info
			scope.seasonPageInfo = [
				{
					width: 1, type: 'countTo', tooltip: '#cities',
					data: { subtitle: 'Cities', count: 0, menuTab: 'city' }
				},
				{
					width: 1, type: 'countTo', tooltip: '#regions',
					data: { subtitle: 'Regions', count: 0, menuTab: 'region' }
				},
				{
					width: 1, type: 'countTo', tooltip: '#designers',
					data: { subtitle: 'Designers', count: 0, menuTab: 'designer' }
				},
				{
					width: 1, type: 'countTo', tooltip: '#colors_shades',
					data: { subtitle: 'Colors', count: 0, menuTab: 'color' }
				}];
			scope.colorPageInfo = [
				{ width: 2, type: 'desc', tooltip: '#description', data: { text: null } },
				{
					width: 1,
					type: 'countTo',
					tooltip: '#designers',
					data: { subtitle: 'Designers', count: 0, menuTab: 'designer' }
				},
				{ width: 1, type: 'countTo', tooltip: '#colors_shades', data: { subtitle: 'Colors', count: 0, menuTab: 'color' } }];
			scope.yearPageInfo = [
				{ width: 1, type: 'countTo', tooltip: '#seasons', data: { subtitle: 'Seasons', count: 0, menuTab: 'season' } },
				{ width: 1, type: 'countTo', tooltip: '#cities', data: { subtitle: 'Cities', count: 0, menuTab: 'city' } },
				{
					width: 1,
					type: 'countTo',
					tooltip: '#designers',
					data: { subtitle: 'Designers', count: 0, menuTab: 'designer' }
				},
				{ width: 1, type: 'countTo', tooltip: '#colors_shades', data: { subtitle: 'Colors', count: 0, menuTab: 'color' } }];
			scope.designerPageInfo = [
				{ width: 2, type: 'desc', tooltip: '#description', data: { text: null } },
				{ width: 1, type: 'countTo', data: { subtitle: 'Images', count: 0, menuTab: null } },
				{ width: 1, type: 'countTo', tooltip: '#colors_shades', data: { subtitle: 'Colors', count: 0, menuTab: 'color' } }];
			scope.regionPageInfo = [
				{ width: 1, type: 'countTo', tooltip: '#cities', data: { subtitle: 'Cities', count: 0, menuTab: 'city' } },
				{ width: 1, type: 'countTo', tooltip: '#seasons', data: { subtitle: 'Seasons', count: 0, menuTab: 'season' } },
				{
					width: 1,
					type: 'countTo',
					tooltip: '#designers',
					data: { subtitle: 'Designers', count: 0, menuTab: 'designer' }
				},
				{ width: 1, type: 'countTo', tooltip: '#colors_shades', data: { subtitle: 'Colors', count: 0, menuTab: 'color' } }];
			scope.cityPageInfo = [
				{ width: 2, type: 'desc', tooltip: '#description', data: { text: null } },
				{
					width: 1,
					type: 'countTo',
					tooltip: '#designers',
					data: { subtitle: 'Designers', count: 0, menuTab: 'designer' }
				},
				{ width: 1, type: 'countTo', tooltip: '#colors_shades', data: { subtitle: 'Colors', count: 0, menuTab: 'color' } }];
			scope.categoryPageInfo = [
				{ width: 2, type: 'desc', tooltip: '#description', data: { text: null } },
				{
					width: 1,
					type: 'countTo',
					tooltip: '#designers',
					data: { subtitle: 'Designers', count: 0, menuTab: 'designer' }
				},
				{ width: 1, type: 'countTo', tooltip: '#colors_shades', data: { subtitle: 'Colors', count: 0, menuTab: 'color' } }];

			scope.topColorsData = [];
			scope.colorFrequencyData = [];
			scope.distributionByCategoryData = [];
			scope.colorFrequencyBySeasonData = [];
			scope.colorFrequencyByRegionData = [];
			scope.colorFrequencyByCityData = [];
			scope.topColorsByYearData = [];
			scope.colorPaletteData = [];
			scope.designerImagesData = [];
			scope.colorPaletteBucket = 38;

			if (!scope.mainParam) {
				$state.go('fashion');
			}

			searchMenuRepository.getControlsData().then(function (data) {
				scope.controlsData = data;
				scope.isLoadingControls = false;
			});

			scope.changeColorPaletteBucket = function (value) {
				if (value !== scope.colorPaletteBucket) {
					dashboardRepository[scope.mainParam].getColorPalette(scope.mainParamId, scope.secondaryParams, value)
						.then(function (data) {
							scope.colorPaletteData = data;
						});
				}
				scope.colorPaletteBucket = value;
			};

			scope.setColorAsMain = function (color) {
				scope.iconUrl = null;
				scope.secondaryParams = {};
				scope.mainParam = null;
				scope.tempColor = color;
				scope.menus = {
					season: '',
					year: '',
					category: '',
					city: '',
					region: '',
					color: '',
					designer: ''
				};
				scope.menus.color = color.id;
				scope.handleChangeControl('color');
				scope.loadGraphics();
			};


			window.sc = scope;

			function getParamText(id, prop) {
				var text = '';
				if (id == '') {
					return 'all ' + prop;
				}
				for (var i = 0; i < scope.controlsData[prop].length; i++) {
					var data = scope.controlsData[prop][i];
					if (data.id == id) {
						text = data.title;
						break;
					}
				}
				return text;
			}
	
			scope.header_title = '';
			scope.loadGraphics = function () {
				// update header title
				var data = scope.controlsParams();
				
				scope.header_title = getParamText(data.season_id, 'seasons') + ' ' +
					getParamText(data.year, 'years') + ' / ' +
					getParamText(data.category_id, 'categories');

				if (data.region_id) {
					scope.header_title += ' / ' + getParamText(data.region_id, 'regions');
					if (data.city_id) {
						scope.header_title += ' / ' + getParamText(data.city_id, 'cities');
					}
				} else {
					scope.header_title += ' / ' + getParamText(data.city_id, 'cities');
				}

				scope.title = getParamText(data.season_id, 'seasons');
				scope.subtitle = getParamText(data.year, 'years') + ' ' +
					getParamText(data.category_id, 'categories');

				if (scope.mainParam) {
					scope.showDashboard = true;
					dashboardOverlayService.loadingStart();

					dashboardService.getHeaderSubtitle(scope.menus.season, scope.menus.year, scope.menus.category, scope.showSeason, scope.showYear, scope.showCategory, function (data) {
						// scope.subtitle = data;
					});

					dashboardRepository[scope.mainParam].getPageData(scope.mainParamId, scope.secondaryParams)
						.then(function (data) {
							// scope.title = data.title;
							exportService.title = data.title;
							exportService.season = scope.season;
							exportService.year = scope.year;
							exportService.category = scope.category;

							if (scope.mainParam === 'color') {
								scope.colorHex = data.hex;
								scope.pageInfo[0].data.text = data.description;
								scope.pageInfo[1].data.count = data.designerCount;
								scope.pageInfo[2].data.count = data.shadeCount;
							} else if (scope.mainParam === 'season') {
								scope.pageInfo[0].data.count = data.cityCount;
								scope.pageInfo[1].data.count = data.regionCount;
								scope.pageInfo[2].data.count = data.designerCount;
								scope.pageInfo[3].data.count = data.colorCount;
							} else if (scope.mainParam === 'year') {
								scope.pageInfo[0].data.count = data.seasonCount;
								scope.pageInfo[1].data.count = data.cityCount;
								scope.pageInfo[2].data.count = data.designerCount;
								scope.pageInfo[3].data.count = data.colorCount;
							} else if (scope.mainParam === 'designer') {
								scope.pageInfo[0].data.text = data.description;
								scope.pageInfo[1].data.count = data.imageCount;
								scope.pageInfo[2].data.count = data.colorCount;
							} else if (scope.mainParam === 'region') {
								scope.pageInfo[0].data.count = data.cityCount;
								scope.pageInfo[1].data.count = data.seasonCount;
								scope.pageInfo[2].data.count = data.designerCount;
								scope.pageInfo[3].data.count = data.colorCount;
							} else if (scope.mainParam === 'city') {
								scope.pageInfo[0].data.text = data.description;
								scope.pageInfo[1].data.count = data.designerCount;
								scope.pageInfo[2].data.count = data.colorCount;
							} else if (scope.mainParam === 'category') {
								scope.pageInfo[0].data.text = data.description;
								scope.pageInfo[1].data.count = data.designerCount;
								scope.pageInfo[2].data.count = data.colorCount;
							}
						});

					dashboardRepository[scope.mainParam].getTopColors(scope.mainParamId, scope.secondaryParams)
						.then(function (data) {
							scope.topColorsData = data;
						});

					if (scope.mainParam !== 'color') {
						dashboardRepository[scope.mainParam].getColorFrequency(scope.mainParamId, scope.secondaryParams)
							.then(function (data) {
								scope.colorFrequencyData = data;
							});
					}

					dashboardRepository[scope.mainParam].getTopColorsByYear(scope.mainParamId, scope.secondaryParams)
						.then(function (data) {
							scope.topColorsByYearData = data;

						});

					dashboardRepository[scope.mainParam].getDesignerImages(scope.mainParamId, scope.secondaryParams)
						.then(function (data) {
							scope.designerImagesData = data;

						});

					dashboardRepository[scope.mainParam].getColorPalette(scope.mainParamId, scope.secondaryParams, scope.colorPaletteBucket)
						.then(function (data) {
							scope.colorPaletteData = data;
						});

					// --------

					if (scope.mainParam !== 'city') {
						dashboardRepository[scope.mainParam].getColorFrequencyByCity(scope.mainParamId, scope.secondaryParams)
							.then(function (data) {
								scope.colorFrequencyByCityData = _.filter(data, function (item) {
									return item.colors.length > 0;
								});
							});
					}

					if (scope.mainParam !== 'region') {
						dashboardRepository[scope.mainParam].getColorFrequencyByRegion(scope.mainParamId, scope.secondaryParams)
							.then(function (data) {
								scope.colorFrequencyByRegionData = data;
							});
					}

					if (scope.mainParam !== 'color' && scope.mainParam !== 'category') {
						dashboardRepository[scope.mainParam].getDistributionByCategory(scope.mainParamId, scope.secondaryParams)
							.then(function (data) {
								scope.distributionByCategoryData = data;
							});
					}

					if (scope.mainParam !== 'season') {
						dashboardRepository[scope.mainParam].getColorFrequencyBySeason(scope.mainParamId, scope.secondaryParams)
							.then(function (data) {
								scope.colorFrequencyBySeasonData = _.filter(data, function (item) {
									return item.colors.length > 0;
								});
							});
					}

					// if (scope.mainParam === 'color') {
					//   dashboardRepository[scope.mainParam].getColorFrequencyByCategory(scope.mainParamId, scope.secondaryParams)
					//     .then(function (data) {
					//       scope.colorFrequencyByCategoryData = data;
					//     });
					// }

					// show color graph
					dashboardRepository['color'].getColorFrequencyByCategory(scope.mainParamId, scope.secondaryParams)
						.then(function (data) {
							scope.colorFrequencyByCategoryData = data;
						});
				}
			};

			scope.handleChangeControl = function (control) {
				scope.isLoadingControls = true;

				if (!scope.mainParam) {
					scope.mainParam = control;
					scope.mainParamId = scope.menus[control];
					// if (value.id) {
					//   scope[control] = value;
					// }
					// scope.addAll('remove');
					$state.go(control + 'Fashion');
				}

				if (scope.mainParam && scope.menus[scope.mainParam] === '') {
					scope.mainParam = null;
					scope.menus = {
						season: '',
						year: '',
						category: '',
						city: '',
						region: '',
						color: '',
						designer: ''
					};
					// scope.addAll('remove')
				}

				switch (scope.mainParam) {
					case 'season':
						scope.pageInfo = scope.seasonPageInfo;
						scope.mainParamId = scope.menus.season;
						scope.iconUrl = 'assets/img/icons/seasons/' + scope.mainParamId + '.svg';
						scope.showSeason = false;
						// scope.addAll('add', scope.mainParam);
						scope.disabledControls = {
							season: false,
							year: false,
							category: false,
							region: true,
							city: false,
							color: true,
							designer: true
						};
						scope.secondaryParams = {
							year: scope.menus.year,
							category_id: scope.menus.category,
							city_id: scope.menus.city
						};
						break;

					case 'color':
						scope.pageInfo = scope.colorPageInfo;
						// if (value) {
						//   scope.color = value
						// }
						scope.mainParamId = scope.menus.color;
						// scope.addAll('add', scope.mainParam);
						scope.disabledControls = {
							season: false,
							year: false,
							category: false,
							region: true,
							city: false,
							color: false,
							designer: true
						};
						scope.secondaryParams = {
							season_id: scope.menus.season,
							year: scope.menus.year,
							category_id: scope.menus.category,
							city_id: scope.menus.city
						};
						break;

					case 'year':
						scope.pageInfo = scope.yearPageInfo;
						scope.mainParamId = scope.menus.year;
						scope.showYear = false;
						// scope.addAll('add', scope.mainParam);
						scope.disabledControls = {
							season: false,
							year: false,
							category: false,
							region: true,
							city: false,
							color: true,
							designer: true
						};
						scope.secondaryParams = {
							season_id: scope.menus.season,
							category_id: scope.menus.category,
							city_id: scope.menus.city
						};
						break;

					case 'designer':
						scope.pageInfo = scope.designerPageInfo;
						scope.mainParamId = scope.menus.designer;
						// scope.addAll('add', scope.mainParam);
						scope.disabledControls = {
							season: false,
							year: false,
							category: false,
							region: true,
							city: false,
							color: true,
							designer: false
						};
						scope.secondaryParams = {
							season_id: scope.menus.season,
							year: scope.menus.year,
							category_id: scope.menus.category,
							city_id: scope.menus.city
						};
						break;

					case 'region':
						scope.pageInfo = scope.regionPageInfo;
						scope.mainParamId = scope.menus.region;
						scope.iconUrl = 'assets/img/icons/regions/wbg/' + scope.mainParamId + '.svg';
						// scope.addAll('add', scope.mainParam);
						scope.disabledControls = {
							season: false,
							year: false,
							category: false,
							region: false,
							city: true,
							color: true,
							designer: true
						};
						scope.secondaryParams = {
							season_id: scope.menus.season,
							year: scope.menus.year,
							category_id: scope.menus.category
							// region_id: scope.region
						};
						break;

					case 'city':
						scope.pageInfo = scope.cityPageInfo;
						scope.mainParamId = scope.menus.city;
						scope.iconUrl = 'assets/img/icons/cities/' + scope.mainParamId + '.svg';
						// scope.addAll('add', scope.mainParam);
						scope.disabledControls = {
							season: false,
							year: false,
							category: false,
							region: true,
							city: false,
							color: true,
							designer: true
						};
						scope.secondaryParams = {
							season_id: scope.menus.season,
							year: scope.menus.year,
							category_id: scope.menus.category
						};
						break;

					case 'category':
						scope.pageInfo = scope.categoryPageInfo;
						scope.mainParamId = scope.menus.category;
						scope.iconUrl = 'assets/img/icons/categories/' + scope.mainParamId + '.svg';
						// scope.addAll('add', scope.mainParam);
						scope.showCategory = false;
						scope.disabledControls = {
							season: false,
							year: false,
							category: false,
							region: true,
							city: false,
							color: true,
							designer: true
						};
						scope.secondaryParams = {
							season_id: scope.menus.season,
							year: scope.menus.year,
							city_id: scope.menus.city
						};
						break;

					default:
						$state.go('fashion');
						scope.menus = {
							season: '',
							year: '',
							category: '',
							city: '',
							region: '',
							color: '',
							designer: ''
						};
						// scope.addAll('remove')
						scope.disabledControls = {
							season: false,
							year: false,
							category: false,
							region: false,
							city: false,
							color: false,
							designer: false
						};
						scope.tempColor = null;
						// scope.season = '';
						// scope.year = '';
						// scope.category = '';
						// scope.city = '';
						// scope.region = '';
						// scope.color = '';
						// scope.designer = '';
						scope.mainParam = null;
						scope.iconUrl = null;
						scope.secondaryParams = {};
						scope.showSeason = true;
						scope.showYear = true;
						scope.showCategory = true;
						scope.showDashboard = false;
						scope.topColorsData = [];
						scope.topColorsByYearData = [];
						scope.designerImagesData = [];
						scope.colorPaletteData = [];
						scope.colorFrequencyByCityData = [];
						scope.colorFrequencyByRegionData = [];
						scope.colorFrequencyData = [];
						scope.distributionByCategoryData = [];
						scope.colorFrequencyBySeasonData = [];
						scope.colorFrequencyByCategoryData = [];
						break;
				}
				searchMenuRepository.getControlsData(scope.controlsParams(), true)
					.then(function (data) {
						scope.controlsData = data;
						scope.isLoadingControls = false;

						if (scope.tempColor) {
							if (!scope.controlsData.colors.find(function (item) {
								return item.id === scope.tempColor.id
							})) {
								scope.controlsData.colors.unshift(scope.tempColor);
								scope.menus.color = scope.tempColor.id;
								scope.tempColor = null;
							}
						}
					});
			};

			// scope.$watch('menus.color', function (newValue, oldValue) {
			// });

			scope.$watch(function () {
				return dashboardOverlayService.showOverlay;
			}, function (newValue, oldValue) {
				scope.showDashboardOverlay = newValue;
			});
		}]);
