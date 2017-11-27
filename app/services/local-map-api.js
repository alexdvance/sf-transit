angular.module('muni.localMapAPI', [])

.service('localMapAPI', ['$http', function($http) {
  this.get = function(area) {
    return $http.get('/resources/' + area + 'maps/streets.json');
  };
}])
