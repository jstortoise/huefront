angular.module('app').service('modalService', function ($rootScope, $uibModal) {
  this.showModal = function (number, img, item, flag) {
    var arr = [
      {
        tmpl: 'app/components/modal/modal.tmpl.html',
        class: 'modal-err'
      },
      {
        tmpl: 'app/components/modal/membersOnlyModal.tmpl.html',
        class: 'adv-modal'
      },
      {
        tmpl: 'app/components/modal/graphic-modal.tmpl.html',
        class: 'graphic-modal'
      },
      {
        tmpl: 'app/components/modal/dailyModal.tmpl.html',
        class: 'graphic-modal'
      },
      {
        tmpl: 'app/components/modal/cat-survey-modal.tmpl.html',
        class: 'cart-modal'
      },
      {
        tmpl: 'app/components/modal/color-search.tmpl.html',
        class: 'modal-err'
      }];

    $uibModal.open({
      templateUrl: arr[number].tmpl,
      // size: size,
      controller: function ($scope, $uibModalInstance) {
        $scope.ok = function () {
          $uibModal.close();
        };
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
        $scope.img = img;
        if (item) {
          $scope.item = item;
        }
        if (flag !== undefined) {
          $scope.flag = flag;
        }
      },
      windowTopClass: arr[number].class,
      resolve: {}
    }).result.then(function(){}, function(res){});
  }
});
