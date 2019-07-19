angular.module('app').directive('hueDbTopIndustries', ['$location', function (location) {
  function link(scope, element, attrs) {
    scope.industryClick = function (id) {
      location.url('industry').search({industry: id});
    };
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbTopIndustries/dbTopIndustriesView.html',
    link: link,
    scope: {
      data: '=',
      chartColor: '='
    }
  };
}]);
