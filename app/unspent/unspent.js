'use strict';

angular.module('playApp.unspent', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/unspent', {
    templateUrl: 'unspent/unspent.html',
    controller: 'UnspentCtrl'
  });
}])

.controller('UnspentCtrl', function($scope, $http, bitcore) {

  var explorers = require('bitcore-explorers');
  $scope.utxoAddress = 'muemjaFAtbMWssA5hHgQoNP2utb1HtNbkd';
  $scope.utxos = [];
  $scope.loading = false;

  $scope.addressUpdated = function(address) {
    setExampleCode();
  };

  $scope.fetchUTXO = function(address) {
    var client = new explorers.Insight();
    if (!bitcore.Address.isValid(address)) return; // mark as invalid

    $scope.loading = true;
    client.getUnspentUtxos(address, onUTXOs);

    function onUTXOs(err, utxos) {
      $scope.loading = false;
      if (err) throw err;

      $scope.utxos = utxos;
      for (var utxo in utxos) {
        utxos[utxo].url = client.url + '/tx/' + utxos[utxo].txId;
        utxos[utxo].txUrl = 'transaction/';
      }
      $scope.$apply();
      console.log(utxos);
    }
  };

  $scope.serialize = function() {
    return JSON.stringify({
      address: $scope.utxoAddress,
      utxos: $scope.utxos.map(function(utxo) { return utxo.toObject(); })
    });
  };

  function setExampleCode() {
    var template = "";
    var address = $scope.utxoAddress || '1BitcoinEaterAddressDontSendf59kuE';

    template += "var explorers = require('bitcore-explorers');\n";
    template += "var client = new explorers.Insight();\n";
    template += "client.getUnspentUtxos('" + address + "', function(err, utxos) {\n";
    template += "    UTXOs = utxos;\n";
    template += "    console.log('UTXOs:', utxos);\n";
    template += "});";

    $scope.exampleCode = template;
  }

  $scope.jumpConsole = function() {
    $('#terminaltab').click();
    window.REPL.console.SetPromptText($scope.exampleCode);
    window.REPL.scrollToBottom();
  };

  setExampleCode();

});
