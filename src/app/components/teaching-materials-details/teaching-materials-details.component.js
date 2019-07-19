angular
.module('app')
.component('teachingMaterialsDetailsComponent', {
  templateUrl: 'app/components/teaching-materials-details/teaching-materials-details.tmpl.html',
  controller: function ($http, appConfig, $stateParams, $location, anchorSmoothScroll, localStorageService, $state) {
    var vm = this;

    vm.init = function () {
      $http.get(appConfig.dashboardServiceUrl + 'teaching_materials/' + $stateParams.id + '.json')
      .then(function (res) {
        vm.pageData = res.data.data.data;
        vm.pageData.date = moment(vm.pageData.published_year+'-'+vm.pageData.published_month+'-'+vm.pageData.published_day).format('dddd, MMMM D, YYYY');
        vm.pageData.image_url =  res.data.data.images && res.data.data.images[0] && res.data.data.images[0].image_url;
        vm.pageData.excerpts = res.data.data.excerpts;
        vm.pageData.analitic =  _.chunk(angular.copy(res.data.data.analytics).slice(0, 3), 3);
        vm.pageData.analitics = angular.copy(res.data.data.analytics);
      });
    };
    vm.more = function () {
      vm.pageData.analitic = _.chunk(angular.copy(vm.pageData.analitics), 3);
    };

    vm.gotoElement = function (eID) {
      $location.hash('prefooter');
      anchorSmoothScroll.scrollTo(eID);
      $location.hash('');
    };
    vm.getUser = function () {
      return localStorageService.get('currentUser')? true : false
    };

    vm.downloadExcerpt = function () {
      $state.go('download-excerpt', {type: 'teachingMaterials', id: vm.pageData.id});
      localStorageService.set('link', vm.pageData.excerpts[0].url);
    };

    vm.aggProduct = function () {
      // localStorageService.remove('products');
      var id = vm.pageData.id;
      var products = localStorageService.get('products');
      if (!products) {
        products = {};
      }
      if (!products.teaching_materials) {
        products.teaching_materials = {};
      }
      products.teaching_materials[id] = 1;
      localStorageService.set('products', products);
      $state.go('cart-page', {wayBack: 'teachingMaterials'});
    };
    vm.getUser = function () {
      return localStorageService.get('currentUser').id === undefined;
    };
  }
});
