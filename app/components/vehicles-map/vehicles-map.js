angular.module('muni.vehiclesMap', [])

.component('vehiclesMap', {
  templateUrl: 'components/vehicles-map/vehicles-map.html',
  bindings: { area: '<' },
  controllerAs: 'vm',
  controller: ['$scope', '$element', '$interval', 'd3Map', 'mapStore', 'localMapAPI', 'nextBusAPI', function($scope, $element, $interval, d3Map, mapStore, localMapAPI, nextBusAPI) {
      var vm = this;
      var mapData;

      vm.$onInit = function() {
        mapData = vm.mapData = mapStore.optsList[vm.area];

        localMapAPI.get(vm.area).then(function(response) {
          d3Map.createGeoJSONMap($element[0], response.data);

          getAndAddVehicles();
          $interval(getAndAddVehicles, 15000);
        });
      };

      function getAndAddVehicles() {
        nextBusAPI.getVehicles(vm.area, mapData.lastTime)
          .then(function(response) {
            d3Map.addVehicleInfo(response, vm.area);
          });
      }
    }]
});
