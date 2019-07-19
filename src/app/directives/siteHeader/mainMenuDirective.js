angular.module('app').directive('hueMainMenu', ['$location', '$timeout', 'authService', 'userDataRepository', 'exportService', function (location, timeout, authService, userDataRepository, exportService) {
  function link(scope, element, attrs) {
    scope.activeTab = 0;
    scope.setTab = function (index) {
      scope.activeTab = index;
    };
    scope.isTabActive = function (index) {
      return scope.activeTab == index;
    };

    scope.currentUser = null;
    scope.isUserDeveloper = function () {
      if (scope.currentUser && scope.currentUser.profession == 'developer')
        return true;
      return false;
    };
    scope.goToLogin = function () {
      scope.hide();
      location.url('login');
    };

    scope.projectActionsDisabled = false;
    scope.projects = [];
    scope.loadProjects = function () {
      scope.openTab.expandedProjects = [];
      scope.saveTab.selectedProjectIndex = null;
      scope.projectActionsDisabled = true;
      userDataRepository.project.getItems(scope.currentUser.id, function (data) {
        scope.projects = data;
        scope.projectActionsDisabled = false;
      });
    };
    scope.openTab = {
      images: [],
      imageActionsDisabled: false,
      expandedProjects: null,
      expandProject: function (index) {
        scope.openTab.expandedProjects[index] = scope.openTab.expandedProjects[index] ? false : true;
      },
      isProjectExpanded: function (index) {
        return scope.openTab.expandedProjects[index] == true;
      },
      deleteProject: function (index) {
        if (!scope.projectActionsDisabled && confirm('Do you want to delete this Project?')) {
          scope.projectActionsDisabled = true;
          userDataRepository.project.deleteItem(scope.currentUser.id, scope.projects[index].id, function (data) {
            scope.loadProjects();
          });
        }
      },
      goToBoard: function (projectIndex, boardIndex) {
        scope.hide();
        location.url(scope.projects[projectIndex].boards[boardIndex].url);
      },
      deleteBoard: function (projectIndex, boardIndex) {
        if (!scope.projectActionsDisabled && confirm('Do you want to delete this Board?')) {
          scope.projectActionsDisabled = true;
          userDataRepository.board.deleteItem(scope.currentUser.id, scope.projects[projectIndex].id, scope.projects[projectIndex].boards[boardIndex].id, function (data) {
            scope.loadProjects();
          });
        }
      },
      loadImages: function () {
        userDataRepository.image.getItems(scope.currentUser.id, function (data) {
          scope.openTab.images = data;
          scope.openTab.imageActionsDisabled = false;
        });
      },
      openImage: function (index) {
        //scope.openTab.images[index].id
      },
      deleteImage: function (index) {
        if (!scope.openTab.imageActionsDisabled && confirm('Do you want to delete this Image?')) {
          scope.openTab.imageActionsDisabled = true;
          userDataRepository.image.deleteItem(scope.currentUser.id, scope.openTab.images[index].id, function (data) {
            scope.openTab.loadImages();
          });
        }
      }
    };

    scope.saveTab = {
      tabMode: 0, //0 - save board, 1 - create project
      selectedProjectIndex: null,
      boardName: null,
      projectName: null,
      setTabMode: function (mode) {
        scope.saveTab.tabMode = mode;
      },
      isTabMode: function (mode) {
        return scope.saveTab.tabMode == mode;
      },
      selectProject: function (index) {
        scope.saveTab.selectedProjectIndex = index;
      },
      isProjectSelected: function (index) {
        return scope.saveTab.selectedProjectIndex == index;
      },
      createBoard: function () {
        if (scope.projectActionsDisabled || !scope.saveTab.boardName || scope.saveTab.selectedProjectIndex == null)
          return;

        scope.projectActionsDisabled = true;
        userDataRepository.board.createItem(scope.currentUser.id, scope.projects[scope.saveTab.selectedProjectIndex].id, scope.saveTab.boardName, location.url(), function (data) {
          scope.saveTab.boardName = null;
          scope.loadProjects();
          alert('Board has been saved successfully!');
        });
      },
      createProject: function () {
        if (scope.projectActionsDisabled || !scope.saveTab.projectName)
          return;

        scope.projectActionsDisabled = true;
        userDataRepository.project.createItem(scope.currentUser.id, scope.saveTab.projectName, function (data) {
          scope.saveTab.projectName = null;
          scope.loadProjects();
          alert('Project has been saved successfully!');
        });
      }
    };

    scope.userProfileTab = {
      mode: 0,
      actionsDisabled: false,
      fullName: null,
      company: null,
      profession: null,
      position: null,
      password: null,
      passwordConfirmation: null,
      isMode: function (mode) {
        return scope.userProfileTab.mode == mode;
      },
      setMode: function (mode) {
        scope.userProfileTab.mode = mode;
      },
      loadData: function (user) {
        scope.userProfileTab.fullName = scope.currentUser.full_name;
        scope.userProfileTab.company = scope.currentUser.company;
        scope.userProfileTab.profession = scope.currentUser.profession;
        scope.userProfileTab.position = scope.currentUser.position;
      },
      saveData: function () {
        if (scope.userProfileTab.actionsDisabled)
          return;

        if (scope.userProfileTab.mode == 0) {
          scope.userProfileTab.actionsDisabled = true;
          authService.currentUser.full_name = scope.userProfileTab.fullName;
          authService.currentUser.company = scope.userProfileTab.company;
          authService.currentUser.profession = scope.userProfileTab.profession;
          authService.currentUser.position = scope.userProfileTab.position;
          authService.updateUser(function (data) {
            scope.userProfileTab.loadData();
            alert("User profile has been updated.");
            scope.userProfileTab.actionsDisabled = false;
          });
        } else {
          if (scope.userProfileTab.password == null || scope.userProfileTab.password.length == 0) {
            alert("Password can not be empty.");
            return;
          }
          if (scope.userProfileTab.password.length < 6) {
            alert("Password must be 6 symbols or longer.");
            return;
          }
          if (scope.userProfileTab.password != scope.userProfileTab.passwordConfirmation) {
            alert("Passwords do not match.");
            return;
          }

          scope.userProfileTab.actionsDisabled = true;
          authService.updatePassword(scope.userProfileTab.password, function (data) {
            scope.userProfileTab.loadData();
            alert("User password has been changed.");
            scope.userProfileTab.password = null;
            scope.userProfileTab.passwordConfirmation = null;
            scope.userProfileTab.actionsDisabled = false;
          });
        }
      }
    };

    scope.saveAsJpg = function () {
      scope.hide();
      timeout(function () {
        exportService.exportJpg();
      }, 250);
    };
    scope.saveAsPdf = function () {
      scope.hide();
      timeout(function () {
        exportService.exportPdf();
      }, 250);
    };

    scope.$watch(function () {
      return authService.currentUser;
    }, function (newValue, oldValue) {
      scope.currentUser = newValue;
      if (newValue) {
        scope.loadProjects();
        scope.openTab.loadImages();
        scope.userProfileTab.loadData();
      }
    }, true);

    scope.$on('mainMenuReloadSavedImages', function (event) {
      scope.openTab.loadImages();
    });
  }

  return {
    restrict: 'E',
    templateUrl: 'app/directives/siteHeader/mainMenuView.html',
    link: link,
    scope: {
      show: '=',
      hide: '&'
    }
  };
}]);
