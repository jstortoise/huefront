angular.module('app').directive('hueReadMore', function () {
  function link(scope, element, attrs) {
    scope.$watch('text', function (newValue, oldValue) {
      var elem = $('span:first-child', element);
      elem.readmore('destroy');
      elem.text($.trim(newValue));
      elem.readmore({
        speed: 200,
        moreLink: '<a href="#">More</a>',
        lessLink: '<a href="#">Less</a>',
        collapsedHeight: parseInt(scope.collapsedHeight),
        heightMargin: 0
      });
    });
  }

  return {
    restrict: 'A',
    transclude: true,
    template: '<span></span>',
    link: link,
    scope: {
      text: '=hueReadMore',
      collapsedHeight: '@'
    }
  };
});
