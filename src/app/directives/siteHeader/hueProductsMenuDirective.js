angular.module('app').directive('hueProductsMenu', function (authService, mainMenuRepository) {
  function link(scope, element, attrs) {
    scope.data = [];
    scope.logoClick = function (item) {
      window.location = authService.token ? (item.url + '#/?token=' + authService.token) : item.url;
    };

    // mainMenuRepository.getHueProducts(function (data) {
    //   scope.data = data;
    // });
  }

  return {
    restrict: 'E',
    template: '<div class="hue-products-menu"><div class="menu-title">Select the HUE you would like to search</div><div ng-repeat="itemGroup in data"><ul class="menu-products"><li ng-repeat="item in itemGroup"><img ng-src="{{item.icon}}" ng-click="logoClick(item)" /></li></ul><div class="product-spacer" ng-if="!$last">The following HUEs are in development, click on an individual HUEs to learn more.</div></div></div>',
    link: link,
    scope: {}
  };
});
