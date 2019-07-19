angular.module('app').directive('hueDbDistributionByCategory', function () {
  function link(scope, element, attrs) {
    scope.chartColor = 'assets/img/noise_texture.png';
    scope.chartStrokeColor = '#000';
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbDistributionByCategory/dbDistributionByCategoryView.html',
    link: link,
    scope: {
      data: '='
    }
  };
});
