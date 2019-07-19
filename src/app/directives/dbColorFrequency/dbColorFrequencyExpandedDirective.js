angular.module('app').directive('hueDbColorFrequencyExpanded', function () {
  function link(scope, element, attrs) {
    scope.data = [];
    scope.barWidths = [];
    scope.colorPickerData = [];
    scope.activeColor = 0;
    scope.showColorPicker = false;
    scope.tooltipsterConfig = {
      animation: 'fade',
      theme: 'tooltipster-default',
      trigger: 'hover',
      position: 'bottom'
    };

    var updateData = function (newData) {
      var data = newData.mostPopular.concat(newData.moderate).concat(newData.infrequent).concat(newData.not_used);
      scope.data = _.filter(data, function (item) {
        return item.percentage_abs > 0;
      });
      scope.barWidths = [];

      var count = scope.data.length - 1;
      var sum = 0;
      for (var i = 0; i < count; i++) {
        sum += scope.data[i].percentage_abs;
        scope.barWidths.push(scope.data[i].percentage_abs + '%');
      }
      sum += scope.data[count].percentage_abs;
      if (sum > 100)
        scope.barWidths.push((scope.data[count].percentage_abs - (sum - 100)) + '%'); //trim last element if sum is more than 100
      else
        scope.barWidths.push(scope.data[count].percentage_abs + '%');
    };

    scope.$watch('originalData', function (newValue, oldValue) {
      if (newValue) {
        if (newValue instanceof Array) {
          scope.showColorPicker = newValue.length > 1;
          scope.colorPickerData = newValue;
          updateData(newValue[scope.activeColor]);
        }
        else {
          scope.showColorPicker = false;
          scope.colorPickerData = [];
          updateData(newValue);
        }
      } else
        scope.data = [];
    });

    scope.$watch('activeColor', function (newValue, oldValue) {
      if (scope.originalData instanceof Array && newValue != null)
        updateData(scope.originalData[newValue]);
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorFrequency/dbColorFrequencyExpandedView.html',
    link: link,
    scope: {
      originalData: '=data',
      toggleView: '&'
    }
  };
});
