'use strict';

angular.module('muni.view1', ['ngRoute', 'muni.utils', 'muni.localMapAPI', 'muni.nextBusAPI'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl as vm'
  });
}])

.controller('View1Ctrl', ['$http', '$interval', 'utils', 'localMapAPI', 'nextBusAPI', function($http, $interval, utils, localMapAPI, nextBusAPI) {
  var map = {
    routes: [],
    vehicles: [],
    vehiclesHash: {},
    filterHash: {},
    filtersOn: false
  };

  var lastTime = 0;

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

    // var timeToUpdate = 15;

    // $interval(function() {
    //   timeToUpdate = timeToUpdate > 1 ? timeToUpdate - 1 : 15;
    //   console.log(timeToUpdate)
    // }, 1000)

    $interval(addVehicleInfo, 15000);
  });

  function createGeoJSONMap(GeoJSON) {
    projection
      .scale(1)
      .translate([0, 0]);

    // Compute the bounds of a feature of interest, then derive scale & translate.
    // https://stackoverflow.com/a/14691788
    var b = path.bounds(GeoJSON),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
      .scale(s)
      .translate(t);

    svg.select('path#sf-map')
      .datum(GeoJSON)
      .attr('stroke', 'gray')
      .attr('d', path);
  }

  function addVehicleInfo() {
    nextBusAPI.getVehicles(lastTime).then(function(response) {
      lastTime = response.data.lastTime.time;

      // First time setup of route list and filters
      if (map.routes.length === 0) {
        map.routes = response.data.vehicle.map(function(vehicle) {
          return vehicle.routeTag;
        });
        map.routes = utils.uniq(map.routes).sort(utils.naturalSort);

        map.routes.forEach(function(route) {
          map.filterHash[route] = true;
        });
      }

      map.vehicles = response.data.vehicle;

      map.vehicles.forEach(function(vehicle) {
        vehicle.coordX = projection([parseFloat(vehicle.lon), parseFloat(vehicle.lat)])[0];
        vehicle.coordY = projection([parseFloat(vehicle.lon), parseFloat(vehicle.lat)])[1];
        map.vehiclesHash[vehicle.id] = vehicle;
      });

      map.vehicles = Object.keys(map.vehiclesHash).map(function(vehicle) {
        return map.vehiclesHash[vehicle];
      })

      console.log('map.vehicles', map.vehiclesHash)

      console.log('total vehicles', map.vehicles.length, 'updated vehicles', response.data.vehicle.length);
    });
  }

  function filterRoute(_route) {
    function clearFilters() {
      Object.keys(map.filterHash).forEach(function(key) {
        map.filterHash[key] = true;
      });

      map.filtersOn = false;
    }

    function shouldClearFilters() {
      var allFiltersOff = true;
      var allFiltersOn = true;

      Object.keys(map.filterHash).forEach(function(key) {
        if (map.filterHash[key])  {
          allFiltersOff = false;
        }
        if (!map.filterHash[key])  {
          allFiltersOn = false;
        }
      });

      return allFiltersOn || allFiltersOff;
    }

    if (_route === 'All') {
      clearFilters();
    } else if (!map.filtersOn) {
      Object.keys(map.filterHash).forEach(function(key) {
        map.filterHash[key] = false;
      });

      map.filterHash[_route] = true;
      map.filtersOn = true;
    } else {
      map.filterHash[_route] = !map.filterHash[_route];

      if (shouldClearFilters()) {
        clearFilters();
      } else {
        map.filtersOn = true;
      }
    }

    console.log('filtered filterHash', map.filterHash)
  }

  this.map = map;
  this.filterRoute = filterRoute;
}]);
