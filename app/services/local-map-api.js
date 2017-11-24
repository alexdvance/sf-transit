angular.module('muni.localMapAPI', [])

.service('localMapAPI', ['$http', function($http) {
  this.get = function() {
    return $http.get('/resources/sfmaps/streets.json');
  };
}])
