angular.module('app').directive('hueDbColorCopyrightsByColorFamily', function ($location) {
  function link(scope, element, attrs) {
    scope.Math = Math;
    scope.itemClick = function (item) {
      $location.url('color').search({id: item.id});
    };
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbColorCopyrightsByColorFamily/dbColorCopyrightsByColorFamilyView.html',
    link: link,
    scope: {
      data: '='
    }
  };
});
