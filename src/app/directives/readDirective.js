angular.module('app').filter('truncate', function () {
  return function (text, length, end) {
    if (isNaN(length)) {
      length = 10;
    }

    if (end === undefined) {
      end = '...';
    }

    if (text.length <= length || text.length - end.length <= length) {
      return text;
    } else {
      return String(text).substring(0, length - end.length) + end;
    }
  };
}).directive('readMore', function ($filter) {
  return {
    restrict: 'A',
    scope: {
      text: '=readMore',
      labelExpand: '@readMoreLabelExpand',
      labelCollapse: '@readMoreLabelCollapse',
      limit: '@readMoreLimit'
    },
    transclude: true,
    template: '<span ng-transclude ng-bind-html="text"></span><a href="javascript:;" ng-click="toggleReadMore()" ng-bind="label"></a>',
    link: function (scope /*, element, attrs */) {

      var originalText = scope.text;

      scope.label = scope.labelExpand;

      scope.$watch('expanded', function (expandedNew) {
        if (expandedNew) {
          scope.text = originalText;
          scope.label = scope.labelCollapse;
        } else {
          scope.text = $filter('truncate')(originalText, scope.limit, '...');
          scope.label = scope.labelExpand;
        }
      });

      scope.toggleReadMore = function () {
        scope.expanded = !scope.expanded;
      };
    }
  };
});