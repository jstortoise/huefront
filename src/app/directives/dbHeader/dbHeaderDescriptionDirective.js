angular.module('app').directive('hueDbHeaderDescription', ['$timeout', function (timeout) {
  function link(scope, element, attrs) {
    scope.textOverflow = false;

    var getDescriptionLineHeight = function () {
      var t = element.find('.description-text');
      var lh = t.css('line-height');

      if (lh.indexOf('.'))
        return lh.substring(0, lh.indexOf('.'));
      return lh.substring(0, lh.indexOf('p'));
    };
    var descriptionTextElem = element.find('.description-text');
    var isExpanded = false;

    var checkOverflow = function () {
      scope.textOverflow = descriptionTextElem.height() > 75; //if more than 4 lines
    };
    var windowResizeHandler = _.debounce(function () {
      timeout(checkOverflow, 10);
    }, 200);

    scope.isShowMoreVisible = function () {
      return scope.textOverflow && !isExpanded;
    };
    scope.isShowLessVisible = function () {
      return scope.textOverflow && isExpanded;
    };
    scope.showMoreClick = function () {
      isExpanded = true;
      scope.headerHeight = 100 + descriptionTextElem.height() - 55; //55 - three lines which are visible always
    };
    scope.showLessClick = function () {
      isExpanded = false;
      scope.headerHeight = null;
    };

    $(window).resize(windowResizeHandler);

    scope.$watch('text', function (newValue, oldValue) {
      if (newValue)
        timeout(checkOverflow, 10);
    });

    scope.$on('$destroy', function () {
      $(window).off('resize', windowResizeHandler);
    });
  }

  return {
    restrict: 'E',
    template: '<div class="description-container" ng-class="{\'three-lines\': textOverflow}"><div class="description-text" ng-bind="text"></div></div><div class="show-button" ng-show="isShowMoreVisible()" ng-click="showMoreClick()">Show More</div><div class="show-button" ng-show="isShowLessVisible()" ng-click="showLessClick()">Show Less</div>',
    link: link,
    scope: {
      text: '=',
      headerHeight: '='
    }
  };
}]);
