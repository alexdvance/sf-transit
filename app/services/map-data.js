angular.module('muni.mapData', [])

.service('mapData', [function() {
  this.routes = [];
  this.vehicles = [];
  this.vehiclesHash = {};
  this.filterHash = {};
  this.filtersOn = false;
  this.lastTime = 0;
}]);
