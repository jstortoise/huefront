angular
  .module('app')
  .component('cartThankComponent', {
    templateUrl: 'app/components/cart-thank/cart-thank.tmpl.html',
    controller: function ($state, $http, appConfig, localStorageService, $stateParams) {
      var vm = this;

      vm.orderId = localStorageService.get('orderId');
      localStorageService.remove('orderId');
      localStorageService.remove('purchase');
      localStorageService.set('products', {courses: {}, reports: {}, teaching_materials: {}});
      vm.products = localStorageService.get('purchaseItems');
    }
  });
