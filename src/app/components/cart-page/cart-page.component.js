angular
  .module('app')
  .component('cartPageComponent', {
    templateUrl: 'app/components/cart-page/cart-page.tmpl.html',
    controller: function ($state, $http, appConfig, $location, anchorSmoothScroll, localStorageService, $stateParams, modalService, $window) {
      var vm = this;

      vm.init = function () {
        vm.wayBack = $stateParams.wayBack || 'profile';
        vm.wayBackName = ' to ';

        switch ($stateParams.wayBack) {
          case 'reports':
            vm.wayBackName += 'Color Reports';
            break;
          case 'courses':
            vm.wayBackName += 'Color Courses';
            break;
          case 'teachingMaterials':
            vm.wayBackName += 'Color Teaching Materials';
            break;
          case 'profile':
            vm.wayBackName += 'Profile';
            break;
          default:
            vm.wayBackName = '';
        }

        vm.products = [];
        vm.all = 0;
        vm.tax = 0;
        vm.IDs = localStorageService.get('products');

        vm.getProductItems(vm.IDs.reports, 'reports');
        vm.getProductItems(vm.IDs.courses, 'courses');
        vm.getProductItems(vm.IDs.teaching_materials, 'teaching_materials');
      };

      vm.getProductItems = function (obj, name) {
        for (var key in obj) {
          $http.get(appConfig.dashboardServiceUrl + name + '/' + key + '.json')
            .then(function (res) {
              vm.pageData = res.data.data.data;
              vm.pageData.image_url = res.data.data.images && res.data.data.images[0] && res.data.data.images[0].image_url;
              vm.pageData.analitic = _.chunk(angular.copy(res.data.data.analytics).slice(0, 3), 3);
              vm.pageData.file = res.data.data.files && res.data.data.files[0];
              vm.pageData.analitics = angular.copy(res.data.data.analytics);
              vm.pageData.count = obj[key];
              vm.pageData.type = name;
              vm.all = vm.all + (vm.pageData.price * vm.pageData.count);
              vm.products.push(vm.pageData);
            });
        }
      };

      vm.goCheckout = function () {
        var purchase = {IDs: {}};
        purchase.amount = vm.all;
        for (var type in vm.IDs) {
          purchase.IDs[type] = {};
          for (var id in vm.IDs[type]) {
            if (vm.IDs[type][id] < 1) {
              return;
            } else {
              purchase.IDs[type][id] = vm.IDs[type][id];
            }
          }
        }

        localStorageService.set('purchase', purchase);
        $state.go('cart-checkout');
      };

      vm.removeProduct = function (id, type, index) {
        modalService.showModal(4, function () {
          delete vm.IDs[type][id];
          vm.products.splice(index, 1);
          localStorageService.set('products', vm.IDs);
        });
      };

      vm.goWayBack = function () {
        if ($window.history.length < 3) {
          $state.go('about');
        } else if (vm.wayBackName === '') {
          $window.history.back();
        } else {
          $state.go(vm.wayBack);
        }
      };

      vm.editCount = function (id, index, type, value) {
        if (vm.products[index].count + value > 0) {
          vm.products[index].count = vm.products[index].count + value;
          vm.IDs[type][id] = vm.IDs[type][id] + value;
          localStorageService.set('products', vm.IDs);
          vm.all = vm.all + vm.products[index].price * value;
        } else {
          vm.removeProduct(id, type, index);
        }
      };
    }
  });
