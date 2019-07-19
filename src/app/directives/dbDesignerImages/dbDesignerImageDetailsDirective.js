angular.module('app').directive('hueDbDesignerImageDetails', function ($timeout, searchMenuRepository, userDataRepository, mainMenuService, authService,$rootScope) {
  function link(scope, element, attrs,rootScope) {
    rootScope = {mood_state : 0};
    scope.allData = scope.data;
    scope.data = scope.allData.data[scope.allData.index];

    scope.designer = "";
    scope.season = null;
    scope.year = null;
    scope.category = "";
    scope.city = "";
    scope.region = "";
    scope.source = "";
    scope.colorActual = null;
    scope.colorNcs = null;
    scope.colorNcsTitle = null;

    scope.footerMode = 0;
    scope.imageName = null;

    scope.currentUser = null;

    if (scope.data.bio.color) {
      scope.colorNcs = scope.data.bio.color.color.hex;
      scope.colorNcsTitle = scope.data.bio.color.title;
    }

    scope.closeClickHandler = function () {
      scope.onClose();
    };

    scope.shareFacebook = function (url) {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + url);
    }

    scope.shareTwitter = function (url) {
      window.open('https://twitter.com/home?status=' + url);
    }

    scope.sharePinterest = function (url) {
      window.open('https://pinterest.com/pin/create/button/?url=' + url);
    }

    scope.shareGooglePlus = function (url) {
      window.open('https://plus.google.com/share?url=' + url);
    }

    scope.newmoodboard = function(data){
      scope.$emit('mood_state_changed',data);
      scope.$broadcast('mood_state_changed',data);
    }
    
    scope.LeftButtonHandler = function () {
      let index = scope.allData.index;
      if (index > 0) {
        index--;
      }
      scope.allData.index = index;
      scope.data = scope.allData.data[index];
    };

    scope.RightButtonHandler = function () {
      try {
        let index = scope.allData.index;
        if (index < scope.allData.data.length - 1) {
          index++;
        }
        scope.allData.index = index;
        scope.data = scope.allData.data[index];
      } catch (e) {}
    }
    scope.isFooterMode = function (index) {
      return scope.footerMode == index;
    };

    scope.showSaveInput = function () { //on SAVE button click
      scope.footerMode = 1;
    };

    scope.exportImageCard = function () {
      $timeout(function () {
        html2canvas($('.image-details-dialog', element)[0], {
          background: '#000',
          //useCORS: true,
          proxy: '/proxy',
          onrendered: function (canvas) {
            var img = canvas.toDataURL("image/jpeg");
            var name = scope.designer;

            if (scope.season)
              name += '_' + scope.season;
            if (scope.year)
              name += '_' + scope.year;

            download(img, name.replace(/[|&;$%@"<>()+,]/g, "-") + '.jpg', "image/jpeg");
          }
        });
      }, 50);
    };

    scope.saveImage = function () {
      userDataRepository.image.createItem(scope.currentUser.id, scope.data.id, scope.imageName, function (data) {
        mainMenuService.reloadSavedImages();
      });
      scope.imageName = null;
      scope.footerMode = 2;
    };

    searchMenuRepository.getMain(function (data) {
      var desId = scope.data.bio.fashion_designer_id;
      scope.designer = _.find(data.designers, function (item) {
        return item.id == desId
      }).title;
      scope.season = _.find(data.seasons, function (item) {
        return item.id == scope.data.bio.fashion_season_id
      }).title;
      scope.year = scope.data.bio.fashion_year_id;
      scope.category = _.find(data.categories, function (item) {
        return item.id == scope.data.bio.fashion_category_id
      }).title;
      scope.city = scope.data.bio.city;
      scope.region = _.find(data.regions, function (item) {
        return item.id == scope.data.bio.fashion_region_id
      }).title;
      scope.source = scope.data.bio.source;
      scope.colorActual = 'rgb(' + scope.data.bio.rgb + ')';
    });

    scope.$watch(function () {
      return authService.currentUser;
    }, function (newValue, oldValue) {
      scope.currentUser = newValue;
    }, true);
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/dbDesignerImages/dbDesignerImageDetailsView.html',
    link: link,
    scope: {
      data: '=',
      onClose: '&'
    }
  };
});
