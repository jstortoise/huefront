angular.module('app').directive('hueDbTopFinishes', ['$location', function (location) {
  function link(scope, element, attrs) {
    //scope.industryClick = function (id) {
    //	location.url('finish').search({ finish: id });
    //}
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbTopFinishes/dbTopFinishesView.html',
    link: link,
    scope: {
      data: '=',
      chartColor: '='
    }
  };
}]);
