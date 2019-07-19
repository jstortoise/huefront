angular.module('app').directive('hueTrialExpiredMessage', function () {
  function link(scope, element, attrs) {
    scope.tryMoreClick = function () {
      scope.hideMessage();
    };

    scope.signUpClick = function () {
      window.location = "http://www.hue-data.com";
    };
  }

  return {
    restrict: 'E',
    template: '<div class="trial-expired-message"><div class="message-box"><p>Trial time has expired</p><div class="button-container"><button ng-click="tryMoreClick()" ng-if="!siteLocked">Try for one more hour</button><button ng-click="signUpClick()">Sign Up</button></div></div></div>',
    link: link,
    scope: {
      hideMessage: '&',
      siteLocked: '='
    }
  };
});
