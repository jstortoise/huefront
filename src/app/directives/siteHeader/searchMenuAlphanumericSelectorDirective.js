angular.module('app').directive('hueSearchMenuAlphanumericSelector', function (userDataRepository) {
  function link(scope, element, attrs) {
    scope.groups = null;
    scope.activeTab = 0;
    scope.setTab = function (index) {
      scope.activeTab = index;
    };
    scope.isTabActive = function (index) {
      return scope.activeTab == index;
    };

    scope.isItemSelected = function (id) {
      return scope.multiselectIds.indexOf(id) != -1;
    };

    scope.$watch('data', function (newValue, oldValue) {
      if (newValue) {
        scope.groups = [];
        _.each(scope.tabs, function (tab, tabIndex) {
          var groups = [];
          var charStart = tab.charCodeAt(0);
          var charEnd = tab.charCodeAt(2);

          for (var i = charStart; i <= charEnd; i++) { //for letters (subgroups)
            var items = _.filter(scope.data, function (item) {
              return item.title.toUpperCase().charCodeAt(0) == i
            });
            if (!items.length)
              continue;

            groups.push({title: String.fromCharCode(i), items: items});
          }

          scope.groups[tabIndex] = groups;
        });
      }
    });
  }

  return {
    restrict: 'E',
    template: '<div class="search-alphanumeric-selector" ng-class="{multiselect: multiselectIds}">'
    + '<ul class="group-tabs disable-text-selection"><li ng-repeat="item in tabs" ng-class="{active: isTabActive($index)}" ng-click="setTab($index)" ng-bind="item"></li></ul>'
    + '<div class="items-group" ng-repeat="groupItem in groups" ng-show="isTabActive($index)" ><div class="items-subgroup" ng-repeat="subgroupItem in groupItem"><div class="subgroup-title"><h2 ng-bind="subgroupItem.title"></h2></div>'
    + '<ul ng-if="multiselectIds"><li ng-class="{active: isItemSelected(item.id)}" ng-repeat="item in subgroupItem.items" ng-click="onItemSelect()(item)" ng-bind="::item.title"></li></ul>'
    + '<ul ng-if="!multiselectIds"><li ng-repeat="item in subgroupItem.items" ng-click="onItemSelect()(item)" ng-bind="::item.title"></li></ul>'
    + '</div></div></div>',
    link: link,
    scope: {
      tabs: '=',
      data: '=',
      onItemSelect: '&',
      multiselectIds: '='
    }
  };
});
