var myApp = angular.module("AltCSS", ["ngRoute", "AdalAngular"]);


myApp.config(["$routeProvider", "$httpProvider", "adalAuthenticationServiceProvider",
    function ($routeProvider, $httpProvider, adalProvider) {

        'use strict';

        //Initialize ADAL
        adalProvider.init({
            tenant: "spsboston.onmicrosoft.com",
            clientId: "a0982e52-1646-47ef-978c-032f8a04c84b",
            cacheLocation: "localStorage",
            endpoints: {
                'https://spsboston.sharepoint.com/_api/': 'https://spsboston.sharepoint.com',
                'https://spsboston.sharepoint.com/sites/branding/_api/': 'https://spsboston.sharepoint.com',
                'https://spsboston-my.sharepoint.com/_api/v1.0/me': 'https://spsboston-my.sharepoint.com'

            }
        }, $httpProvider);

        //Configure routes
        $routeProvider.when("/", {
            controller: 'homeCtrl',
            templateUrl: 'Views/home.html',
            requireADLogin: true
        });
        $routeProvider.otherwise({
            redirectTo: "/"
        });
    }
]);

