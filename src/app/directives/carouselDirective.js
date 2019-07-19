angular.module('app').directive('hueCarousel', function () {
  function link(scope, element, attrs) {
    scope.$watch('initialized', function (newValue, oldValue) {
      if (newValue) {
        if (scope.config) {
          if (scope.config.responsive && !scope.config.onCreate) {
            scope.config.onCreate = function () {
              angular.element(element).trigger('updateSizes');
              if (scope.onCreate) {
                scope.onCreate(this);
              }
            };
          }
          angular.element(element).carouFredSel(scope.config);

          if (scope.config.buttonNextId) {
            angular.element('#' + scope.config.buttonNextId).click(function () {
              angular.element(element).trigger('next');
            });
          }
          if (scope.config.buttonPrevId) {
            angular.element('#' + scope.config.buttonPrevId).click(function () {
              angular.element(element).trigger('prev');
            });
          }
        } else {
          angular.element(element).carouFredSel();
        }
      }
      angular.element(element).trigger('updateSizes');
    });
  }

  return {
    restrict: 'A',
    link: link,
    scope: {
      config: '=hueCarousel',
      initialized: '=',
      onCreate: '='
    }
  };
});
