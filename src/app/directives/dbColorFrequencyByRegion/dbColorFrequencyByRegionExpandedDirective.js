angular.module('app').directive('hueDbColorFrequencyByRegionExpanded', function () {
  function link(scope, element, attrs) {
    scope.activeTab = 0;
    scope.setTab = function (index) {
      scope.activeTab = index;
    };
    scope.isTabActive = function (index) {
      return scope.activeTab == index;
    };

    scope.$watch('data', function (newValue, oldValue) {
      if (newValue)
        scope.activeTab = _.findIndex(newValue, function (item) {
          return item.colors.length > 0;
        });
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorFrequencyByRegion/dbColorFrequencyByRegionExpandedView.html',
    link: link,
    scope: {
      data: '=',
      toggleView: '&'
    }
  };
});
