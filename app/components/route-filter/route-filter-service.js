angular.module('muni.routeFilterService', [])

.service('routeFilterService', [function() {
  this.filterRoute = function(route, mapData) {
    if (route === 'All') {
      clearFilters();
    } else if (!mapData.filtersOn) {
      Object.keys(mapData.filterHash).forEach(function(key) {
        mapData.filterHash[key] = false;
      });

      mapData.filterHash[route] = true;
      mapData.filtersOn = true;
    } else {
      mapData.filterHash[route] = !mapData.filterHash[route];

      if (shouldClearFilters()) {
        clearFilters();
      } else {
        mapData.filtersOn = true;
      }
    }

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
  };
}])
