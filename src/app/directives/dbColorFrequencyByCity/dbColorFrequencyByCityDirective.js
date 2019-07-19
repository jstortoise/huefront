angular.module('app').directive('hueDbColorFrequencyByCity', [
  '$location', '$timeout', function (location, $timeout) {
    function link(scope, element, attrs) {
      scope.cityNames = [];

      scope.dataRendered = false;
      scope.dataRenderedPie = false;
      scope.onDataRendered = function () {
        scope.dataRendered = true;
        scope.dataRenderedPie = true;
      };

      scope.getButtonId = function (btnName) {
        return 'db-cfbc-' + scope.$id + '-btn-' + btnName;
      };

      scope.goToCity = function (index) {
        location.url('city').search({
          city: scope.data[index].cityId,
          year: 2017,
          season: 42,
          category: 1
        });
      };

      scope.$watchCollection('data', function (newValue) {
        // scope.dataRenderedPie = false;
        if (newValue) {
          var newCityNames = [];
          _.each(newValue, function (item, index) {
            if (item.cityId == 12) { // rio 12
              newCityNames[index] = 'Rio';
            } else {
              newCityNames[index] = item.city;
            }
          });
          scope.cityNames = newCityNames;
        }
      });
    }

    return {
      restrict: 'E',
      templateUrl: 'app/directives/dbColorFrequencyByCity/dbColorFrequencyByCityView.html',
      link: link,
      scope: {
        data: '='
      }
    };
  }]);
