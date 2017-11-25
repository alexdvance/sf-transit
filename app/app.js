'use strict';

// Declare app level module which depends on views, and components
angular.module('muni', [
  'ngRoute',
  'muni.view1'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
