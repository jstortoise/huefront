angular.module('app').directive('hueDbCopyrightListPagination', function ($timeout) {
  function link(scope, element, attrs) {
    scope.currentPageDisplayed = scope.currentPage;
    window.sc = scope;

    var setPageDebounced = _.debounce(function () {
      $timeout(function () {
        scope.currentPage = scope.currentPageDisplayed;
      });
    }, 1000);

    scope.switchPage = function (delta) {
      var newPage = scope.currentPageDisplayed + delta;
      if (newPage > 0 && newPage <= scope.totalPages) {
        scope.currentPageDisplayed = newPage;
        setPageDebounced();
      }
    };

    scope.$watch('currentPage', function (newValue, oldValue) {
      scope.currentPageDisplayed = newValue;
    });

    scope.setPage = function (delta) {
      var newPage = scope.currentPageDisplayed + delta;
      if (newPage > 0 && newPage <= scope.totalPages) {
        scope.currentPageDisplayed = newPage;
        setPageDebounced();
        scope.changePage()(newPage);
      }
    };
  }

  return {
    restrict: 'E',
    template: '<div class="db-copyright-list-pagination">' +
    '<div class="pagination-button disable-text-selection" ng-click="setPage(-1)">' +
    '<i class="fa fa-caret-left"></i></div>' +
    '<div class="pagination-current">' +
    '<input type="number" min="1" max="{{totalPages}}" ng-model="currentPageDisplayed" ng-change="setPage(0)"/> / <span ng-bind="totalPages"></span></div>' +
    '<div class="pagination-button disable-text-selection" ng-click="setPage(1)">' +
    '<i class="fa fa-caret-right"></i>' +
    '</div></div>',
    link: link,
    scope: {
      currentPage: '=',
      totalPages: '=',
      changePage: '&'
    }
  };
});
