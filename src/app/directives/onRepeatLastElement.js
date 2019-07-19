angular.module('app').directive('onRepeatLastElement', function () {
  function link(scope, element, attrs) {
    if (scope.$last)
      scope.$parent[attrs.onRepeatLastElement]();
  }

  return {
    restrict: 'A',
    link: link
    // scope: {
    // 	onRepeatLastElement: '&'
    // }
  };
});
