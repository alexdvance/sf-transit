angular.module('muni.mapStore', [])

.service('mapStore', [function() {
  var mapStore = {};

  mapStore.optsList = {};

  mapStore.createOpts = function(area) {
    return mapStore.optsList[area] = {
      routes: [],
      vehiclesHash: {},
      filterHash: {},
      filtersOn: false,
      lastTime: 0
    };
  };

  return mapStore;
}]);