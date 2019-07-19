angular.module('app').directive('hueDbColorFrequencyByCategory', function () {
  function link(scope, element, attrs) {
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorFrequencyByCategory/dbColorFrequencyByCategoryView.html',
    link: link,
    scope: {
      data: '='
    }
  };
});
