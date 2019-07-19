angular.module('app').directive('hueDbCopyrightListExpanded', function ($location) {
  function link(scope, element, attrs) {
    scope.details = scope.itemData;
    scope.otherColorCopyrights = [];
    scope.otherColorsPages = [];
    scope.activePage = 0;

    var updateData = function () {
      var currentColorId = scope.itemData.color.id;
      var otherColors = _.sortBy(_.filter(scope.data, function (d) {
        return d.color.id == currentColorId;
      }), function (d) {
        return new Date(d.filedAt);
      });

      var pagesCount = otherColors.length > 10 ? 10 : otherColors.length;
      scope.otherColorsPages = [];
      for (var i = 0; i < pagesCount; i++)
        scope.otherColorsPages.push(otherColors[i]);

      var data = scope.data;
      var dataCount = scope.data.length;
      scope.otherColorCopyrights = [];
      for (var i = 0; i < dataCount; i++) {
        var colorId = data[i].color.id;
        if (colorId != currentColorId && !_.find(scope.otherColorCopyrights, function (c) {
            return c.id == colorId
          }))
          scope.otherColorCopyrights.push(data[i].color);
      }
    }

    updateData();

    scope.colorClick = function (id) {
      $location.url('color').search({color: id});
    };

    scope.selectOtherColor = function (color) {
      scope.colorClick(color.id);
    };

    scope.selectPage = function (index) {
      scope.details = scope.otherColorsPages[index];
      scope.activePage = index;
    };

    scope.isPageActive = function (index) {
      return scope.activePage == index;
    };
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbCopyrightList/dbCopyrightListExpandedView.html',
    link: link,
    scope: {
      itemData: '=',
      data: '=',
      hideView: '&',
      pageTitle: '='
    }
  };
});
