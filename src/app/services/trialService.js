angular.module('app').service('trialService', ['$rootScope', '$timeout', 'authService', function (rootScope, timeout, authService) {
	var self = this;
	var expiriationDate = null;
	var expirationTimeout = null;
	var lockTimeout = null;

	this.getRemainingTime = function () { //in ms
		return expiriationDate - new Date();
	};

	this.getTimeToLock = function () { //in ms
		return expiriationDate - new Date() + 3600000; //add 1h
	};

	this.isTrialExpired = function () {
		if (!authService.currentUser)
			return false;

		return self.getRemainingTime() < 0;
	};

	this.isSiteLocked = function () {
		if (!authService.currentUser)
			return false;

		return self.getTimeToLock() < 0;
	};

	rootScope.$watch(function () { return authService.currentUser; }, function (newValue, oldValue) {
		if (newValue) {
			expiriationDate = new Date(newValue.expiration_date);

			if (newValue.is_member) {
				if (expirationTimeout)
					timeout.cancel(expirationTimeout);
				if (lockTimeout)
					timeout.cancel(lockTimeout);
			} else {
				if (self.isSiteLocked())
					rootScope.$broadcast('siteLocked');
				else if (self.isTrialExpired()) {
					rootScope.$broadcast('accountTrialTimeExpired');

					if (lockTimeout)
						timeout.cancel(lockTimeout);

					var ttl = self.getTimeToLock();
					if (ttl < 2147483647)
						lockTimeout = timeout(function () { rootScope.$broadcast('siteLocked'); }, ttl);
				}
				else {
					if (expirationTimeout)
						timeout.cancel(expirationTimeout);

					var rt = self.getRemainingTime();
					if (rt < 2147483647)
						expirationTimeout = timeout(function () { rootScope.$broadcast('accountTrialTimeExpired'); }, rt);

					if (lockTimeout)
						timeout.cancel(lockTimeout);

					var ttl = self.getTimeToLock();
					if (ttl < 2147483647)
						lockTimeout = timeout(function () { rootScope.$broadcast('siteLocked'); }, ttl);
				}
			}
		}
	});
}]);