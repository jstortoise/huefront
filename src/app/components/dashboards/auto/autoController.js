angular.module('app').controller('autoController',
  [
    '$scope',
    'autoDashboardRepository',
    'dashboardOverlayService',
    'searchMenuRepository',
    '$state',
    'anchorSmoothScroll',
    '$location',
    function (scope,
              autoDashboardRepository,
              dashboardOverlayService,
              searchMenuRepository,
              $state, anchorSmoothScroll, $location) {
      // scope.brand = '';
      // scope.year = '';
      // scope.model = '';
      // scope.color = '';

      scope.gotoElement = function (eID) {
        $location.hash('prefooter');
        anchorSmoothScroll.scrollTo(eID);
        $location.hash('');
      };

      scope.menus = {
        brand: '',
        year: '',
        model: '',
        color: ''
      };

      scope.disabledControls = {
        brand: false,
        year: false,
        model: false,
        color: false
      };

      scope.mainParam = null;
      scope.mainParamId = null;
      scope.secondaryParams = {};

      scope.showDashboard = false;
      scope.title = scope.year;
      scope.subtitle = null;

      scope.isLoadingControls = true;

      // Pages info
      scope.brandPageInfo = [
        {width: 2, type: 'desc', tooltip: '#description', data: {text: null}},
        {width: 1, type: 'countTo', tooltip: '#models', data: {subtitle: 'Models', count: 0, menuTab: 'model'}},
        {width: 1, type: 'countTo', tooltip: '#colors', data: {subtitle: 'Colors', count: 0, menuTab: 'color'}}];
      scope.modelPageInfo = [
        {width: 2, type: 'desc', tooltip: '#description', data: {text: null}},
        {width: 1, type: 'countTo', tooltip: '#finishes', data: {subtitle: 'Finishes', count: 0, menuTab: 'finish'}},
        {width: 1, type: 'countTo', tooltip: '#colors', data: {subtitle: 'Colors', count: 0, menuTab: 'color'}}];
      scope.yearPageInfo = [
        {width: 1, type: 'countTo', tooltip: '#finishes', data: {subtitle: 'Finishes', count: 0, menuTab: 'finish'}},
        {width: 1, type: 'countTo', tooltip: '#models', data: {subtitle: 'Models', count: 0, menuTab: 'model'}},
        {width: 1, type: 'countTo', tooltip: '#brands', data: {subtitle: 'Brands', count: 0, menuTab: 'brand'}},
        {width: 1, type: 'countTo', tooltip: '#colors', data: {subtitle: 'Colors', count: 0, menuTab: 'color'}}];
      scope.colorPageInfo = [
        {width: 2, type: 'desc', tooltip: '#description', data: {text: null}},
        {width: 1, type: 'countTo', tooltip: '#brands', data: {subtitle: 'Brands', count: 0, menuTab: 'brand'}},
        {width: 1, type: 'countTo', tooltip: '#colors', data: {subtitle: 'Shades', count: 0, menuTab: 'color'}}];

      scope.compareData = [];
      scope.colorsCountData = [];
      scope.colorsCountData = [];
      scope.shadesData = [];
      scope.topFamiliesData = [];
      scope.topBrandsData = [];
      scope.topColorsData = [];
      scope.colorFrequencyData = [];
      scope.topFinishesData = [];
      scope.carColorsData = [];
      scope.colorPaletteData = [];

      scope.colorPaletteBucket = 38;

      if (!scope.mainParam) {
        $state.go('auto');
      }

      searchMenuRepository.getControlsDataAuto().then(function (data) {
        scope.controlsData = data;
        scope.isLoadingControls = false;
      });

      scope.changeColorPaletteBucket = function (value) {
        if (value !== scope.colorPaletteBucket) {
          autoDashboardRepository[scope.mainParam].getColorPalette(scope.mainParamId, value)
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
          brand: '',
          year: '',
          model: '',
          color: ''
        };
        scope.menus.color = color.id;
        if (!scope.controlsData.colors.find(function (item) {
            return item.id === scope.tempColor.id
          })) {
          scope.controlsData.colors.unshift(scope.tempColor);
        }
        scope.tempColor = null;
        scope.handleChangeControl('color');
        scope.loadGraphics();
      };

      scope.loadGraphics = function () {
        if (scope.mainParam) {
          scope.showDashboard = true;
          dashboardOverlayService.loadingStart(4000);

          autoDashboardRepository[scope.mainParam].getPageData(scope.mainParamId).then(function (data) {
            scope.title = data.title;
            scope.iconUrl = data.logo_url;

            if (scope.mainParam === 'brand') {
              scope.pageInfo[0].data.text = data.description;
              scope.pageInfo[1].data.count = data.models_count;
              scope.pageInfo[2].data.count = data.colors_count;
            } else if (scope.mainParam === 'model') {
              scope.subtitle = data.manufacturer;
              scope.pageInfo[0].data.text = data.description;
              scope.pageInfo[1].data.count = data.finishes_count;
              scope.pageInfo[2].data.count = data.colors_count;
            } else if (scope.mainParam === 'year') {
              scope.manufacturer = data.manufacturer;
              scope.pageInfo[0].data.count = data.finishes_count;
              scope.pageInfo[1].data.count = data.models_count;
              scope.pageInfo[2].data.count = data.brands_count;
              scope.pageInfo[3].data.count = data.colors_count;
            } else if (scope.mainParam === 'color') {
              scope.colorHex = data.color.hex;
              scope.pageInfo[0].data.text = data.description;
              scope.pageInfo[1].data.count = data.brands_count;
              scope.pageInfo[2].data.count = data.shades_count;
            }
          });

          if (scope.mainParam !== 'brand') {
            autoDashboardRepository[scope.mainParam].getCompare(scope.mainParamId)
              .then(function (data) {
                scope.compareData = data;
              });
          }

          if (scope.mainParam === 'brand') {
            autoDashboardRepository[scope.mainParam].getColorsCount(scope.mainParamId)
              .then(function (data) {
                scope.colorsCountData = data;
              });
          }

          if (scope.mainParam !== 'year') {
            autoDashboardRepository[scope.mainParam].getShades(scope.mainParamId)
              .then(function (data) {
                scope.shadesData = data;
              });
          }

          if (scope.mainParam === 'year') {
            autoDashboardRepository[scope.mainParam].getTopFamilies(scope.mainParamId)
              .then(function (data) {
                scope.topFamiliesData = data;
              });
          }

          if (scope.mainParam === 'color') {
            autoDashboardRepository[scope.mainParam].getTopBrands(scope.mainParamId)
              .then(function (data) {
                scope.topBrandsData = data;
              });
          }

          // -------------------------------------------

          autoDashboardRepository[scope.mainParam].getTopColors(scope.mainParamId)
            .then(function (data) {
              scope.topColorsData = data;
            });

          autoDashboardRepository[scope.mainParam].getColorFrequency(scope.mainParamId)
            .then(function (data) {
              scope.colorFrequencyData = data;
            });

          autoDashboardRepository[scope.mainParam].getTopFinishes(scope.mainParamId)
            .then(function (data) {
              scope.topFinishesData = data;
            });

          autoDashboardRepository[scope.mainParam].getCarColors(scope.mainParamId)
            .then(function (data) {
              scope.carColorsData = data;
            });

          autoDashboardRepository[scope.mainParam].getColorPalette(scope.mainParamId, scope.colorPaletteBucket)
            .then(function (data) {
              scope.colorPaletteData = data;
            });
        }
      };

      scope.handleChangeControl = function (control) {
        if (!scope.mainParam) {
          scope.mainParam = control;
          scope.mainParamId = scope.menus[control];
          $state.go(control + 'Auto');
        }

        if (scope.mainParam && scope.menus[scope.mainParam] === '') {
          scope.mainParam = null;
          scope.menus = {
            brand: '',
            year: '',
            model: '',
            color: ''
          };
        }

        switch (scope.mainParam) {
          case 'brand':
            scope.pageInfo = scope.brandPageInfo;
            scope.mainParamId = scope.menus.brand;
            scope.showSeason = false;

            scope.disabledControls = {
              brand: false,
              year: true,
              model: true,
              color: true
            };
            break;

          case 'model':
            scope.pageInfo = scope.modelPageInfo;
            scope.mainParamId = scope.menus.model;
            scope.disabledControls = {
              brand: true,
              model: false,
              year: true,
              color: true
            };
            break;

          case 'year':
            scope.pageInfo = scope.yearPageInfo;
            scope.mainParamId = scope.menus.year;
            scope.disabledControls = {
              brand: true,
              model: true,
              year: false,
              color: true
            };
            break;

          case 'color':
            scope.pageInfo = scope.colorPageInfo;
            scope.mainParamId = scope.menus.color;
            scope.disabledControls = {
              brand: true,
              model: true,
              year: true,
              color: false
            };
            break;

          default:
            $state.go('auto');
            scope.disabledControls = {
              brand: false,
              model: false,
              year: false,
              color: false
            };

            // scope.brand = '';
            // scope.year = '';
            // scope.model = '';
            // scope.color = '';

            scope.menus = {
              brand: '',
              year: '',
              model: '',
              color: ''
            };

            scope.mainParam = null;
            scope.iconUrl = null;
            scope.showDashboard = false;

            scope.compareData = [];
            scope.colorsCountData = [];
            scope.colorsCountData = [];
            scope.shadesData = [];
            scope.topFamiliesData = [];
            scope.topBrandsData = [];
            scope.topColorsData = [];
            scope.colorFrequencyData = [];
            scope.topFinishesData = [];
            scope.carColorsData = [];
            scope.colorPaletteData = [];
            break;
        }
      };

      scope.$watch(function () {
        return dashboardOverlayService.showOverlay;
      }, function (newValue) {
        scope.showDashboardOverlay = newValue;
      });
    }]);
