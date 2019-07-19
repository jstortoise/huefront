angular.module('app').directive('hueDbColorCount', ['$location', function (location) {
  function link(scope, element, attrs) {
  }

  return {
    restrict: 'E',
    template: '<div class="db-color-count"><div class="color-count-row"><div class="color-count">1</div><div class="color-percentage">{{data[0]}} <span class="unit">%</span></div></div>' +
    '<div class="color-count-row"><div class="color-count">2</div><div class="color-percentage">{{data[1]}} <span class="unit">%</span></div></div>' +
    '<div class="color-count-row"><div class="color-count">3+</div><div class="color-percentage">{{data[2]}} <span class="unit">%</span></div></div></div>',
    link: link,
    scope: {
      data: '='
    }
  };
}]);
