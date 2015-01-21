'use strict';

angular.module('playApp.keys', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/keys', {
    templateUrl: 'keys/keys.html',
    controller: 'KeysCtrl'
  });
}])

.controller('KeysCtrl', function($scope, $routeParams) {

  $scope.$on('networkUpdate', function() {
    $scope.newKey();
  });

  $scope.newKey = function() {
    $scope.privateKey = new bitcore.PrivateKey();
    $scope.publicKey = $scope.privateKey.publicKey;
  };
  

  $scope.privateUpdated = function(value) {
    if (bitcore.PrivateKey.isValid(value)) {
      $scope.privateKey = new bitcore.PrivateKey(value);
      $scope.publicKey = $scope.privateKey.publicKey;
    } else {
      // mark as invalid
    }
  };

  $scope.publicUpdated = function(value) {
    if (bitcore.PublicKey.isValid(value)) {
      $scope.privateKey = '';
      $scope.publicKey = new bitcore.PublicKey(value);
    } else {
      // mark as invalid
    }
  };

  $scope.serialize = function() {
    return JSON.stringify({
      network: bitcore.Networks.defaultNetwork.name,
      privateKey: $scope.privateKey.toString(),
      publicKey: $scope.publicKey.toString()
    });
  };

  // Initialize
  if ($routeParams.data) {
    var data = JSON.parse($routeParams.data);
    bitcore.Networks.defaultNetwork = bitcore.Networks.get(data.network);
    $scope.privateKey = new bitcore.PrivateKey(data.privateKey);
    $scope.publicKey = new bitcore.PublicKey(data.publicKey);
  } else {
    $scope.newKey();
  }

});