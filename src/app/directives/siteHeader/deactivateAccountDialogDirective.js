angular.module('app').directive('hueDeactivateAccountDialog', ['userDataRepository', function (userDataRepository) {
  function link(scope, element, attrs) {
    scope.reasons = ['Was not relevant to me', 'Love but will not use', 'The subscription fee was too high'];
    scope.step = 0;
    scope.isStep = function (step) {
      return step == scope.step;
    };
    scope.setStep = function (step) {
      scope.step = step;
    };

    scope.customReason = null;

    scope.selectedReason = function (reasonId) {
      userDataRepository.deactivateAccount(reasonId);
      scope.setStep(2);
    };
    scope.selectedCustomReason = function () {
      if (!scope.customReason) {
        alert('Please tell us why you are closing your account');
        return;
      }

      userDataRepository.deactivateAccount(scope.customReason);
      scope.setStep(2);
    };
  }

  return {
    restrict: 'E',
    template: '<div class="deactivate-account-dialog"><div class="close-account" ng-click="setStep(1)" ng-show="isStep(0)">Close my account</div><div ng-show="isStep(1)"><p>Please tell us why you are closing your account</p><ul><li class="reason-option" ng-repeat="item in reasons" ng-bind="item" ng-click="selectedReason($index)"></li><li>Other <input type="text" ng-model="customReason"/> <button ng-click="selectedCustomReason()">Ok</button></li></ul></div><div ng-show="isStep(2)">Thank you</div></div>',
    link: link,
    scope: {}
  };
}]);
