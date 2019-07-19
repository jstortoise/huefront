angular.module('app').directive('hueDashboardOverlay', ['dashboardOverlayService', function (dashboardOverlayService) {
  function link(scope, element, attrs) {
    scope.showErrorMessage = false;

    scope.$watch(function () {
      return dashboardOverlayService.showErrorMessage;
    }, function (newValue, oldValue) {
      scope.showErrorMessage = newValue;
    });
  }

  return {
    restrict: 'A',
    link: link,
    template: '<div class="overlay-message message-loading" ng-show="!showErrorMessage"></div><div class="overlay-message message-error" ng-show="showErrorMessage"></div>',
    scope: true
  };
}]);
