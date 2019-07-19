angular.module('app').directive('hueSvg', function () {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      source: '@',
      class: '@',
      onLoad: '&'
    },
    link: function (scope, element, attrs) {
      angular.element.get(attrs.source, function (data) {
        var svg = $('svg', data).removeAttr('xmlns xmlns:i xmlns:a xmlns:x xmlns:xlink xmlns:graph xml:space');

        if (attrs.id)
          svg.attr('id', attrs.id);
        else
          svg.removeAttr('id');

        if (attrs.class)
          svg.attr('class', attrs.class);

        element.replaceWith(svg.prop('outerHTML'));

        if (scope.onLoad)
          scope.onLoad();
      }, 'xml');
    }
  };
});
