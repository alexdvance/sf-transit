'use strict';

// Declare app level module which depends on views, and components
angular.module('muni', [
  'ngRoute',
  'muni.sfMap'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
