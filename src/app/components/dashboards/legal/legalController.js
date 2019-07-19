angular.module('app').controller('legalController',
  [
    '$scope',
    'legalDashboardRepository',
    'dashboardOverlayService',
    'searchMenuRepository',
    '$state',
    'anchorSmoothScroll',
    '$location',
    function (scope,
              legalDashboardRepository,
              dashboardOverlayService,
              searchMenuRepository,
              $state, anchorSmoothScroll, $location) {

      // scope.owner = '';
      // scope.year = '';
      // scope.color = '';
      // scope.product = '';

      scope.gotoElement = function (eID) {
        $location.hash('prefooter');
        anchorSmoothScroll.scrollTo(eID);
        $location.hash('');
      };

      scope.menus = {
        owner: '',
        year: '',
        color: '',
        product: ''
      };

      scope.disabledControls = {
        owner: false,
        year: false,
        color: false,
        product: false
      };

      scope.mainParam = null;
      scope.mainParamId = null;

      scope.showDashboard = false;
      scope.title = null;
      scope.subtitle = null;
      scope.copyrightsCountData = null;
      scope.copyrightsListData = null;
      scope.copyrightsListPage = 1;
      scope.copyrightsListTotalPages = 1;

      scope.isLoadingControls = true;

      // Pages info
      scope.ownerPageInfo = [
        {width: 2, type: 'desc', tooltip: '#description', data: {text: null}},
        {width: 1, type: 'countTo', tooltip: '#us_copyrights', data: {subtitle: 'US Copyright', count: 0}},
        {
          width: 1,
          type: 'countTo',
          tooltip: '#international_copyrights',
          data: {subtitle: 'Int\'l Copyright', count: 0}
        }];
      scope.yearPageInfo = [
        {width: 1, type: 'countTo', tooltip: '#owners', data: {subtitle: 'Owners', count: 0, menuTab: 'owner'}},
        {width: 1, type: 'countTo', tooltip: '#products', data: {subtitle: 'Products', count: 0, menuTab: 'product'}},
        {width: 1, type: 'countTo', tooltip: '#us_copyrights', data: {subtitle: 'US Copyright', count: 0}},
        {
          width: 1,
          type: 'countTo',
          tooltip: '#international_copyrights',
          data: {subtitle: 'Int\'l Copyright', count: 0}
        }];
      scope.colorPageInfo = [
        {width: 2, type: 'desc', tooltip: '#description', data: {text: null}},
        {width: 1, type: 'countTo', tooltip: '#us_copyrights', data: {subtitle: 'US Copyright', count: 0}},
        {
          width: 1,
          type: 'countTo',
          tooltip: '#international_copyrights',
          data: {subtitle: 'Int\'l Copyright', count: 0}
        }];
      scope.productPageInfo = [
        {width: 2, type: 'desc', tooltip: '#description', data: {text: null}},
        {width: 1, type: 'countTo', tooltip: '#us_copyrights', data: {subtitle: 'US Copyright', count: 0}},
        {
          width: 1,
          type: 'countTo',
          tooltip: '#international_copyrights',
          data: {subtitle: 'Int\'l Copyright', count: 0}
        }];

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

      if (!scope.mainParam) {
        $state.go('legal');
      }

      scope.cropText = function (text) {
        var sliced = text.trim().slice(0, 37);
        sliced = sliced.trim();
        if (sliced.length < text.length) {
          sliced += '...';
        }
        return sliced;
      };

      searchMenuRepository.getControlsDataLegal().then(function (data) {
        scope.controlsData = data;
        scope.isLoadingControls = false;
      });
      scope.setColorAsMain = function (color) {
        scope.iconUrl = null;
        scope.secondaryParams = {};
        scope.mainParam = null;
        scope.tempColor = color;
        scope.menus = {
          owner: '',
          year: '',
          color: '',
          product: ''
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

      scope.switchPage = function (value) {
        if (value !== scope.copyrightsListPage) {
          legalDashboardRepository[scope.mainParam].getCopyrightsList(scope.mainParamId, value)
            .then(function (data) {
              scope.copyrightsListData = data;
            });
        }
        scope.copyrightsListPage = value;
      };

      scope.loadGraphics = function () {
        if (scope.mainParam) {
          scope.showDashboard = true;
          dashboardOverlayService.loadingStart(4000);

          legalDashboardRepository[scope.mainParam].getPageData(scope.mainParamId).then(function (data) {
            scope.title = data.title;
            scope.iconUrl = data.logo_url;

            scope.copyrightsListTotalPages = Math.ceil((data.us_copyrights + data.int_copyrights) / 25);

            if (scope.mainParam === 'owner') {
              scope.pageInfo[0].data.text = data.description;
              scope.pageInfo[1].data.count = data.us_copyrights;
              scope.pageInfo[2].data.count = data.int_copyrights;
            } else if (scope.mainParam === 'year') {
              scope.pageInfo[0].data.count = data.owners_count;
              scope.pageInfo[1].data.count = data.products_count;
              scope.pageInfo[2].data.count = data.us_copyrights;
              scope.pageInfo[3].data.count = data.int_copyrights;
            } else if (scope.mainParam === 'color') {
              scope.colorHex = data.color.hex;
              scope.pageInfo[0].data.text = data.description;
              scope.pageInfo[1].data.count = data.us_copyrights;
              scope.pageInfo[2].data.count = data.int_copyrights;
            } else if (scope.mainParam === 'product') {
              scope.pageInfo[0].data.text = data.description;
              scope.pageInfo[1].data.count = data.us_copyrights;
              scope.pageInfo[2].data.count = data.int_copyrights;
            }
          });

          legalDashboardRepository[scope.mainParam].getCopyrightsList(scope.mainParamId, scope.copyrightsListPage)
            .then(function (data) {
              scope.copyrightsListData = data;
            });

          if (scope.mainParam !== 'color') {
            legalDashboardRepository[scope.mainParam].getCopyrightsCount(scope.mainParamId)
              .then(function (data) {
                scope.copyrightsCountData = data;
              });
          }

          if (scope.mainParam !== 'owner') {
            legalDashboardRepository[scope.mainParam].getTopOwners(scope.mainParamId)
              .then(function (data) {
                scope.topOwnersData = data;
              });
          }

          if (scope.mainParam === 'color') {
            legalDashboardRepository[scope.mainParam].getTopProducts(scope.mainParamId)
              .then(function (data) {
                scope.topProductsData = data;
              });

            legalDashboardRepository[scope.mainParam].getTopProductsCopyrights(scope.mainParamId)
              .then(function (data) {
                scope.topProductsCopyrightsData = data;
              });

            legalDashboardRepository[scope.mainParam].getCopyrightsOverTime(scope.mainParamId, 20)
              .then(function (data) {
                scope.copyrightsOverTimeData = data;
              });
          }

          if (scope.mainParam === 'year') {
            legalDashboardRepository[scope.mainParam].getCopyrightsActivity(scope.mainParamId)
              .then(function (data) {
                scope.copyrightsActivityData = data;
              });
          }
        }
      };

      scope.handleChangeControl = function (control) {
        scope.copyrightsListPage = 1;

        if (!scope.mainParam) {
          scope.mainParam = control;
          scope.mainParamId = scope.menus[control];
          $state.go(control + 'Legal');
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
          case 'owner':
            scope.pageInfo = scope.ownerPageInfo;
            scope.mainParamId = scope.menus.owner;
            scope.showSeason = false;

            scope.disabledControls = {
              owner: false,
              year: true,
              color: true,
              product: true
            };
            break;

          case 'year':
            scope.pageInfo = scope.yearPageInfo;
            scope.mainParamId = scope.menus.year;
            scope.disabledControls = {
              owner: true,
              year: false,
              color: true,
              product: true
            };
            break;

          case 'color':
            scope.pageInfo = scope.colorPageInfo;
            scope.mainParamId = scope.menus.color;
            scope.disabledControls = {
              owner: true,
              year: true,
              color: false,
              product: true
            };
            break;

          case 'product':
            scope.pageInfo = scope.productPageInfo;
            scope.mainParamId = scope.menus.product;
            scope.disabledControls = {
              owner: true,
              year: true,
              color: true,
              product: false
            };
            break;

          default:
            $state.go('legal');
            scope.disabledControls = {
              owner: false,
              year: false,
              color: false,
              product: false
            };

            // scope.owner = '';
            // scope.year = '';
            // scope.color = '';
            // scope.product = '';

            scope.menus = {
              owner: '',
              year: '',
              color: '',
              product: ''
            };

            scope.mainParam = null;
            scope.iconUrl = null;
            scope.showDashboard = false;
            scope.copyrightsListPage = 1;

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

      // scope.$watch('copyrightsListPage', function (newValue, oldValue) {
      //   if (newValue) {
      //     legalDashboardRepository[scope.mainParam].getCopyrightsList(scope.owner, newValue, function (data) {
      //       scope.copyrightsListData = data;
      //     });
      //   }
      // });

      scope.$watch(function () {
        return dashboardOverlayService.showOverlay;
      }, function (newValue) {
        scope.showDashboardOverlay = newValue;
      });
    }]);
