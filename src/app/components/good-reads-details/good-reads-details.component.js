angular
.module('app')
.component('goodReadsDetailsComponent', {
  templateUrl: 'app/components/good-reads-details/good-reads-details.tmpl.html',
  controller: function ($http, appConfig, $stateParams, localStorageService) {
    var vm = this;

    vm.init = function () {
      $http.get(appConfig.dashboardServiceUrl + 'good_reads/' + $stateParams.id + '.json')
      .then(function (res) {
        vm.pageData = res.data.data.data;
        vm.pageData.date = moment(vm.pageData.published_year+'-'+vm.pageData.published_month+'-'+vm.pageData.published_day).format('dddd, MMMM D, YYYY');
        vm.pageData.image_url =  res.data.data.images && res.data.data.images[0] && res.data.data.images[0].image_url;
      });
    };
    vm.getUser = function () {
          return localStorageService.get('currentUser').id === undefined;
    };
  }
});
