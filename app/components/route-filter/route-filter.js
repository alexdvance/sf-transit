angular.module('muni.routeFilter', ['muni.routeFilterService'])

.component('routeFilter', {
  templateUrl: 'components/route-filter/route-filter.html',
  bindings: { area: '<' },
  controllerAs: 'vm',
  controller: ['mapStore', 'routeFilterService', function(mapStore, routeFilterService) {
    var vm = this;
    var mapData;

    vm.$onInit = function() {
      mapData = vm.mapData = mapStore.optsList[vm.area];
    };

    vm.filterRoute = function(route) {
      routeFilterService.filterRoute(route, mapData)
    };
  }]
});
