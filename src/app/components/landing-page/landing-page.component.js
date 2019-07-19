angular
	.module('app')
	.component('landingPageComponent', {
		templateUrl: 'app/components/landing-page/landing-page.tmpl.html',
		controller: function (authService, $scope, $state, localStorageService, $http, searchColor, dataValidate, appConfig, $window, $location, modalService, colorRequest) {
			var vm = this;

			$(document).ready(function () {
				// $('nav').find('li').on('click', 'a', function () {
				// });
			});

			// $(document).ready(function () {
			//
			// 	$('#slideshow > div:gt(0)').hide();
			//
			// 	var interval = setInterval(slide, 3000);
			//
			// 	function intslide(func) {
			// 		if (func == 'start') {
			// 			interval = setInterval(slide, 3000);
			// 		} else {
			// 			clearInterval(interval);
			// 		}
			// 	}
			//
			// 	function slide() {
			// 		sact('next', 0, 2000);
			// 	}
			//
			// 	function sact(a, ix, it) {
			// 		var currentSlide = $('.current');
			// 		var nextSlide = currentSlide.next('.slideitem');
			// 		var prevSlide = currentSlide.prev('.slideitem');
			// 		var reqSlide = $('.slideitem').eq(ix);
			//
			// 		var currentDot = $('.active-dot');
			// 		var nextDot = currentDot.next();
			// 		var prevDot = currentDot.prev();
			// 		var reqDot = $('.dot').eq(ix);
			//
			// 		if (nextSlide.length == 0) {
			// 			nextDot = $('.dot').first();
			// 			nextSlide = $('.slideitem').first();
			// 		}
			//
			// 		if (prevSlide.length == 0) {
			// 			prevDot = $('.dot').last();
			// 			prevSlide = $('.slideitem').last();
			// 		}
			//
			// 		if (a == 'next') {
			// 			var Slide = nextSlide;
			// 			var Dot = nextDot;
			// 		}
			// 		else if (a == 'prev') {
			// 			var Slide = prevSlide;
			// 			var Dot = prevDot;
			// 		}
			// 		else {
			// 			var Slide = reqSlide;
			// 			var Dot = reqDot;
			// 		}
			// 		var it_before = it - 1500;
			// 		currentSlide.fadeOut(it_before).removeClass('current');
			// 		Slide.fadeIn(it).addClass('current');
			// 	}
			// });
//                                                                                                          REPORTS ON LANDING
			$http.get(appConfig.dashboardServiceUrl + 'reports/on_landing.json').then(function (res) {
				vm.reports_on_landing = res.data.reports;
			});

			// this.colorWordSearchLanding = function () {
			// 	var RGB = {'red': $scope.colorRGB_R, 'green': $scope.colorRGB_G, 'blue': $scope.colorRGB_B};
			//
			// 	colorRequest.getRgb(RGB).then(function (data) {
			// 		if (data.rgb) {
			// 			vm.paintColorNames = data.short_name;
			// 			vm.validData = data;
			// 			if (data && data.short_namecontains.length > 0) {
			// 				vm.colorAssociationNames = data.short_namecontains;
			// 				searchColor.set(vm.paintColorNames, vm.colorAssociationNames);
			// 				$location.url('/color-index-accordion');
			// 			}
			// 		} else {
			// 			modalService.showModal(5);
			// 		}
			// 	});
			// };
			const rgbToHex = (r,g,b) => {
				return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
			}

			this.searchByRGB = function () {
				var RGB = {red: $scope.colorRGB_R, green: $scope.colorRGB_G, blue: $scope.colorRGB_B};

				var hexColor = rgbToHex($scope.colorRGB_R, $scope.colorRGB_G, $scope.colorRGB_B);
				var colorNTC = ntc.name(hexColor);

				if (colorNTC[1].slice(0,13) !== "Invalid Color") {
					colorRequest.getRgb(colorNTC[1])
						.then(function(data) {
							console.log('data', data);
							vm.paintColorNamesData = [{colorName: colorNTC[1] , RGB: RGB.red + ',' + RGB.green + ',' + RGB.blue}];
							vm.colorAssociationNames = data.short_namecontains;
							searchColor.set(vm.paintColorNamesData, vm.colorAssociationNames);
							$location.url('/color-index-accordion')
						});
				} else {
					modalService.showModal(5);
				}
			};
		}
	});
