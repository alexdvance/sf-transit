'use strict';

angular.module('muni.sfMap', ['ngRoute', 'muni.utils', 'muni.d3Map', 'muni.mapStore', 'muni.localMapAPI', 'muni.nextBusAPI', 'muni.routeFilter', 'muni.vehiclesMap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/sf-map.html',
    controller: 'SFMapCtrl as vm'
  })
}])

.controller('SFMapCtrl', ['mapStore', function(mapStore) {
  var vm = this;
  vm.area = 'sf';

  mapStore.createOpts(vm.area);
}]);
