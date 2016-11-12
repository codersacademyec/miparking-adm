angular.module('MiParking', ['ionic', 'ngCordova', 'MiParking.services'])
    .run(function($ionicPlatform, $rootScope, AccountService, $ionicModal, $ionicLoading) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
        $rootScope.formatTime = function(time) {
            time = (time + "").split('.');
            return time[0] + ':' + (time[1] ? time[1] : '00');
        };
        $rootScope.formatHora = function(hora) {
            hora = hora.split(':');
            return parseFloat(hora[0] + '.' + hora[1].replace('3', '5'));
        };
        $rootScope.getDateTime = function(time) {
            var date = new Date();
            time = time.split(':');
            date.setHours(time[0]);
            date.setMinutes(time[1]);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        };
        $rootScope.updateHasta = function(s) {
            s.horasH = s.horasD.slice(s.horasD.indexOf(this.horaDesde) + 1, s.horasD.length);
            s.horasH.push(s.hci + ':00');
            if (s.horasD.indexOf(this.horaDesde) >= s.horasD.indexOf(this.horaHasta))
                this.horaHasta = s.horasH[0];
        };
    })

.constant("socialProvider", ["facebook", "google"])
    .constant('$ionicLoadingConfig', {
        template: "<ion-spinner></ion-spinner>",
        hideOnStateChange: false
    })

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.inicio', {
                url: '/inicio',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/inicio.html',
                        controller: 'InicioCtrl'
                    }
                }
            })
            .state('app.carga', {
                url: '/cargaparqueo',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/cargaparqueo.html',
                        controller: 'CargaCtrl'
                    }
                }
            })
            .state('app.scanparqueo', {
                url: '/scanparqueo',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/scanparqueo.html',
                        controller: 'ScanCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/inicio');
    })
    .directive('onEnter', function() {
        return {
            restrict: "A",
            scope: {
                action: "&onEnter"
            },
            link: function(scope, element, attrs) {
                element.on("keydown keypress", function(event) {
                    if (event.which === 13) {
                        scope.$apply(scope.action);
                        event.preventDefault();
                    }
                });
            }
        };
    }).directive('qrcode', function($interpolate) {
        return {
            restrict: 'E',
            link: function($scope, $element, $attrs) {

                var options = {
                    text: '',
                    width: 256,
                    height: 256,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: 'H'
                };

                Object.keys(options).forEach(function(key) {
                    options[key] = $interpolate($attrs[key] || '')($scope) || options[key];
                });

                options.correctLevel = QRCode.CorrectLevel[options.correctLevel];

                new QRCode($element[0], options);
            }
        };
    });