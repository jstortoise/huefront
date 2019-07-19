angular.module('app').directive('hueSiteHeader',
  ['$location', '$interval', 'authService', 'trialService',
    function (location, interval, authService, trialService) {
      function link(scope, element, attrs) {
        // scope.activeControl = route.current.controller == 'homeController' ? 'search' : null;
        scope.activeControl = 'search';
        scope.showTrialTime = false;
        scope.daysLeft = null;
        scope.expirationTimer = null;

        var expirationTimerFunction = function () {
          if (trialService.isSiteLocked()) {
            scope.daysLeft = 0;
            interval.cancel(scope.expirationTimer);
            return;
          }

          var t = trialService.isTrialExpired() ? trialService.getTimeToLock() : trialService.getRemainingTime();
          scope.daysLeft = Math.ceil(t / 86400000);
        };

        scope.toggleControl = function (cname) {
          scope.activeControl = scope.activeControl == cname ? null : cname;
        };
        scope.isControlActive = function (cname) {
          return scope.activeControl == cname;
        };
        scope.turnOffControl = function () {
          scope.activeControl = null;
        };

        scope.currentUser = null;
        scope.isUserLoggedIn = function () {
          if (scope.currentUser)
            return true;
          return false;
        };

        scope.logOff = function () {
          authService.logOff(function (success) {
            if (success)
              location.url('login');
          });
        };

        scope.$watch(function () {
          return authService.currentUser;
        }, function (newValue, oldValue) {
          scope.currentUser = newValue;

          if (newValue) {
            if (scope.expirationTimer)
              interval.cancel(scope.expirationTimer);

            if (newValue.is_member)
              scope.showTrialTime = false;
            else {
              expirationTimerFunction();
              scope.expirationTimer = interval(expirationTimerFunction, 5000);
              scope.showTrialTime = true;
            }
          }
        }, true);

        scope.$on('searchMenuOpenTab', function (event, tabName) {
          scope.activeControl = 'search';
        });
      }

      return {
        restrict: 'E',
        templateUrl: 'app/directives/siteHeader/siteHeaderView.html',
        link: link
      };
    }]);
