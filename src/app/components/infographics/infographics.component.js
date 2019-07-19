angular
  .module('app')
  .component('infographicsComponent', {
    templateUrl: 'app/components/infographics/infographics.tmpl.html',
    controller: function ($http, appConfig, modalService, categoryValues, $location, anchorSmoothScroll,
                          localStorageService) {
      var vm = this;
      vm.hueModel = 'VERTICAL';
      vm.yearModel = 'YEAR';
      vm.year = [];
      vm.hue = categoryValues('hue');
      vm.pageData = {};
      vm.items = [];
      vm.flag = true;
      var numberOfElements = 3;
      var count = 1;
      var lastYear = moment().year();

      vm.init = function () {
        $http.get(appConfig.dashboardServiceUrl + 'infographics.json')
          .then(function (res) {
            if (res && res.data) {
              vm.pageData = res.data.data.map(function (item) {
                var b = res.data.picture.find(function (a) {
                  return a.infographic_id === item.id;
                });
                if (b) {
                  item.image_url = b.image_url;
                }
                return item;
              });
              vm.year.push(moment().format('YYYY'));
              vm.pageData.map(function (t) {
                t.date = moment(t.published_year + '-' + t.published_month + '-' + t.published_day).format(' MMMM D, YYYY');
              });
              vm.pageData.forEach(function (t) {
                if (Number(t.published_year) && Number(t.published_year) < lastYear) {
                  lastYear = Number(t.published_year);
                }
              });
              vm.year = _.range(lastYear, moment().year() + 1);
              vm.select();
              vm.year = vm.year.reverse();
            }
          });
      };

      vm.sortItems = function () {
        vm.filterData.forEach(function (elem, index) {
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

      vm.more = function () {
        vm.items = [];
        count++;
        vm.sortItems();
      };

      vm.onGraphicClick = function (event) {
        if (event) {
          modalService.showModal(2, event);
        }
      };

      vm.select = function () {
        if (vm.hue.includes(vm.hueModel) || vm.year.includes(Number(vm.yearModel))) {
          vm.filterData = angular.copy(vm.pageData.filter(function (t) {
            if ((!vm.hue.includes(vm.hueModel) || vm.hueModel === t.hue) &&
              (!vm.year.includes(Number(vm.yearModel)) || vm.yearModel === t.published_year)) {
              return t;
            }
          }));
        } else {
          vm.filterData = angular.copy(vm.pageData);
        }
        count = 1;
        vm.items = [];
        vm.sortItems();
      };

      vm.gotoElement = function (eID) {
        $location.hash('prefooter');
        anchorSmoothScroll.scrollTo(eID);
        $location.hash('');
      };

      vm.getUser = function () {
        return localStorageService.get('currentUser').id === undefined;
      };


      vm.makeDate = function (item) {
          return moment(item.published_year + '-' + item.published_month + '-' + item.published_day).format('MMMM D, YYYY');
      };
    }
  });
