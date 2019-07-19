angular.module('app').directive('hueDbLogos', ['$location', function (location) {
  function link(scope, element, attrs) {
    scope.page = 1;
    scope.maxElementsPerGroup = 0;
    scope.data = [];
    scope.dataExpanded = [];
    scope.groupNames = [];
    scope.showLogoDetails = false;
    scope.logoDetailsId = null;

    var calculateMaxElementsPerGroup = function () {
      return Math.floor(element.children().first().width() / 170) * 2;
    };
    var updateData = function () {
      scope.data = _.map(scope.originalData, function (item, index) {
        if (!scope.dataExpanded[index])
          return item[1].slice(0, scope.maxElementsPerGroup);
        else
          return item[1];
      });
    };

    scope.showGroupNames = function () {
      return scope.colorDashboard != true;
    };

    scope.isShowMoreVisible = function (groupIndex) {
      return !scope.dataExpanded[groupIndex] && scope.originalData[groupIndex][1].length > scope.maxElementsPerGroup;
    };
    scope.isShowLessVisible = function (groupIndex) {
      return scope.dataExpanded[groupIndex];
    };

    scope.showMoreClick = function (groupIndex) {
      scope.dataExpanded[groupIndex] = true;
      updateData();
    };

    scope.showLessClick = function (groupIndex) {
      scope.dataExpanded[groupIndex] = false;
      updateData();
    };

    scope.toggleLogoDetails = function () {
      scope.showLogoDetails = scope.showLogoDetails ? false : true;
    };

    scope.logoClick = function (parentIndex, index) {
      scope.logoDetailsId = scope.data[parentIndex][index].id;
      scope.toggleLogoDetails();
    };

    scope.$watch('originalData', function (newValue, oldValue) {
      if (newValue && (scope.colorDashboard != true || (scope.colorDashboard && newValue.length))) { // IF not color dashboard OR is color dashboard and not empty array
        scope.groupNames = _.map(scope.originalData, function (item, key) {
          return item[0];
        });

        scope.maxElementsPerGroup = calculateMaxElementsPerGroup();
        updateData();
        scope.dataExpanded = [];
      } else {
        scope.data = [];
        scope.dataExpanded = [];
      }
    });

    var lazyDigest = _.debounce(function () {
      scope.$digest();
    }, 300);
    $(window).resize(function () {
      var maxElems = calculateMaxElementsPerGroup();
      if (scope.maxElementsPerGroup != maxElems) {
        scope.maxElementsPerGroup = maxElems;
        updateData();
        lazyDigest();
      }
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbLogos/dbLogosView.html',
    link: link,
    scope: {
      originalData: '=data',
      colorDashboard: '='
    }
  };
}]);
