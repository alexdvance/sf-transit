angular.module('muni.routeFilterService', [])

.service('routeFilterService', [function() {
  this.filterRoute = function(route, mapData) {
    if (route === 'All') {
      clearFilters();
    } else if (!mapData.filtersOn) {
      Object.keys(mapData.filtersHash).forEach(function(key) {
        mapData.filtersHash[key] = false;
      });

      mapData.filtersHash[route] = true;
      mapData.filtersOn = true;
    } else {
      mapData.filtersHash[route] = !mapData.filtersHash[route];

      shouldClearFilters() && clearFilters();
    }

    function clearFilters() {
      Object.keys(mapData.filtersHash).forEach(function(key) {
        mapData.filtersHash[key] = true;
      });

      mapData.filtersOn = false;
    }

    function shouldClearFilters() {
      var allFiltersOff = true;
      var allFiltersOn = true;

      Object.keys(mapData.filtersHash).forEach(function(key) {
        if (mapData.filtersHash[key])  {
          allFiltersOff = false;
        } else {
          allFiltersOn = false;
        }
      });

      return allFiltersOn || allFiltersOff;
    }
  };
}])
