angular.module('app').directive('hueDbCategoriesWithHighestActivity', function ($timeout) {
  function link(scope, element, attrs) {
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbCategoriesWithHighestActivity/dbCategoriesWithHighestActivityView.html',
    link: link,
    scope: {
      data: '='
    }
  };
});
