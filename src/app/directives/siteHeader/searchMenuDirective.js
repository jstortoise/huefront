angular.module('app').directive('hueSearchMenu', ['searchMenuRepository', '$location', 'authService', function (searchMenuRepository, location, authService) {
  function link(scope, element, attrs) {
    scope.tabs = [{name: 'season', title: 'Season'}, {name: 'year', title: 'Year'}, {
      name: 'category',
      title: 'Category'
    }, {name: 'region', title: 'Region'}, {name: 'city', title: 'City'}, {
      name: 'color',
      title: 'Color'
    }, {name: 'designer', title: 'Designer'}];
    scope.letterTabs = ['1-9', 'A-C', 'D-F', 'G-I', 'J-L', 'M-O', 'P-R', 'S-U', 'V-Z'];
    scope.selectLists = {
      'season': {title: 'Select a season', items: [], selectedId: null},
      'year': {title: 'Select a year', items: [], selectedId: null},
      'category': {title: 'Select a category', items: [], selectedId: null},
      'city': {title: 'Select a city', items: [], selectedId: null}
    };
    scope.secondaryCriteria = [['year', 'category', 'city'], ['season', 'category', 'city'], ['season', 'year', 'city'], ['season', 'year', 'category'], ['season', 'year', 'category'], ['season', 'year', 'category', 'city'], ['season', 'year', 'category', 'city']];
    scope.selectListsDisabled = false;

    scope.selectedSeason = null;
    scope.selectedYear = null;
    scope.selectedCategory = null;
    scope.selectedRegion = null;
    scope.selectedCity = null;
    scope.selectedColor = null;
    scope.selectedDesigner = null;

    scope.seasonsData = [];
    scope.yearsData = [];
    scope.categoriesData = [];
    scope.regionsData = [];
    scope.citiesData = [];
    scope.colorsData = [];
    scope.designersData = [];

    var resetSelections = function () {
      scope.selectedSeason = null;
      scope.selectedYear = null;
      scope.selectedCategory = null;
      scope.selectedRegion = null;
      scope.selectedCity = null;
      scope.selectedColor = null;
      scope.selectedDesigner = null;

      _.each(scope.selectLists, function (item) {
        item.selectedId = null;
      });
    };

    var loadListsData = function () {
      var getParam = function (selectList, selectedObject) {
        return selectedObject ? selectedObject.id :
          (selectList ?
            (scope.selectLists[selectList].selectedId == -1 ?
              null : scope.selectLists[selectList].selectedId) : null);
      };

      scope.selectListsDisabled = true;
      searchMenuRepository.getMain(getParam(null, scope.selectedRegion),
        getParam(null, scope.selectedDesigner),
        getParam('category', scope.selectedCategory),
        getParam('season', scope.selectedSeason),
        getParam('year', scope.selectedYear),
        getParam('city', scope.selectedCity), function (data) {
          var filtersSeason = authService.currentUser.filters.fashion_season_id;
          var filtersYear = authService.currentUser.filters.fashion_year_id;
          var filtersCategory = authService.currentUser.filters.fashion_category_id;
          var filtersCity = authService.currentUser.filters.fashion_city_id;

          // scope.selectLists['season'].items = filtersSeason && filtersSeason.length ? _.filter(data.seasons, function (item) {
          //   return _.contains(filtersSeason, item.id);
          // }) : data.seasons;
          // scope.selectLists['year'].items = filtersYear && filtersYear.length ? _.filter(data.years, function (item) {
          //   return _.contains(filtersYear, item.id);
          // }) : data.years;
          // scope.selectLists['category'].items = filtersCategory && filtersCategory.length ? _.filter(data.categories, function (item) {
          //   return _.contains(filtersCategory, item.id);
          // }) : data.categories;
          // scope.selectLists['city'].items = filtersCity && filtersCity.length ? _.filter(data.cities, function (item) {
          //   return _.contains(filtersCity, item.id);
          // }) : data.cities;
          // scope.selectListsDisabled = false;
          // scope.selectLists['season'].items = data.seasons;
          // scope.selectLists['year'].items = data.years;
          // scope.selectLists['category'].items = data.categories;
          // scope.selectLists['city'].items = data.cities;

        }).then(function (data) {
        scope.selectLists['season'].items = data.seasons;
        scope.selectLists['year'].items = data.years;
        scope.selectLists['category'].items = data.categories;
        scope.selectLists['city'].items = data.cities;
      });
    };

    scope.secondaryItemSelected = function () {
      if (_.every(scope.secondaryCriteria[scope.activeTab], function (item) {
          return scope.selectLists[item].selectedId != null;
        })) {
        var params = {};
        switch (scope.activeTab) {
          case 0:
            params.season = scope.selectedSeason.id;
            break;
          case 1:
            params.year = scope.selectedYear.id;
            break;
          case 2:
            params.category = scope.selectedCategory.id;
            break;
          case 3:
            params.region = scope.selectedRegion.id;
            break;
          case 4:
            params.city = scope.selectedCity.id;
            break;
          case 5:
            params.color = scope.selectedColor.id;
            break;
          case 6:
            params.designer = scope.selectedDesigner.id;
            break;
        }

        _.each(scope.secondaryCriteria[scope.activeTab], function (item) {
          if (scope.selectLists[item].selectedId != null && scope.selectLists[item].selectedId != -1)
            params[item] = scope.selectLists[item].selectedId;
        });

        scope.doSearch(scope.tabs[scope.activeTab].name, params);
        resetSelections();
      } else {
        loadListsData();
      }
    };

    scope.selectSeason = function (item) {
      scope.selectedSeason = item;
      scope.setStep(1);
    };

    scope.selectYear = function (item) {
      scope.setStep(1);
    };

    scope.selectCategory = function (item) {
      scope.selectedCategory = item;
      scope.setStep(1);
    };

    scope.selectRegion = function (item) {
      scope.selectedRegion = item;
      scope.setStep(1);
    };

    scope.selectCity = function (item) {
      scope.selectedCity = item;
      scope.setStep(1);
    };

    scope.selectColor = function (item) {
      scope.selectedColor = item;
      scope.setStep(1);
    };

    scope.selectDesigner = function (item) {
      scope.selectedDesigner = item;
      scope.setStep(1);
    };

    var getMainHandler = function (data) {
      // var data = data.data;
      var filtersSeason = authService.currentUser.filters.fashion_season_id;
      var filtersYear = authService.currentUser.filters.fashion_year_id;
      var filtersCategory = authService.currentUser.filters.fashion_category_id;
      var filtersRegion = authService.currentUser.filters.fashion_region_id;
      var filtersCity = authService.currentUser.filters.fashion_city_id;
      var filtersColor = authService.currentUser.filters.fashion_color_id;
      var filtersDesigner = authService.currentUser.filters.fashion_designer_id;

      scope.seasonsData = data.seasons;
      scope.yearsData = data.yearsData;
      scope.categoriesData = data.categoriesData;
      scope.regionsData = data.regionsData;
      scope.citiesData = data.citiesData;
      scope.colorsData = data.colorsData;
      scope.designersData = data.designersData;
      // scope.selectLists['season'].items = filtersSeason && filtersSeason.length ? _.filter(data.seasons, function (item) {
      //   return _.contains(filtersSeason, item.id);
      // }) : data.seasons;
      // scope.yearsData = filtersYear && filtersYear.length ? _.filter(data.years, function (item) {
      //   return _.contains(filtersYear, item.id);
      // }) : data.years;
      // scope.categoriesData = filtersCategory && filtersCategory.length ? _.filter(data.categories, function (item) {
      //   return _.contains(filtersCategory, item.id);
      // }) : data.categories;
      // scope.regionsData = filtersRegion && filtersRegion.length ? _.filter(data.regions, function (item) {
      //   return _.contains(filtersRegion, item.id);
      // }) : data.regions;
      // scope.citiesData = filtersCity && filtersCity.length ? _.filter(data.cities, function (item) {
      //   return _.contains(filtersCity, item.id);
      // }) : data.cities;
      // scope.colorsData = filtersColor && filtersColor.length ? _.filter(data.colors, function (item) {
      //   return _.contains(filtersColor, item.id);
      // }) : data.colors;
      // scope.designersData = filtersDesigner && filtersDesigner.length ? _.filter(data.designers, function (item) {
      //   return _.contains(filtersDesigner, item.id);
      // }) : data.designers;
    };

    //------------------------------------------------------------
    scope.isTrendingVisible = false;
    scope.showTrending = function () {
      scope.isTrendingVisible = true;
    };

    scope.activeStep = 0;
    scope.setStep = function (index) {
      scope.activeStep = index;

      switch (index) {
        case 0:
          resetSelections();
          break;
        case 1:
          loadListsData();
          break;
      }
    };
    scope.isStepActive = function (index) {
      return scope.activeStep == index;
    };

    scope.activeTab = null;
    scope.setTab = function (index) {
      scope.activeTab = index;
      scope.isTrendingVisible = true;
      scope.setStep(0);
    };
    scope.isTabActive = function (index) {
      return scope.activeTab == index;
    };

    scope.doSearch = function (page, params) {
      location.url(page).search(params);
      scope.hide();
      scope.setTab(scope.activeTab);
      scope.setStep(0);
    };

    scope.$on('searchMenuOpenTab', function (event, tabName) {
      scope.setTab(_.findIndex(scope.tabs, function (item) {
        return item.name == tabName;
      }));
    });
    scope.$watch(function () {
      return authService.currentUser;
    }, function (newValue, oldValue) {
      if (newValue) {
        searchMenuRepository.getMain(getMainHandler);
      }
    });

    scope.$watch('selectedYear', function (newValue, oldValue) {
      if (newValue)
        scope.selectYear(newValue.originalObject);
    });
    scope.$watch('selectedColor', function (newValue, oldValue) {
      if (newValue && newValue.originalObject) //only for autocomplete
        scope.selectColor(newValue.originalObject);
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/siteHeader/searchMenuView.html',
    link: link,
    scope: {
      show: '=',
      hide: '&'
    }
  };
}]);
