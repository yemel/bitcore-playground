'use strict';

angular.module('playApp.units', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/units', {
    templateUrl: 'units/units.html',
    controller: 'UnitsCtrl'
  });
}])

.controller('UnitsCtrl', function($scope, $http, bitcore) {
  $scope.unit = {};
  $scope.currencies = [];
  $scope.currency = null;
  $scope.exampleCode = "";

  function setExampleCode(value, code, fiat) {
    var template, templates = {
      BTC: 'var unit = new bitcore.Unit.fromBTC(@value);',
      mBTC: 'var unit = new bitcore.Unit.fromMilis(@value);',
      bits: 'var unit = new bitcore.Unit.fromBits(@value);',
      satoshis: 'var unit = new bitcore.Unit.fromSatoshis(@value);',
    }

    if (templates[code]) {
      template = templates[code].replace('@value', value);
    } else {
      template = 'var unit = new bitcore.Unit.fromFiat(@value, @rate);'
      template = template.replace('@value', value);
      template = template.replace('@rate', code);
    }

    var rate = $scope.currency ? $scope.currency.rate : 0;
    template += "\nconsole.log('Units', unit.BTC, unit.mBTC, unit.bits, unit.satoshis, unit.atRate(" + rate + "));";
    $scope.exampleCode = template;
  };

  $scope.jumpConsole = function() {
    $('#terminaltab').click();
    window.REPL.console.SetPromptText($scope.exampleCode);
    window.REPL.scrollToBottom();
  };

  $scope.serialize = function() {
    return JSON.stringify({
      network: bitcore.Networks.defaultNetwork.name,
      satoshis: $scope.unit.satoshis,
      currency: $scope.currency && $scope.currency.code
    });
  };

  $scope.updateUnit = function(value, code) {
    var unit = new bitcore.Unit(value, code);

    if (value === '' || isNaN(unit.satoshis)) {
      return; // TODO: mark as invalid
    }

    $scope.unit.BTC = unit.BTC;
    $scope.unit.mBTC = unit.mBTC;
    $scope.unit.bits = unit.bits;
    $scope.unit.satoshis = unit.satoshis;

    if (angular.isString(code)) {
      $scope.unit[code] = value;
      $scope.unit.fiat = $scope.currency ? unit.atRate($scope.currency.rate) : 0;
    }

    setExampleCode(value, code, angular.isString(code));
  };

  $scope.updateFiat = function(value, rate) {
    $scope.updateUnit(value, rate.rate);
  };

  $scope.updateUnit(1, 'BTC');

  $http.get('https://bitpay.com/api/rates').
    success(function(rates) {
      $scope.currencies = rates.filter(function(rate) {
        return rate.code === 'USD' ||
               rate.code === 'EUR' ||
               rate.code === 'ARS' ||
               rate.code === 'GBP' ||
               rate.code === 'JPY' ||
               rate.code === 'CAD' ||
               rate.code === 'BRL' ||
               rate.code === 'CLP';

      });
      $scope.currency = rates[0];
      $scope.updateUnit(1, 'BTC');
    }).
    error(function() {
      console.log('Error while fetching exchange rates');
    });
});
