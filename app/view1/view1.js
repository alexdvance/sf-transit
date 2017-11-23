'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl as vm'
  });
}])

.controller('View1Ctrl', ['$http', function($http) {
  this.test = 'Test';

  var width = 960;
  var height = 500;

  var svg = d3.select('#sf-map')
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

    svg.append('path')
      .datum(sf)
      .attr('stroke', 'gray')
      .attr('d', path);

    addVehicleInfo();
  });

  function addVehicleInfo() {
    $http.get('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni').then(function(response) {
      var coords = response.data.vehicle.map(function(vehicle) {
        return [parseFloat(vehicle.lon), parseFloat(vehicle.lat)];
      });

      svg.selectAll('circle')
        .data(coords).enter()
        .append('circle')
        .attr('cx', function (d) { return projection(d)[0]; })
        .attr('cy', function (d) { return projection(d)[1]; })
        .attr('r', '1px')
        .attr('fill', 'red');
    });
  }
}]);
