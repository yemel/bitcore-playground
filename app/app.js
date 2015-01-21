'use strict';

angular.module('playApp', [
  'ngRoute',
  'playApp.units',
  'playApp.keys',
  'playApp.hdkeys',
  'playApp.transaction',
  'playApp.multisig'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/units'});
}]).
filter('btc', function() {
  return function(satoshis) {
    return bitcore.Unit.fromSatoshis(satoshis).toBTC() + ' BTC';
  };
}).
filter('permalink', function() {
  return function(data, section) {
    var url = './#/' + section + '?data=' + encodeURI(data);
    if (url.length > 2083) throw new Error('URL too long')
    return url;
  };
}).
controller('SideBar', function($scope, $rootScope){
  $scope.setTestnet = function(value) {
    var networks = bitcore.Networks;
    networks.defaultNetwork = value ? networks.testnet : networks.livenet;
    $rootScope.$broadcast('networkUpdate');
  };
});