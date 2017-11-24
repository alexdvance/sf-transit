'use strict';

angular.module('muni.view1', ['ngRoute', 'muni.utils', 'muni.mapData', 'muni.localMapAPI', 'muni.nextBusAPI', 'muni.routeFilter', 'muni.vehiclesMap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl as vm'
  });
}])

.controller('View1Ctrl', ['$http', '$interval', 'utils', 'mapData', 'localMapAPI', 'nextBusAPI', function($http, $interval, utils, mapData, localMapAPI, nextBusAPI) {
}]);
