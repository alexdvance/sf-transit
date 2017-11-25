angular.module('muni.vehiclesMap', ['muni.d3Map', 'muni.mapData'])

.component('vehiclesMap', {
  templateUrl: 'components/vehicles-map/vehicles-map.html',
  bindings: {},
  controllerAs: 'vm',
  controller: function() {
    this.mapData = mapData;
  }
});
