angular.module('app').directive('hueDbColorFrequencyBySeason', ['$location', function (location) {
  function link(scope, element, attrs) {
    scope.dataRendered = false;
    scope.dataRenderedPie = false;
    scope.onDataRendered = function () {
      scope.dataRendered = true;
      scope.dataRenderedPie = true;
    };

    scope.getButtonId = function (btnName) {
      return 'db-cfbs-' + scope.$id + '-btn-' + btnName;
    };

    scope.goToSeason = function (index) {
      // location.url('season').search({
      //   season: scope.data[index].season_id,
      //   year: routeParams.year,
      //   category: routeParams.category
      // });
    };
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorFrequencyBySeason/dbColorFrequencyBySeasonView.html',
    link: link,
    scope: {
      data: '='
    }
  };
}]);
