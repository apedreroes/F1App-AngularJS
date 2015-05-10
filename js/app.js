var f1 = angular.module('F1App', ['ngRoute', 'ngAnimate', 'mm.foundation']);

f1.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when("/", {
				templateUrl : "views/pilotos.html",
				controller: "pilotosCtrl"
			})
		.when("/pilotos", {
				templateUrl : "views/pilotos.html",
				controller: "pilotosCtrl"
			})
		.when("/constructores", {
				templateUrl : "views/constructores.html",
				controller: "constructoresCtrl"
			})
		.when("/carreras", {
				templateUrl : "views/carreras.html",
				controller: "carrerasCtrl"
			})
		.otherwise(
			{
				redirectTo: '/pilotos'
			});
}]);

f1.factory('servicioDatosAPI', function ($http){
	var datosAPI = {};

	datosAPI.getPilotos = function(){
		return $http({
			method: 'JSONP',
			url: 'http://ergast.com/api/f1/current/driverStandings.json?callback=JSON_CALLBACK'
		});
	}

	datosAPI.getPiloto = function(id) {
		return $http({
			method: 'JSONP',
			url: 'http://ergast.com/api/f1/current/drivers/' + id + '/driverStandings.json?callback=JSON_CALLBACK'
		});
	}

	datosAPI.getConstructores = function(){
		return $http({
			method: 'JSONP',
			url: 'http://ergast.com/api/f1/current/constructorStandings.json?callback=JSON_CALLBACK'
		});
	};

	datosAPI.getCarreras = function(){
		return $http({
			method: 'JSONP',
			url: 'http://ergast.com/api/f1/current.json?callback=JSON_CALLBACK'
		});
	};
	return datosAPI;
});

f1.controller('pilotosCtrl', function($scope, $log, $modal, servicioDatosAPI){

	$scope.listadoPilotos = [];
	$scope.pageClass = 'page-pilotos';

	servicioDatosAPI.getPilotos().success(function (response){
		$scope.listadoPilotos = response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
	});

	$scope.open = function(piloto) {
		var modalInstance = $modal.open({
			templateUrl : 'views/piloto.html',
			controller: 'pilotoCtrl',
			resolve: {
				idPiloto: function() {
					console.log("el piloto es " + piloto.Driver.driverId);
					return piloto.Driver.driverId;
				}
			}
		});


		modalInstance.result.then(function(piloto){
			$scope.piloto = piloto;
		}, function() {
			$log.info('Modal dismissed at. ' + new Date());
		});
	};
	

});

f1.controller('pilotoCtrl', function($scope, idPiloto, $modalInstance, servicioDatosAPI){

	$scope.pageClass = 'page-piloto';
	$scope.id = idPiloto;
	$scope.piloto = null;

	servicioDatosAPI.getPiloto($scope.id).success(function (response){
		$scope.piloto = response.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
	});	

	$scope.ok = function() {
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});

f1.controller('constructoresCtrl', function($scope, $log, servicioDatosAPI){

	$scope.listadoConstructores = [];
	$scope.pageClass = 'page-constructores';
	servicioDatosAPI.getConstructores().success(function (response){
		$scope.listadoConstructores = response.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
	});

});

f1.controller('carrerasCtrl', function($scope, $log, servicioDatosAPI){

	$scope.listadoCarreras = [];
	$scope.pageClass = 'page-carreras';

	servicioDatosAPI.getCarreras().success(function (response){
		$scope.listadoCarreras = response.MRData.RaceTable.Races;
	});

});






