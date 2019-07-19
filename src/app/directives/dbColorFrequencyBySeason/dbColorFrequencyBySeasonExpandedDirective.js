angular.module('app').directive('hueDbColorFrequencyBySeasonExpanded', function () {
  function link(scope, element, attrs) {
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorFrequencyBySeason/dbColorFrequencyBySeasonExpandedView.html',
    link: link,
    scope: {
      data: '=',
      toggleView: '&'
    }
  };
});
