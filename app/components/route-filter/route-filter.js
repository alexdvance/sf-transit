angular.module('muni.routeFilter', ['muni.mapData'])

.component('routeFilter', {
  templateUrl: 'components/route-filter/route-filter.html',
  bindings: {},
  controllerAs: 'vm',
  controller: ['mapData', function(mapData) {
    function filterRoute(_route) {
      function clearFilters() {
        Object.keys(mapData.filterHash).forEach(function(key) {
          mapData.filterHash[key] = true;
        });

        mapData.filtersOn = false;
      }

      function shouldClearFilters() {
        var allFiltersOff = true;
        var allFiltersOn = true;

        Object.keys(mapData.filterHash).forEach(function(key) {
          if (mapData.filterHash[key])  {
            allFiltersOff = false;
          } else {
            allFiltersOn = false;
          }
        });

        return allFiltersOn || allFiltersOff;
      }

      if (_route === 'All') {
        clearFilters();
      } else if (!mapData.filtersOn) {
        Object.keys(mapData.filterHash).forEach(function(key) {
          mapData.filterHash[key] = false;
        });

        mapData.filterHash[_route] = true;
        mapData.filtersOn = true;
      } else {
        mapData.filterHash[_route] = !mapData.filterHash[_route];

        if (shouldClearFilters()) {
          clearFilters();
        } else {
          mapData.filtersOn = true;
        }
      }

      console.log('filtered filterHash', mapData.filterHash)
    }

    this.filterRoute = filterRoute;
    this.mapData = mapData;
  }]
});
