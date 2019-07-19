angular.module('app').directive('hueSearchMenuTrending', function () {
  function link(scope, element, attrs) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var date = new Date();
    scope.date = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/siteHeader/searchMenuTrendingView.html',
    link: link,
    scope: {}
  };
});
