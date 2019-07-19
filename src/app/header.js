angular
  .module('app')
  .component('appHeader', {
    templateUrl: 'app/header.html',
    controller: function ($state, authService, $rootScope, $scope, localStorageService) {
      var self = this;

      this.navigations = [
        {
          name: 'About',
          subNavs: [
            {name: 'About', state: 'aboutPage'},
            {name: 'HUEDATA Vertical Coverage', state: 'verticalCoverage', onlyAdmin: true},
            {name: 'HUEDATA Members', state: 'members', onlyAdmin: true},
            {name: 'Speaking Engagements', state: 'speakingEngagements'},
            {name: 'Publication Schedule', state: 'publicationSchedule', onlyAdmin: true}
          ]
        }, {
          name: 'Color Trends',
          subNavs: [
            {name: 'Fashion Color Trends', state: 'fashion'},
            {name: 'Auto Color Trends', state: 'auto', onlyAdmin: true},
            {name: 'Brand Color Insights', state: 'branding', onlyAdmin: true},
            {name: 'Legal Color Insights', state: 'legal', onlyAdmin: true}
          ]
        }, {
          name: 'Color Research',
          subNavs: [
            {name: 'Indices', state: 'colorEmotion'},
            {name: 'The Color Naming Index', state: 'colorIndex'},
            {name: 'Reports', state: 'reports', onlyAdmin: true},
            {name: 'Infographics', state: 'infographics'},
            {name: 'Customized Infographics', state: 'customizedInfographics', onlyAdmin: true},
            {name: 'Courses', state: 'courses', onlyAdmin: true},
            {name: 'Teaching Materials', state: 'teachingMaterials', onlyAdmin: true},
            {name: 'Good Reads', state: 'goodReads', onlyAdmin: true}
          ]
        }, {
          name: 'Color Daily',
          subNavs: [
            {name: 'Blog', state: 'dailyInsights'}
          ]
        }, {
          name: 'Contact',
          subNavs: [
            {name: 'Contact Us', state: 'contact'},
            {name: 'Membership Inquiry', state: 'membership'},
            {name: 'Members Analytics', state: 'membersAnalytics', onlyAdmin: true},
            {name: 'Data Partnership Inquiry', state: 'partners'},
            {name: 'Press Inquiry', state: 'press'}
          ]
        }];

			this.navigation_profile = [{
				name: 'Hi',
				subNavs: [
					{name: 'Profile', state: 'profile'}
				]}];

      this.selectedTab = false;
      this.selectedSubTab = [];
      this.user = null;

      this.toggleMenu = function (navName) {
        if (_.findIndex(this.navigations, function (o) { return navName === o.name; }) === -1) {
          angular.element("#myNavbar").collapse('hide');
        }
      };

      this.open = function () {
        angular.element("#myNavbar").collapse('toggle');
      };

      this.getActiveMainNav = function (stateName) {
        var isActive;
        angular.forEach(this.navigations, function (nav) {
          if (stateName === nav.name && nav.subNavs) {
            angular.forEach(nav.subNavs, function (subNav) {
              if (subNav.state === $state.current.name) {
                isActive = true;
              }
              if (subNav.subNavs) {
                angular.forEach(subNav.subNavs, function (item) {
                  if (item.state === $state.current.name) {
                    isActive = true;
                  }
                });
              }
            });
          }
        });
        return isActive;
      };

      this.userIsLoggedIn = function () {
        return !!Object.keys(self.user).length;
      };

      this.logOut = function () {
        authService.logOut();
      };

      this.goProfile = function () {
        $state.go('profile');
      };

      this.goToLanding = function () {
        $state.go('/');
      };

      $scope.$watch(function () {
        return authService.currentUser;
      }, function (newVal) {
        self.user = localStorageService.get('currentUser');
      });

      this.hideHeader = function () {
        return $state.current.name === 'landing';
      };
    }
  });
