myApp.controller("homeCtrl", ["$scope", "adalAuthenticationService", "$http",
    function homeCtrl($scope, adalAuthenticationService, $http) {

        "use strict";

        if (adalAuthenticationService.userInfo.isAuthenticated) {
            $scope.message = "Welcome. You are logged in as " + adalAuthenticationService.userInfo.userName;
        }
        else {
            $scope.message = "Welcome. You are not logged in.";
        }


        $http({
            url: "https://spsboston.sharepoint.com/sites/branding/_api/web/lists/getByTitle('Site%20Assets')/rootFolder/files",
            params: {
                "$select": "name,serverRelativeUrl"
            },
            method: "GET",
            headers: { "accept": "application/json" }
        }).then(
            function (data) {
                var results = data.data.value;
                var filesInfo = [];
                for (var i = 0; i < results.length; i++) {
                    var fileInfo = {
                        name: results[i].Name,
                        serverRelativeUrl: results[i].ServerRelativeUrl
                    }
                    filesInfo[filesInfo.length] = fileInfo;
                }

                $scope.filesInfo = filesInfo;
            },
            function (data) {
                alert(JSON.stringify(data));
            });

        //apply change
        $scope.apply = function (serverRelativeUrl) {
            $http({
                url: "https://spsboston.sharepoint.com/sites/branding/_api/contextinfo",
                method: "POST",
                headers: { "accept": "application/json" }
            }).then(
                       function (data) {
                           var digest = data.data.FormDigestValue;
                           var postData = {};
                           if (typeof (serverRelativeUrl) === "undefined" || serverRelativeUrl === null) {
                               postData = {
                                   "AlternateCssUrl": "",
                                   "SiteLogoUrl": ""
                               }
                           }
                           else {
                               if (serverRelativeUrl.substr(serverRelativeUrl.length - 3) === "css") {
                                   postData.AlternateCssUrl = "https://spsboston.sharepoint.com" + serverRelativeUrl;
                               }
                               if (serverRelativeUrl.substr(serverRelativeUrl.length - 3) === "png") {
                                   postData.SiteLogoUrl = "https://spsboston.sharepoint.com" + serverRelativeUrl;
                               }
                           }

                           $http({
                               url: "https://spsboston.sharepoint.com/sites/branding/_api/web",
                               method: "POST",
                               headers: {
                                   "accept": "application/json",
                                   "contentType": "application/json",
                                   "X-RequestDigest": digest,
                                   "X-HTTP-Method": "MERGE",
                                   "content-length": JSON.stringify(postData).length
                               },
                               data: postData
                           });
                       },
                       function (data) {
                           alert(JSON.stringify(data));
                       });
        };

    }
]);