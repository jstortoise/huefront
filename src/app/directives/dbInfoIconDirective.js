angular.module('app').directive('hueDbInfoIcon', ['searchMenuRepository', '$state', function (searchMenuRepository, $state) {
  function link(scope, element, attrs) {
    var icon = angular.element('img', element);
    var repositoryAction = 'getMain';
    if ($state.current) {
      if ($state.current.parent === 'branding') {
        repositoryAction = 'getControlsDataBranding';
      } else if ($state.current.parent === 'auto') {
        repositoryAction = 'getControlsDataAuto';
      } else if ($state.current.parent === 'legal') {
        repositoryAction = 'getControlsDataLegal';
      } else if ($state.current.parent === 'fashion') {
        repositoryAction = 'getControlsData';
      }
    }

    searchMenuRepository[repositoryAction]().then(function (data) {
      if (!data.tooltips) {
        return;
      }

      icon.attr('title', data.tooltips[scope.textKey]);
      icon.tooltipster({
        animation: 'fade',
        theme: 'tooltipster-module-info',
        trigger: 'hover',
        minWidth: 300,
        maxWidth: 300,
        position: 'bottom'
      });
    });
  }

  return {
    restrict: 'E',
    template: '<img src="assets/img/icons/info.svg" class="icon-info" />',
    link: link,
    scope: {
      textKey: '@'
    }
  };
}]);
