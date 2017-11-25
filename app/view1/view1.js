'use strict';

angular.module('muni.view1', ['ngRoute', 'muni.utils', 'muni.mapData', 'muni.localMapAPI', 'muni.nextBusAPI', 'muni.routeFilter', 'muni.vehiclesMap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl as vm'
  });
}])

.controller('View1Ctrl', ['$interval', 'd3Map', 'mapData', 'localMapAPI', 'nextBusAPI', function($interval, d3Map, mapData, localMapAPI, nextBusAPI) {
    localMapAPI.get().then(function(sfmap) {
      d3Map.createGeoJSONMap(sfmap.data);

      nextBusAPI.getVehicles(mapData.lastTime)
        .then(d3Map.addVehicleInfo);

      $interval(function() {
        nextBusAPI.getVehicles(mapData.lastTime)
          .then(d3Map.addVehicleInfo);
      }, 15000);
    });
}]);
