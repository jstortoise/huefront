angular.module('app').controller('contentFashionController', [
	'$scope', 'appConfig', 'charts', '$q', '$interpolate', 'repo.meta', 'common', '$http', 'authService',
	function(scope, appConfig, charts, $q, $interpolate, meta, common, $http, authService) {
		var vm = this;

		vm.meta = {};
		vm.filter = {};
		vm.grayList = {};

		scope.tab = 1;

		scope.graphIndex = 0;
		scope.showGraph = false;

		scope.selected_index = 0;
		scope.selected_image = false;
		scope.selected_moodboard = {};
		scope.images = [];
		scope.moodboards_name = '';
		scope.state = 1;

		scope.subscribed = true;

		// check if subscribed
		function checkSubscribed() {
			if (authService.token) {
				scope.subscribed = true;
			} else {
				$http({	
					url: appConfig.dashboardServiceUrl + 'api/subscribed.json',
					method: 'GET',
					headers: {
						Authorizing: authService.token,
						"Content-Type": 'application/json'
					},
					success: function() {
						scope.subscribed = true;
					},
					error: function() {
						scope.subscribed = false;
					}
				}).catch(function(err) {
					scope.subscribed = false;
				});
			}
		}
		checkSubscribed();

		scope.closeSubscribe = function() {
			scope.subscribed = true;
		}

		scope.subscribe = function() {
			scope.subscribed = true;
		}

		scope.getModel = function(index) {
			return vm.models[index];
		}

		scope.getTitle = function(index) {
			return vm.titles[index];
		}

		scope.getDescription = function(index) {
			return vm.descriptions[index];
		}

		scope.showGraphDialog = function(index) {
			scope.graphIndex = index;
			scope.showGraph = true;
		}

		scope.jquery_init = function() {
			 $( "#moodboard_item" ).sortable({
		    	update: function() {
		    		var order = [];
		    		$('#moodboard_item').find('.board-items').each(function() {
		    			if ($(this).attr('attr_id')) {
		    				order.push($(this).attr('attr_id'));
		    			}
		    		});

		    		$http({	
		    			url: appConfig.dashboardServiceUrl + 'api/moodboards/' + scope.selected_moodboard.id + '/items/item_order.json',
		    			method: 'PUT',
		    			headers: {
							Authorizing: authService.token,
							"Content-Type": 'application/json'
						},
		    			data: { item_ids: order },
		    			success: function() {}
		    		});
		    	}
		    });
		    $("#moodboard_item").disableSelection();

		    $('#board_container').sortable({
				update: function() {
					var order = [];
					$('div.board').each(function() {
						if ($(this).attr('attr_id')) {
							order.push($(this).attr('attr_id'));
						}
					});

					$http({
		    			url: appConfig.dashboardServiceUrl + 'api/moodboards/moodboard_order.json',
		    			method: 'PUT',
		    			headers: {
							Authorizing: authService.token,
							"Content-Type": 'application/json'
						},
		    			data: { moodboard_ids: order },
		    			success: function() {}
					});
				}
		    });
		}

		prepare_moodboard();
		function prepare_moodboard() {
			$http({
				url: (appConfig.dashboardServiceUrl + 'api/moodboards.json'),
				method: "GET",
				headers: { Authorizing: authService.token, "Content-Type": "application/json" },
				params: {}
			}).then(function(res) {
				scope.images = res.data;
				proceed();
			})
		}

		function proceed() {
			for (item in scope.images) {
				get_image_from_item(scope.images[item].id, function(data) {
					for (item_data in scope.images) {
						if (scope.images[item_data].id == data.id) {
							scope.images[item_data].imagedata = data.data;
							if (data.data.length) {
								scope.images[item_data].url = data.data[0].url;
								scope.images[item_data].date_created = data.data[0].date_created;
								scope.images[item_data].date_last_saved = data.data[0].date_last_saved;
							} else {
								scope.images[item_data].url = 'assets/images/empty.png';
								scope.images[item_data].isEmpty = true;
							}
							break;						
						}
					}
				});
			}
		}

		function get_image_from_item(item, callback) {
			$http({
				url: (appConfig.dashboardServiceUrl + 'api/moodboards/' + item + '/items.json'),
				method: "GET",
				headers: { Authorizing: authService.token, "Content-Type": "application/json" },
				params: {}
			}).then(function(res) {
				callback({ id: item, data: res.data });
			});
		}

		scope.save_moodboardname = function(name) {
			if (name) {
				$http({
					url: (appConfig.dashboardServiceUrl + 'api/moodboards/' + scope.selected_moodboard.id + '.json'),
					method: 'PUT',
					headers: { Authorizing: authService.token, "Content-Type": "application/json" },
					data: { moodboard: { title: name } }
				}).then(function(res) {
					scope.selected_moodboard.title = res.data.title;
					scope.rename = false;
				});
			} else {
				alert('Please type in moodboards name');
			}
		}

		scope.selected_moodboards = function(item) {
			scope.selected_moodboard = item;
			scope.state = 6;
		}

		scope.add_image = function(item) {
			if (scope.selected_image) {
				$http({
					url: (appConfig.dashboardServiceUrl + 'api/moodboards/' + item.id + '/items.json'),
					method: "POST",
					headers: { Authorizing: authService.token, "Content-Type": "application/json" },
					data: { item_id: scope.selected_image.image_id }
				}).then(function() {
					scope.state = 4;
					scope.selected_moodboard = item;
					$http({
						url: (appConfig.dashboardServiceUrl + 'api/moodboards/' + item.id + '/items.json'),
						method: "GET",
						headers: { Authorizing: authService.token, "Content-Type": "application/json" }
					}).then(function(res_item) {
						scope.selected_moodboard.imagedata = res_item.data;
					});
				});
			}
		}

		scope.printpdf = function() {
		}

		scope.print = function() {
			window.open(appConfig.dashboardServiceUrl + 'api/moodboards/' + scope.selected_moodboard.id + '/print?token=' + authService.token);
		}
		
		scope.deletemoodboard = function() {
			if (scope.selected_moodboard.id) {
				$http({
					url: (appConfig.dashboardServiceUrl + 'api/moodboards/' + scope.selected_moodboard.id + '.json'),
					method: 'DELETE',
					headers: { Authorizing: authService.token, "Content-Type": "application/json" }
				}).then(function() {
					scope.state = 1;
					scope.trash_dialog = false;
					prepare_moodboard();
				});
			}
		}

		scope.createmoodboard = function(name) {
			if (name) {
				$http({
					url: (appConfig.dashboardServiceUrl + 'api/moodboards.json'),
					method: "POST",
					headers: { Authorizing: authService.token, "Content-Type": "application/json" },
					data: { moodboard: { title: name } }
				}).then(function(res) {
					if (scope.selected_image) {
						$http({
							url: appConfig.dashboardServiceUrl + 'api/moodboards/' + res.data.id + '/items.json',
							method: "POST",
							headers: { Authorizing: authService.token, "Content-Type": "application/json" },
							data: { item_id: scope.selected_image.id }
						}).then(function() {
							prepare_moodboard();

							for (item in scope.images) {
								if (scope.images[item].id == res.data.id) {
									scope.selected_moodboard = scope.images[item];
									break;
								}
							}
							scope.state = 4;
						});
					} else {
						prepare_moodboard();
						scope.selected_moodboard = scope.images[0];
						scope.state = 1;
					}
				});
			} else {}
		}

		scope.remove_image = function(image) {
			$http({
				url: (appConfig.dashboardServiceUrl + 'api/moodboards/' + scope.selected_moodboard.id + '/items/' + image.id + '.json'),
				method: "DELETE",
				headers: { Authorizing: authService.token, "Content-Type": "application/json" }
			}).then(function onSuccess(res) {
				$http({
					url: (appConfig.dashboardServiceUrl + 'api/moodboards/' + scope.selected_moodboard.id + '/items.json'),
					method: "GET",
					headers: { Authorizing: authService.token, "Content-Type": "application/json" }
				}).then(function(res) {
					scope.selected_moodboard.imagedata = res.data;
					
				})
			}, function onError() {}
			);
		}

		scope.addmoodboard = function() {
			scope.state = 5;
			scope.selected_image = false;
		}

		scope.select_index = function(index) {
			scope.selected_index = index;
		}

		scope.isState = function(state) {
			return scope.state == state;
		}

		scope.setState = function(state) {
			scope.state = state;
		}

		scope.isShowGraphDialog = function() {
			return scope.showGraph;
		}

		scope.closeGraphDialog = function() {
			scope.showGraph = false;
		}

		var cache = {
			designers: [],
			categories: [],
			regions: {},
			cities: []
		};

		function getObject(id, prop) {
			var obj = {
				id: "all",
				title: "all"
			};

			if (id == "") {
				return obj;
			}

			for (var i = 0; i < scope.controlsData[prop].length; i++) {
				var data = scope.controlsData[prop][i];
				if (data.id == id) {
					obj = data;
					break;
				}
			}
			return obj;
		}

		vm.prepareRequestParams = function() {
			var params = {
				city: getObject(scope.menus.city, 'cities').title,
				year: scope.menus.year == "" ? "all" : scope.menus.year,
				season: getObject(scope.menus.season, 'seasons').title,
				category: getObject(scope.menus.category, 'categories').title,
				region: scope.menus.region == "" ? "all" : scope.menus.region,
				designer: getObject(scope.menus.designer, 'designers').title
			};

			return params;
		};

		vm.prepareColorsParams = function() {
			var param = {};
			if (scope.menus.city != "") {
				param.city_id = scope.menus.city;
			}
			if (scope.menus.season != "") {
				param.season_id = scope.menus.season;
			}
			if (scope.menus.category != "") {
				param.category_id = scope.menus.category;
			}
			if (scope.menus.designer != "") {
				param.designer_id = scope.menus.designer;
			}

			if (scope.menus.year == "") {
				param.year_id = "all";
			} else {
				param.year_id = scope.menus.year;
			}

			return param;
		};

		vm.prepareColors = function() {
			if (scope.menus.season != "") {
				return { all: getObject(scope.menus.season, 'seasons'), category: 'season' };
			}
			if (scope.menus.city != "") {
				return { all: getObject(scope.menus.city, 'cities'), category: 'city' };
			}
			if (scope.menus.category != "") {
				return { all: getObject(scope.menus.category, 'categories'), category: 'category' };
			}
			if (scope.menus.designer != "") {
				return { all: getObject(scope.menus.designer, 'desingers'), category: 'designer' };
			}
			return { all: { id: 2018 }, category: 'year' };
		};

		scope.setTab = function(tabId) {
			scope.tab = tabId;
			scope.select_images = false;
			scope.selected_moodboard = false;
			scope.state = 1;
			prepare_moodboard();

		};

		scope.isSet = function(tabId) {
			return scope.tab === tabId;
		};

		 scope.shareFacebook = function() {
		 	var array = {};
		 	array['share'] = [];
		 	for (var i = 0; i < scope.selected_moodboard.imagedata.length; i++) {
				var data = scope.selected_moodboard.imagedata[i]['url'];
				array['share'].push(data);
			}
			window.open('https://www.facebook.com/sharer/sharer.php?u=' + array['share'].join(','));
	    }

	    scope.shareTwitter = function() {
		 	var array = {};
		 	array['share'] = [];
		 	for (var i = 0; i < scope.selected_moodboard.imagedata.length; i++) {
				var data = scope.selected_moodboard.imagedata[i]['url'];
				array['share'].push(data);
			}
			window.open('https://twitter.com/home?status=' +  array['share'].join(','));
	    }

	    scope.sharePinterest = function() {
		 	var array = {};
		 	array['share'] = [];
		 	for (var i = 0; i < scope.selected_moodboard.imagedata.length; i++) {
				var data = scope.selected_moodboard.imagedata[i]['url'];
				array['share'].push(data);
			}
			window.open('https://pinterest.com/pin/create/button/?url=' +  array['share'].join(','));
		}
		
	    scope.shareGooglePlus = function() {
		 	var array = {};
		 	array['share'] = [];
		 	for (var i = 0; i < scope.selected_moodboard.imagedata.length; i++) {
				var data = scope.selected_moodboard.imagedata[i]['url'];
				array['share'].push(data);
			}
			window.open('https://plus.google.com/share?url=' +  array['share'].join(','));
	    }

		scope.topColorsExpanded = false;
		scope.toggleTopColorsExpandedMode = function() {
			scope.topColorsExpanded = !scope.topColorsExpanded;
		};

		scope.colorFrequencyExpanded = false;
		scope.toggleColorFrequencyExpandedMode = function() {
			scope.colorFrequencyExpanded = !scope.colorFrequencyExpanded;
		};

		scope.colorFrequencyByRegionExpanded = false;
		scope.toggleColorFrequencyByRegionExpandedMode = function() {
			scope.colorFrequencyByRegionExpanded = !scope.colorFrequencyByRegionExpanded;
		};

		scope.colorFrequencyByCityExpanded = false;
		scope.toggleColorFrequencyByCityExpandedMode = function() {
			scope.colorFrequencyByCityExpanded = !scope.colorFrequencyByCityExpanded;
		};

		scope.colorPaletteExpanded = false;
		scope.toggleColorPaletteExpandedMode = function() {
			scope.colorPaletteExpanded = !scope.colorPaletteExpanded;
		};

		scope.designerImagesExpanded = false;
		scope.toggleDesignerImagesExpandedMode = function() {
			scope.designerImagesExpanded = !scope.designerImagesExpanded;
		};

		scope.$on('mood_state_changed', function(event, value) {
			scope.selected_image = value;
			if (scope.images.length == 0) {
				scope.state = 1;
				scope.tab = 3;
			} else {
				scope.state = 3;
				scope.tab = 3;
			}
		});

		scope.rename = false;
		scope.rename_board = function() {
			scope.rename = true;
			scope.state = 6;
		}

		scope.send_email = function(email) {
			if (email) {
				$http({
					url: appConfig.dashboardServiceUrl + 'api/moodboards/' + scope.selected_moodboard.id + '/email.json',
					method: 'POST',
					headers: {
						Authorizing: authService.token,
						"Content-Type": 'application/json'
					},
					data: { email_to: email }
				}).then(function() {
					scope.share_dialog = false;
				});
			}
		}

		scope.share = function() {
			scope.share_dialog = true;
		}

		scope.close_share = function() {
			scope.share_dialog = false;
		}

		scope.trash_alt = function() {
			scope.trash_dialog = true;
		}

		scope.close_trash = function() {
			scope.trash_dialog = false;
		}

		scope.toggleDialog = function() {
			scope.rename = false;
		}

		vm.charts = [];
		scope.$watch('menus', function(data) {
			vm.charts = [{
				qNumber: 'CO2a',
				id: 'colorsUniqueWithLevels',
				group: 'colorsUniqueWithLevels',
				title: 'Color Mosaic View With Popularity',
				chartTitle: 'Color Mosaic View With Popularity {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
				api: function() {
					return charts.colorsUniqueGroups(vm.prepareRequestParams());
				},
				filters: {
					category: true,
					season: true,
					year: true,
					region: true,
					city: true
				},
				titleGroups: [
					['category', 'season', 'year'],
					['region']
				]
			}, {
				qNumber: 'CO3a',
				id: 'trends',
				group: 'trends',
				title: 'Five Year Color Comparison',
				chartTitle: 'Five Year Color Comparison {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
				api: function() {
					var yearsRange = _.range(data.year - 4, data.year + 1);
					var customParams = vm.prepareRequestParams();

					if (data.year == 'all') {
						yearsRange = _.range(vm.meta.years[1].title - 4, vm.meta.years[1].title + 1);
					} else if (yearsRange[0] < vm.meta.years[vm.meta.years.length - 1].title) {
						yearsRange = _.range(vm.meta.years[vm.meta.years.length - 1].title, vm.meta.years[vm.meta.years.length - 1].title + 5);
					}

					return $q.all(_.map(yearsRange, function(year) {
						customParams.year = year;
						return charts.colorGroupsByCityPeriod(customParams);
					})).then(function(results) {
						return _.map(results, function(result, i) {
							return {
								title: yearsRange[i],
								data: result
							};
						});
					});
				},
				filters: {
					category: true,
					season: true,
					year: true,
					region: true,
					city: true
				},
				titleGroups: [
					['category', 'season', 'year'],
					['region']
				]
			}, {
				qNumber: 'CA1a',
				id: 'colorsByCategoryPeriod',
				group: 'colorsByCategoryPeriod',
				title: 'Color Popularity By Category',
				chartTitle: 'Color Popularity By Category {{vm.parseTitle(0)}} {{vm.parseTitle(1)}}',
				api: function() {
					return charts.colorGroupsByCityPeriod(vm.prepareRequestParams());
				},
				filters: {
					category: true,
					season: true,
					year: true,
					region: true,
					city: true
				},
				titleGroups: [
					['category', 'season', 'year'],
					['region']
				]
			}];
		});

		vm.models = [];
		vm.titles = [];
		vm.descriptions = [];

		// Behaviour
		meta.objects().then(function(result) {
			var years = [];
			for (var i = result.years.to; i >= result.years.from; i--) {
				years.push({ id: i, title: i });
			}

			vm.meta.years = years;
			vm.meta.colorGroups = result.colorGroups;
			vm.meta.categories = result.categories;
			vm.meta.seasons = result.seasons;
			vm.meta.regions = common.generic.regions;
			vm.meta.cities = result.cities;

			_.each(vm.meta, function(item, key) {
				var newTitle = 'All ' + key;
				if (key !== 'colorGroups') {
					item.unshift({ id: 'all', title: newTitle.toUpperCase(), region: 'all', serverName: 'all', all: true })
				}
			});

			angular.copy(vm.meta.cities, cache.cities);

			vm.charts.forEach(function(currentChart, i) {
				vm.models[i] = null;
				vm.titles[i] = '';
				vm.descriptions[i] = '';

				currentChart.api().then(function(result) {
					vm.models[i] = result;
					if (vm.charts[i].apiAfter) {
						vm.charts[i].apiAfter(vm.models[i], result);
					}
					vm.titles[i] = prepareTitle(vm.charts[i].chartTitle);
					prepareDescription(i);
				});
			});

		});

		function prepareTitle(title) {
			var exp = $interpolate(title);
			return exp(scope);
		}
		
		function prepareDescription(i) {
			vm.descriptions[i] = vm.descriptions[i] || (scope.menus.year + ' | COLORS-' + vm.charts[i].qNumber + ' | CITIES-' +
				scope.menus.city + ' | REGIONS-' + scope.menus.region + ' | DESIGNER-' + scope.menus.designer +
				' | SEASONS-' + scope.menus.season);

			var regionId = null;
			switch (scope.menus.region) {
				case 'europe':
					regionId = 2;
					break;
				case 'north_america':
					regionId = 3;
					break;
				case 'latin_america':
					regionId = 4;
					break;
				case 'asia_pacific':
					regionId = 1;
					break;
			}

			var yearFrom = null;
			var yearTo = scope.menus.year === 'all' ? vm.meta.years[1].title : scope.menus.year;
			if (vm.charts[i].qNumber === 'CO3a' || vm.charts[i].qNumber === 'SE2a' || vm.charts[i].qNumber === 'SE2b') {
				yearFrom = yearTo - 4;
			} else if (vm.charts[i].qNumber === 'CA3a' || vm.charts[i].qNumber === 'CA3b') {
				yearFrom = yearTo - 2;
			} else if (vm.charts[i].qNumber === 'DE2a' || vm.charts[i].qNumber === 'DE2b') {
				yearFrom = yearTo - 1;
			}
			
			$http({
				url: (appConfig.webServiceUrl + 'stats'),
				method: 'GET',
				params: {
					fashionSeason: scope.menus.season === 'all' ? null : scope.menus.season,
					fashionDesigner: scope.menus.designer === 'all' ? null : scope.menus.designer,
					fashionRegion: regionId || null,
					fashionCity: scope.menus.city === 'all' ? null : scope.menus.city,
					fashionCategory: scope.menus.category === 'all' ? null : scope.menus.category,
					fashionYear: yearFrom || scope.menus.year === 'all' ? null : scope.menus.year,
					yearFrom: yearFrom || null,
					yearTo: yearFrom ? yearTo : null
				}
			}).then(function(res) {
				// vm.grayList = res.data.data;
				vm.descriptions[i] = 'YEARS-' + res.data.counts.years + ' | COLORS-' + res.data.counts.colors +
					' | CITIES-' + res.data.counts.cities + ' | REGIONS-' + res.data.counts.regions +
					' | DESIGNER-' + res.data.counts.designers + ' | SEASONS-' + res.data.counts.seasons;
			});
		}
	}
]);
