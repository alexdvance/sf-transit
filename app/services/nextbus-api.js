angular.module('muni.nextBusAPI', [])

.service('nextBusAPI', ['$http', function($http) {
  this.getVehicles = function(lastTime) {
    return $http.get('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=' + lastTime);
  };
}])
