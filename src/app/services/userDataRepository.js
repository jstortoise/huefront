angular.module('app').service('userDataRepository',
  ['$http', 'appConfig', 'authService', function (http, appConfig, authService) {
	var getUserUrl = function (userId, service) {
		return appConfig.webServiceUrl + 'users/' + userId + '/' + service;
	};
	var getBoardUrl = function (userId, projectId, service) {
		return appConfig.webServiceUrl + 'users/' + userId + '/projects/' + projectId + '/' + service;
	};

	this.project = {
		getItems: function (userId, callback) {
			http.get(getUserUrl(userId, 'projects'), { params: { token: authService.token, callback: 'JSON_CALLBACK' } }).then(callback);
		},
		createItem: function (userId, title, callback) {
			http.get(getUserUrl(userId, 'projects/create'), { params: { title: title, token: authService.token, callback: 'JSON_CALLBACK' } }).then(callback);
		},
		deleteItem: function (userId, projectId, callback) {
			http.get(getBoardUrl(userId, projectId, 'delete'), { params: { token: authService.token, callback: 'JSON_CALLBACK' } }).then(callback);
		}
	};
	this.board = {
		getItems: function (userId, projectId, callback) {
			http.get(getBoardUrl(userId, projectId, 'boards'), { params: { token: authService.token, callback: 'JSON_CALLBACK' } }).then(callback);
		},
		createItem: function (userId, projectId, title, url, callback) {
			http.get(getBoardUrl(userId, projectId, 'boards/create'), { params: { title: title, url: url, token: authService.token, callback: 'JSON_CALLBACK' } }).then(callback);
		},
		deleteItem: function (userId, projectId, boardId, callback) {
			http.get(getBoardUrl(userId, projectId, 'boards/' + boardId + '/delete'), { params: { token: authService.token, callback: 'JSON_CALLBACK' } }).then(callback);
		}
	};
	this.image = {
		getItems: function (userId, callback) {
			http.get(getUserUrl(userId, 'images'), { params: { token: authService.token, callback: 'JSON_CALLBACK' } }).then(callback);
		},
		createItem: function (userId, imageId, title, callback) {
			http.get(getUserUrl(userId, 'images/create'), { params: { id: imageId, title: title, token: authService.token, callback: 'JSON_CALLBACK' } }).then(callback);
		},
		deleteItem: function (userId, imageId, callback) {
			http.get(getUserUrl(userId, 'images/' + imageId + '/delete'), { params: { token: authService.token, callback: 'JSON_CALLBACK' } }).then(callback);
		}
	};

	this.deactivateAccount = function (reason, callback) {
		var params = isNaN(reason) ? { reason: reason } : { reason_id: reason };
		params.token = authService.token;
		params.callback = 'JSON_CALLBACK';

		var req = http.get(appConfig.authServiceUrl + 'deactivate', { params: params });

		if (callback)
			req.then(callback);
	};
}]);
