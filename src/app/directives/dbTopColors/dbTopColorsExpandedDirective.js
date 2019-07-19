angular.module('app').directive('hueDbTopColorsExpanded', function () {
  function link(scope, element, attrs) {

  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbTopColors/dbTopColorsExpandedView.html',
    link: link,
    scope: {
      data: '=',
      toggleView: '&'
    }
  };
});
