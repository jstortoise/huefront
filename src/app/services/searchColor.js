angular.module('app').service('searchColor', ['$location', function (location) {
    var savedData = [];
    function set(paintColorNames = 0, colorAssociationNames = 0) {
       savedData.push(paintColorNames, colorAssociationNames);
    }
    function getPaintColorNames() {
        return savedData.shift();
    }
    function getColorAssociationNames() {
        return savedData.pop();
    }
    return {
        set: set,
			  getPaintColorNames: getPaintColorNames,
			  getColorAssociationNames: getColorAssociationNames
    }
}]);
