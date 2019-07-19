angular.module('app').directive('hueDbInfoTooltip', ['searchMenuRepository', function (searchMenuRepository) {
  function link(scope, element, attrs) {
    var e = angular.element(element);

    searchMenuRepository.getMain(function (data) {
      e.ready(function () {
        e.attr('title', data.tooltips[attrs.hueDbInfoTooltip]);
        e.tooltipster({
          animation: 'fade',
          theme: 'tooltipster-module-info',
          trigger: 'hover',
          minWidth: 300,
          maxWidth: 300,
          position: 'bottom'
        });
      });
    });
  }

  return {
    restrict: 'A',
    link: link
  };
}]);
