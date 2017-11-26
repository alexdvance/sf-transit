angular.module('muni.vehiclesMap', [])

.component('vehiclesMap', {
  templateUrl: 'components/vehicles-map/vehicles-map.html',
  bindings: {},
  controllerAs: 'vm',
  controller: ['$element', '$interval', 'd3Map', 'mapData', 'localMapAPI', 'nextBusAPI', function($element, $interval, d3Map, mapData, localMapAPI, nextBusAPI) {
      this.mapData = mapData;

      localMapAPI.get().then(function(sfmap) {
        d3Map.createGeoJSONMap($element[0], sfmap.data);

        nextBusAPI.getVehicles(mapData.lastTime)
          .then(d3Map.addVehicleInfo);

        $interval(function() {
          nextBusAPI.getVehicles(mapData.lastTime)
            .then(d3Map.addVehicleInfo);
        }, 15000);
      });
    }]
});
