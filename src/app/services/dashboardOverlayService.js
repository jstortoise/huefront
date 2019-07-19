angular.module('app').service('dashboardOverlayService',
  ['$timeout', function (timeout) {
    var self = this;

    this.loadingTimeout;
    this.showOverlay = false;
    this.showErrorMessage = false;

    this.loadingStart = function (time) {
      self.showOverlay = true;
      time = time || 8000;

      timeout(function () {
        self.showOverlay = false;
      }, time);
    };
    this.loadingCompleted = function () {
      timeout.cancel(self.loadingTimeout);
      self.showOverlay = false;
    };
    this.onLoadingTimeout = function () {
      self.showErrorMessage = false;
    };
  }]);
