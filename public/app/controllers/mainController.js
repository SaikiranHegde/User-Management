angular.module('mainController', ['authServices'])

.controller('mainCtrl', function($location, $timeout, Auth){
    var app = this;

        app.doLogin = function () {

            Auth.login(app.loginData).then(function (data) {
                app.errorMsg = false;

                /* console.log(data.data.success);
                 console.log(data.data.message);*/

                if (data.data.success) {
                    app.successMsg = data.data.message;

                    $timeout(function () {
                        $location.path('/'); //For re-directing
                    }, 2000);

                } else {
                    app.errorMsg = data.data.message;
                }
            });
        };
});