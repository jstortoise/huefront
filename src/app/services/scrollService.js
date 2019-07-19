angular.module('app')
  .factory('scrollService', function ($stateParams) {
    var scroll = {
      scrollMember: function () {
        if ($stateParams.scrollTo) {
          angular.element('html, body').animate({
            scrollTop: (angular.element("#becomeMember").offset().top) - 100
          }, 1000);
        }
      }
    };
    return scroll;
  });
