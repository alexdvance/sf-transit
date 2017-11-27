angular.module('muni.d3Map', [])

.service('d3Map', ['$window', 'utils', 'mapStore', function($window, utils, mapStore) {
  var mapInfo = {
    width: $window.innerWidth,
    height: $window.innerHeight - 60,
    svg: null,
    projection: null,
    path: null,
    zoom: null
  };

  function setupMap(element) {
    mapInfo.svg = d3.select(element).select('svg')
      .attr('width', mapInfo.width)
      .attr('height', mapInfo.height);
    mapInfo.projection = d3.geoAlbersUsa()
      .scale(1)
      .translate([0, 0]);
    mapInfo.path = d3.geoPath().projection(mapInfo.projection);
    mapInfo.zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on('zoom', zoomed);

    function zoomed() {
      d3.select('g').attr('transform', 'translate(' + d3.event.transform.x + ', ' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
    }
  }

  function setupFilters(mapData) {
    mapData.routes = utils.uniq(mapData.routes).sort(utils.naturalSort);

    mapData.routes.forEach(function(route) {
      mapData.filterHash[route] = true;
    });
  }

  this.createGeoJSONMap = function(element, GeoJSON) {
    setupMap(element);

    // Compute the bounds of GeoJSON area, then derive scale & translate.
    // https://stackoverflow.com/a/14691788
    var bounds = mapInfo.path.bounds(GeoJSON);
    var scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / mapInfo.width, (bounds[1][1] - bounds[0][1]) / mapInfo.height);
    var translate = [
      (mapInfo.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
      (mapInfo.height - scale * (bounds[1][1] + bounds[0][1])) / 2];

    mapInfo.projection
      .scale(scale)
      .translate(translate);

    mapInfo.svg.select('path')
      .datum(GeoJSON)
      .attr('d', mapInfo.path);

    // Run zoom on rect element vs map group element for better performance
    mapInfo.svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', mapInfo.width)
    .attr('height', mapInfo.height)
    .attr('fill', 'transparent')
    .attr('cursor', 'move')
      .call(mapInfo.zoom)
  };

  this.addVehicleInfo = function(response, area) {
    var mapData = mapStore.optsList[area];
    var routesNotSet = mapData.routes.length === 0;

    mapData.lastTime = response.data.lastTime.time;

    response.data.vehicle.forEach(function(vehicle) {
      vehicle.coordX = mapInfo.projection([parseFloat(vehicle.lon), parseFloat(vehicle.lat)])[0];
      vehicle.coordY = mapInfo.projection([parseFloat(vehicle.lon), parseFloat(vehicle.lat)])[1];

      mapData.vehiclesHash[vehicle.id] = vehicle;
      routesNotSet && mapData.routes.push(vehicle.routeTag);
    });

    routesNotSet && setupFilters(mapData);
  };
}])
