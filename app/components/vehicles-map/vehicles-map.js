angular.module('muni.vehiclesMap', ['muni.mapData'])

.component('vehiclesMap', {
  templateUrl: 'components/vehicles-map/vehicles-map.html',
  bindings: {},
  controllerAs: 'vm',
  controller: ['$http', '$interval', 'utils', 'mapData', 'localMapAPI', 'nextBusAPI', function($http, $interval, utils, mapData, localMapAPI, nextBusAPI) {
    var width = 960;
    var height = 500;

    var svg = d3.select('#sf-map-container')
      .attr('width', width)
      .attr('height', height);
    var projection = d3.geoAlbersUsa();
    var path = d3.geoPath().projection(projection);

    localMapAPI.get().then(function(sfmap) {
      createGeoJSONMap(sfmap.data);

      addVehicleInfo();

      var timeToUpdate = 15;

      $interval(function() {
        timeToUpdate = timeToUpdate > 1 ? timeToUpdate - 1 : 15;
        console.log(timeToUpdate)
      }, 1000)

      $interval(addVehicleInfo, 15000);
    });

    function createGeoJSONMap(GeoJSON) {
      projection
        .scale(1)
        .translate([0, 0]);

      // Compute the bounds of a feature of interest, then derive scale & translate.
      // https://stackoverflow.com/a/14691788
      var b = path.bounds(GeoJSON),
          s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
          t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

      console.log('scale', s)

      projection
        .scale(s)
        .translate(t);

      svg.select('path#sf-map')
        .datum(GeoJSON)
        .attr('stroke', 'gray')
        .attr('d', path);
    }

    function addVehicleInfo() {
      nextBusAPI.getVehicles(mapData.lastTime).then(function(response) {
        mapData.lastTime = response.data.lastTime.time;

        // First time setup of route list and filters
        if (mapData.routes.length === 0) {
          mapData.routes = response.data.vehicle.map(function(vehicle) {
            return vehicle.routeTag;
          });
          mapData.routes = utils.uniq(mapData.routes).sort(utils.naturalSort);

          mapData.routes.forEach(function(route) {
            mapData.filterHash[route] = true;
          });
        }

        mapData.vehicles = response.data.vehicle;

        mapData.vehicles.forEach(function(vehicle) {
          vehicle.coordX = projection([parseFloat(vehicle.lon), parseFloat(vehicle.lat)])[0];
          vehicle.coordY = projection([parseFloat(vehicle.lon), parseFloat(vehicle.lat)])[1];
          mapData.vehiclesHash[vehicle.id] = vehicle;
        });

        mapData.vehicles = Object.keys(mapData.vehiclesHash).map(function(vehicle) {
          return mapData.vehiclesHash[vehicle];
        });

        console.log('mapData.vehicles', mapData.vehiclesHash)

        console.log('total vehicles', mapData.vehicles.length, 'updated vehicles', response.data.vehicle.length);
      });
    }

    this.map = mapData;
  }]
});
