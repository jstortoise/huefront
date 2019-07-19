angular.module('app').directive('hueDbCopyrightList', function ($location) {
  function link(scope, element, attrs) {
    scope.selectedItem = null;

    scope.colorClick = function (item) {
      // console.log('item🎅🎅🎅🎅🎅', '', item.color_code);
      // scope.setColor()(item.color_code);
    };

    scope.selectItem = function (item) {
      scope.selectedItem = item;
    };
    scope.hideExpandedView = function () {
      scope.selectedItem = null;
    };
    scope.isExpandedViewVisible = function () {
      return scope.selectedItem != null;
    };
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbCopyrightList/dbCopyrightListView.html',
    link: link,
    scope: {
      data: '=',
      pageTitle: '=',
      setColor: '&'
    }
  };
});
