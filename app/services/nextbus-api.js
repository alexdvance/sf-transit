angular.module('muni.nextBusAPI', [])

.service('nextBusAPI', ['$http', function($http) {
  var areasDict = {
    sf: 'sf-muni'
  };

  this.getVehicles = function(area, lastTime) {
    return $http.get('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=' + areasDict[area] + '&t=' + lastTime);
  };
}])
