'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl as vm'
  });
}])

.controller('View1Ctrl', ['$http', '$interval', function($http, $interval) {
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

  d3.json('/resources/sfmaps/streets.json', function(error, sf) {
    if (error) throw error;

    projection
      .scale(1)
      .translate([0, 0]);

    // Compute the bounds of a feature of interest, then derive scale & translate.
    // https://stackoverflow.com/a/14691788
    var b = path.bounds(sf),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
      .scale(s)
      .translate(t);

    svg.select('path#sf-map')
      .datum(sf)
      .attr('stroke', 'gray')
      .attr('d', path);

    addVehicleInfo();

    var timeToUpdate = 15;

    $interval(function() {
      timeToUpdate = timeToUpdate > 1 ? timeToUpdate - 1 : 15;
      console.log(timeToUpdate)
    }, 1000)

    $interval(addVehicleInfo, 15000);
  });

  function addVehicleInfo() {
    $http.get('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=' + lastTime).then(function(response) {
      lastTime = response.data.lastTime.time;

      if (map.routes.length === 0) {
        map.routes = response.data.vehicle.map(function(vehicle) {
          return vehicle.routeTag;
        });
        map.routes = uniq(map.routes).naturalSort();

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

    var allFiltersOn = true;
    var allFiltersOff = true;

    if (_route === 'All') {
      clearFilters();
    } else if (!map.filtersOn) {
      Object.keys(map.filterHash).forEach(function(key) {
        map.filterHash[key] = false;
      });

      map.filterHash[_route] = true;
      map.filtersOn = true;
      console.log('map.filtersOn', map.filtersOn)
    } else {
      map.filterHash[_route] = !map.filterHash[_route];

      Object.keys(map.filterHash).forEach(function(key) {
        if (map.filterHash[key])  {
          allFiltersOff = false;
        }
        if (!map.filterHash[key])  {
          allFiltersOn = false;
        }
      });

      if (allFiltersOn || allFiltersOff) {
        clearFilters();
      } else {
        map.filtersOn = true;
      }
    }

    console.log('filtered filterHash', map.filterHash)
  }

  // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
  function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }

  // http://snipplr.com/view/36012/javascript-natural-sort/
  Array.prototype.naturalSort = function(){
    var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
    return this.sort(function(as, bs){
      a = String(as).toLowerCase().match(rx);
      b = String(bs).toLowerCase().match(rx);

      while(a.length && b.length){
        a1 = a.shift();
        b1 = b.shift();
        if(rd.test(a1) || rd.test(b1)){
          if(!rd.test(a1)) return 1;
          if(!rd.test(b1)) return -1;
          if(a1!= b1) return a1-b1;
        } else if(a1!= b1) return a1> b1? 1: -1;
      }
      return a.length- b.length;
    });
  }

  this.map = map;
  this.filterRoute = filterRoute;
}]);
