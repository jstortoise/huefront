angular.module('app').directive('hueDbTopItemsDonuts', function () {
  function link(scope, element, attrs) {
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbTopItemsDonuts/dbTopItemsDonutsView.html',
    link: link,
    scope: {
      data: '=',
      donutColor: '=',
      itemClick: '&'
    }
  };
});
