angular.module('app').directive('hueFiltersConfigurationMenu',
  function ($timeout, authService, searchMenuRepository) {
    function link(scope, element, attrs) {
      scope.letterTabs = ['1-9', 'A-C', 'D-F', 'G-I', 'J-L', 'M-O', 'P-R', 'S-U', 'V-Z'];
      scope.entities = [
        {title: 'Season', mainKey: 'seasons', filterKey: 'fashion_season_id'},
        {title: 'Year', mainKey: 'years', filterKey: 'fashion_year_id'},
        {title: 'Category', mainKey: 'categories', filterKey: 'fashion_category_id'},
        {title: 'City', mainKey: 'cities', filterKey: 'fashion_city_id'},
        {title: 'Color', mainKey: 'colors', filterKey: 'fashion_color_id'},
        {title: 'Designer', mainKey: 'designers', filterKey: 'fashion_designer_id', aplhanumericSelector: true}
      ];
      scope.mainData = null;
      scope.currentUser = null;
      scope.selectedEntity = null;
      scope.selectedEntityIndex = null;
      scope.selectedEntityIds = null;
      scope.selectedOption = null;
      scope.options = [];
      scope.filters = {};

      scope.selectEntity = function (entity) {
        if (entity == null) {
          scope.selectedEntity = null;
          scope.selectedEntityIndex = null;
          scope.selectedEntityIds = null;
          scope.selectedOption = null;
          return;
        }

        var ent = scope.entities[entity];

        scope.selectedEntity = ent;
        scope.selectedEntityIndex = entity;
        scope.selectedOption = null;

        if (!scope.filters[ent.filterKey])
          scope.filters[ent.filterKey] = [];
        scope.selectedEntityIds = scope.filters[ent.filterKey];

        scope.options = scope.mainData[scope.entities[entity].mainKey];
      };
      scope.isEntitySelected = function (entity) {
        return scope.selectedEntityIndex == entity;
      };

      scope.toggleId = function (id) {
        var i = scope.selectedEntityIds.indexOf(id);
        if (i != -1)
          scope.selectedEntityIds.splice(i, 1);
        else
          scope.selectedEntityIds.push(id);
      };
      scope.toggleItem = function (item) {
        scope.toggleId(item.id);
      };
      scope.isIdSelected = function (id) {
        return scope.selectedEntityIds.indexOf(id) != -1;
      };

      scope.resetConfig = function () {
        if (confirm('Are you sure you want to reset all filters?')) {
          _.each(scope.entities, function (item) {
            scope.filters[item.filterKey] = [];
          });
          scope.selectEntity(scope.selectedEntityIndex);
          scope.saveConfig();
        }
      };
      scope.saveConfig = function () {
        authService.currentUser.filters = scope.filters;
        authService.updateUser(function (data) {
          alert("Filters have been updated.");
        });
      };

      searchMenuRepository.getMain(function (data) {
        scope.mainData = data;
      });

      scope.$watch('selectedOption', function (newValue, oldValue) {
        if (newValue) {
          scope.toggleItem(newValue.originalObject);
          $timeout(function () {
            scope.selectedOption = null;
          }, 0);
        }
      });

      scope.$watch(function () {
        return authService.currentUser;
      }, function (newValue, oldValue) {
        scope.currentUser = newValue;
        if (newValue) {
          var f = {};
          _.each(newValue.filters, function (value, key) {
            f[key] = _.clone(value);
          });

          scope.filters = f;

          if (scope.selectedEntity)
            scope.selectEntity(scope.selectedEntityIndex);
        }
      }, true);
    }

    return {
      restrict: 'E',
      templateUrl: 'app/directives/siteHeader/filtersConfigurationMenuView.html',
      link: link,
      scope: {}
    };
  });
