angular.module('app').service('analyticsService', ['$location', '$analytics', 'authService', function (location, analytics, authService) {
  this.logPage = function () {
    var url = location.url();
    if (authService.currentUser.company != 'Huegroup' && url != '/')
      analytics.pageTrack(url);
  };

  this.logExpandedView = function (type) {
    if (authService.currentUser.company != 'Huegroup')
      analytics.eventTrack('open', {category: 'DB_EV', label: type});
  };
}]);
