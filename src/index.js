var app = angular.module('app', [
  'ngResource',
  'ngCookies',
  'ngSanitize',
  'countTo',
  'angular-extend-promises',
  'ui.router',
  'ui.select',
  'ui.bootstrap',
  'LocalStorageModule',
  'ngFileUpload',
  'updateMeta',
  'vcRecaptcha',
  "chart.js"
]);

var config = {
  routeUrl: ''
};

app.value('config', config);
var run = ['localStorageService', 'authService', '$state', '$transitions', 'modalService', '$anchorScroll', '$rootScope', 'statsService',
  function (localStorageService, authService, $state, $transitions, modalService, $anchorScroll, $rootScope, statsService) {
    statsService.pageCounter();
    localStorageService.set('currentUser', {});
    authService.loadCurrentUser().then(function (res) {
      if (($state.$current.self.protected && !localStorageService.get('currentUser').is_member) ||
        ($state.$current.self.onlyAdmin && !localStorageService.get('currentUser').is_admin)) {
        $state.go('landing');
      }
      $transitions.onStart({}, function (transition) {
        statsService.pageCounter();
        if (transition.to().protected && !localStorageService.get('currentUser').is_member) {
          modalService.showModal(1);
          return false;
        } else if (transition.to().onlyAdmin && !localStorageService.get('currentUser').is_admin) {
          $state.go('landing');
          return false;
        }
      });
    });
    $anchorScroll.yOffset = 85;

    $rootScope.$on('$viewContentLoaded', function () {
      angular.element('html, body').animate({scrollTop: 0}, 200);
    });
  }];

app.run(run);

angular.module('app').constant('appConfig', {
  appName: 'huefashion',
  webServiceUrl: 'https://huedata-fashion.herokuapp.com/api/',
  autoServiceUrl: 'https://hueauto.herokuapp.com/api/',
  brandingServiceUrl: 'https://huebrand.herokuapp.com/api/',
  legalServiceUrl: 'https://huelegal.herokuapp.com/api/',
  // authServiceUrl: 'http://localhost:5000',
  authServiceUrl: '',
  // dashboardServiceUrl: 'http://localhost:3002/',
  dashboardServiceUrl: 'https://gentle-bastion-76293.herokuapp.com/',
  colorAPI: 'http://myperfectcolor.gndex.com//api/list?key=123456789&',

  repositories: {
    mainParams: ['region_id', 'designer_id', 'category_id', 'season_id', 'year', 'city_id']
  }
});
