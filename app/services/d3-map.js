angular.module('muni.d3Map', [])

.service('d3Map', ['utils', 'mapData', function(utils, mapData) {
  var mapInfo = {
    width: 960,
    height: 500,
    svg: null,
    projection: null,
    path: null
  };

  function setupMap() {
    mapInfo.svg = d3.select('#sf-map-container')
      .attr('width', mapInfo.width)
      .attr('height', mapInfo.height);
    mapInfo.projection = d3.geoAlbersUsa();
    mapInfo.path = d3.geoPath().projection(mapInfo.projection);
  }

  function setupFilters(vehicleData) {
    mapData.routes = vehicleData.map(function(vehicle) {
      return vehicle.routeTag;
    });
    mapData.routes = utils.uniq(mapData.routes).sort(utils.naturalSort);

    mapData.routes.forEach(function(route) {
      mapData.filterHash[route] = true;
    });
  }

  this.createGeoJSONMap = function(GeoJSON) {
    if (!mapInfo.svg) setupMap();

    mapInfo.projection
      .scale(1)
      .translate([0, 0]);

    // Compute the bounds of a feature of interest, then derive scale & translate.
    // https://stackoverflow.com/a/14691788
    var bounds = mapInfo.path.bounds(GeoJSON);
    var scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / mapInfo.width, (bounds[1][1] - bounds[0][1]) / mapInfo.height);
    var translate = [
      (mapInfo.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
      (mapInfo.height - scale * (bounds[1][1] + bounds[0][1])) / 2];

    console.log('scale', scale)

    mapInfo.projection
      .scale(scale)
      .translate(translate);

    mapInfo.svg.select('path#sf-map')
      .datum(GeoJSON)
      .attr('stroke', 'gray')
      .attr('d', mapInfo.path);
  };

  this.addVehicleInfo = function(response) {
    mapData.lastTime = response.data.lastTime.time;

    // First time setup of route list and filters
    if (mapData.routes.length === 0) {
      setupFilters(response.data.vehicle);
    }

    // Update data
    response.data.vehicle.forEach(function(vehicle) {
      vehicle.coordX = mapInfo.projection([parseFloat(vehicle.lon), parseFloat(vehicle.lat)])[0];
      vehicle.coordY = mapInfo.projection([parseFloat(vehicle.lon), parseFloat(vehicle.lat)])[1];

      mapData.vehiclesHash[vehicle.id] = vehicle;
    });
  };
}])