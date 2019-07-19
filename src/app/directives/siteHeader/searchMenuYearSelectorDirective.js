angular.module('app').directive('hueSearchMenuYearSelector', function () {
  function link(scope, element, attrs) {
    scope.keyPressHandler = function (event, numberIndex) {
      var inputs = $('input', element);
      var yearArr = [$(inputs[0]).val(), $(inputs[1]).val(), $(inputs[2]).val(), $(inputs[3]).val()];
      if (_.every(yearArr, function (item) {
          return item != null && item.length == 1;
        })) {
        var year = parseInt(yearArr.join(''));
        var yearItem = _.find(scope.years, function (item) {
          return item.id == year;
        });

        if (yearItem)
          scope.selectedYear = yearItem;
      }
    }

    var keyDownHandler = function (event) {
      var kc = event.keyCode;

      if (kc > 47 && kc < 58) {
        var e = $(event.target);
        e.val(String.fromCharCode(event.keyCode));
        e.next('input').focus();
      } else if (kc == 37) //left
        $(event.target).prev('input').focus();
      else if (kc == 39) //right
        $(event.target).next('input').focus();
      else if (kc == 13) //allow Enter
        return true;

      return false;
    };

    $('input', element).keydown(keyDownHandler);

    scope.$on('destroy', function () {
      $('input', element).off("keydown", keyDownHandler);
    });
  }

  return {
    restrict: 'E',
    template: '<span class="year-selector">Select year between 2000 - Present: <input type="text" ng-keypress="keyPressHandler()"/><input type="text" ng-keypress="keyPressHandler()"/><input type="text" ng-keypress="keyPressHandler()"/><input type="text" ng-keypress="keyPressHandler()"/><span>',
    link: link,
    scope: {
      years: '=',
      selectedYear: '='
    }
  };
});
