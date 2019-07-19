angular
  .module('app')
  .component('teachingMaterialsComponent', {
    templateUrl: 'app/components/teaching-materials/teaching-materials.tmpl.html',
    controller: function ($http, appConfig) {
      var vm = this;
      vm.topicModel = 'TOPIC';
      vm.providerModel = 'PROVIDER';
      vm.typeModel = 'TYPE';
      vm.pageData = [];
      vm.categories = [];
      vm.cacheItems = [];
      vm.topic = [];
      vm.provider = [];
      vm.type = [];
      vm.items = [];
      vm.flag = true;
      var numberOfElements = 3;
      var count = 1;

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'teaching_materials.json')
          .then(function (res) {
            if (res && res.data && res.data.data) {
              vm.pageData = res.data.data.map(function (item) {
                item.data.date = moment(item.data.published_year + '-' + item.data.published_month + '-' + item.data.published_day, 'YYYY-MM-DD').format('MMMM D, YYYY');
                item.data.image_url = item.images && item.images[0] && item.images[0].image_url;
                vm.cacheItems.push(angular.copy(item.data));
                return item.data;
              });
              vm.pageData.forEach(function (t) {
                if (t.teaching_material_provider && !vm.provider.includes(t.teaching_material_provider)) {
                  vm.provider.push(t.teaching_material_provider);
                }
              });
              vm.topic = ['Color Foundation', 'Color Strategy', 'Color Naming'];
              vm.type = ['Beginner', 'Intermediate', 'Advanced'];
              vm.select();
            }
          });
      };

      vm.sortItems = function () {
        vm.filterDate.forEach(function (elem, index) {
          if (index > numberOfElements * count - 1) {
            elem.style = 'display: none';
            vm.flag = false;
          }else{
            elem.style = '';
            vm.flag = true;
          }
          vm.items.push(elem);
        });
      };

      vm.showMore = function () {
        vm.items = [];
        count++;
        vm.sortItems();
      };

      vm.select = function () {
        if (vm.topic.includes(vm.topicModel) || vm.provider.includes(vm.providerModel) || vm.type.includes(vm.typeModel)) {
          vm.filterDate = angular.copy(vm.cacheItems).filter(function (t) {
            if ((!vm.topic.includes(vm.topicModel) || vm.topicModel === t.teaching_material_topic) &&
              (!vm.provider.includes(vm.providerModel) || vm.providerModel === t.teaching_material_provider) &&
              (!vm.type.includes(vm.typeModel) || vm.typeModel === t.teaching_material_type)) {
              return t;
            }
          });
        } else {
          vm.filterDate = angular.copy(vm.cacheItems);
        }
        vm.items = [];
        count = 1;
        vm.sortItems();
      };
    }
  });
