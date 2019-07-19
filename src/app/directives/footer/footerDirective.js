angular.module('app').directive('hueFooter', function () {
  function link(scope, element, attrs) {
    scope.browserIsNotChrome = window.chrome == null || window.chrome == undefined || window.navigator.vendor != "Google Inc." || (window.navigator.userAgent.indexOf("OPR") > -1);
    scope.infoUrl = null;

    scope.showInfoWindow = function (type) {
      scope.infoUrl = 'app/directives/' + type + 'Partial.html';
    };
    scope.hideInfoWindow = function () {
      scope.infoUrl = null;
    };
    scope.isInfoWindowVisible = function () {
      return scope.infoUrl != null;
    };
  }

  return {
    restrict: 'A',
    template: '<ul><li><a ng-click="showInfoWindow(\'about\')">About</a></li><li><a href="mailto:investors@hue-data.com">Investors</a></li><li><a ng-click="showInfoWindow(\'terms\')">Terms Of Use</a></li><li><a ng-click="showInfoWindow(\'privacy\')">Privacy</a></li><li><a href="mailto:hello@hue-group.com">Contact</a></li><li class="not-chrome-message" ng-show="browserIsNotChrome"><a href="https://www.google.com/chrome/">For best results please use Google Chrome. If you do not have Google Chrome, you can download using this link.</a></li></ul><div class="info-window" ng-if="isInfoWindowVisible()"><div class="button-close" ng-click="hideInfoWindow()"></div><div class="window-content-container"><div class="window-content" ng-include="infoUrl"></div></div></div>',
    link: link,
    scope: {}
  };
});
