angular.module('MiParking')
.controller('AppCtrl', AppCtrl)
.controller('InicioCtrl', InicioCtrl)
.controller('ScanCtrl', ScanCtrl)
.controller('CargaCtrl', CargaCtrl);

function AppCtrl($ionicModal, AccountService, $state, $scope, $rootScope, $ionicLoading, $ionicPopup, socialProvider, $timeout) {

    $rootScope.loginData = {};
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $rootScope
    }).then(function(modal) {
        $rootScope.modal = modal;
    });
    $rootScope.closeLogin = function() {
        $rootScope.modal.hide();
    };
    $rootScope.showLogin = function() {
        $rootScope.fondoLogin = Math.round(Math.random() * (3) + 1);
        $rootScope.modal.show();
    };
    $rootScope.login = function(u) {
        Stamplay.User.login(u)
        .then(function(res) {
          $rootScope.user = res;
          $rootScope.closeLogin();
        }, function(err) {
          console.log(err);
        });
    };

    $rootScope.logout = function() {
        $ionicLoading.show();
        var jwt = window.location.origin + "-jwt";
        window.localStorage.removeItem(jwt);
        AccountService.currentUser()
        .then(function(user) {
            $rootScope.user = user;
            $rootScope.showLogin();
            $ionicLoading.hide();
        }, function(error) {
            console.error(error);
            $ionicLoading.hide();
            $state.go($state.current, {}, {reload: true});
        });
    };
    AccountService.currentUser()
    .then(function(user) {
        if (user || $rootScope.user) {
            $rootScope.user = user ? user : $rootScope.user;
            Stamplay.Object("usuarios").get({
                owner: $rootScope.user._id
            })
            .then(function(res) {
                $rootScope.user.perfil = res.data[0];
            }, function(err) {
                        // Error
                    });
        } else {
            $rootScope.showLogin();
        }
    });

}
function ScanCtrl($scope, $rootScope, $ionicPlatform, $ionicLoading,$cordovaBarcodeScanner,$cordovaLocalNotification) {
    $scope.scan = function() {
        document.addEventListener("deviceready", function () {
            $cordovaBarcodeScanner
            .scan()
            .then(function(barcodeData) {
                $scope.barcode = barcodeData;
            }, function(error) {
        // An error occurred
    });
        }, false);
    };
    $scope.notification = function() {
        $ionicPlatform.ready( function() {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: 'Scheduled',
                text: 'Test Message 1'
            });    
        }, false);
    };
    $scope.scan();
}
function InicioCtrl($scope, $rootScope, $ionicLoading) {
}

function CargaCtrl($scope, $rootScope, $timeout, $ionicLoading, $cordovaGeolocation) {
    $scope.dias = [{
        nombre: 'Domingo',
        checked: false
    },{
        nombre: 'Lunes',
        checked: false
    }, {
        nombre: 'Martes',
        checked: false
    }, {
        nombre: 'Miercoles',
        checked: false
    }, {
        nombre: 'Jueves',
        checked: false
    }, {
        nombre: 'Viernes',
        checked: false
    }, {
        nombre: 'Sabado',
        checked: false
    }];
    $scope.paises = [];

    Stamplay.Object("paises").get({
        populate: true
    })
    .then(function(res) {
        $scope.paises = res.data;
    }, function(err) {
                // error
            });
    $scope.getLocation = function() {
        var options = {
            timeout: 30000,
            enableHighAccuracy: true
        };
        $ionicLoading.show({
            template: 'Loading...'
        });
        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;
            $ionicLoading.hide();
        }, function(error) {
            console.log(error.message);
        });
    };
    $scope.guardar = function() {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var diasSeleccionados = [];
        for (var i = 0; i < $scope.dias.length; i++) {
            if ($scope.dias[i].checked) {
                $scope.dias[i].checked = false;
                diasSeleccionados.push(i);
            }
        }
        var stamplay = {
            "Direccion": this.Direccion,
            "TelefonoContacto": this.Telefono,
            "email": this.Correo,
            "HoraApertura": this.HorarioA,
            "HoraCierre": this.HorarioC,
            "Nombre": this.Nombre,
            "ValorXHoraP": this.PrecioP,
            "ValorXHoraL": this.PrecioL,
            "ValorXHoraM": this.PrecioM,
            "DiasHabiles": diasSeleccionados,
            "_geolocation": {
                "type": "Point",
                "coordinates": [$scope.lng, $scope.lat]
            }
        };
        this.Direccion = this.HorarioA = this.HorarioC = this.Telefono = this.Correo = this.Nombre = this.PrecioP = this.PrecioL = this.PrecioM = $scope.lat = $scope.lng = '';
        Stamplay.Object('parqueos').save(stamplay).then(function() {
            $ionicLoading.hide();
        });
    };
}