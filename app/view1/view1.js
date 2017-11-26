'use strict';

angular.module('muni.view1', ['ngRoute', 'muni.utils', 'muni.d3Map', 'muni.mapData', 'muni.localMapAPI', 'muni.nextBusAPI', 'muni.routeFilter', 'muni.vehiclesMap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view1/view1.html',
  });
}]);
