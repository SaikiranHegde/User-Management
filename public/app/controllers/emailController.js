angular.module('emailController', ['userServices'])

    .controller('emailCtrl', function ($routeParams, User, $timeout, $location) {

        app = this;

        User.activateAccount($routeParams.token).then(function (data) {
            app.successMsg = false;
            app.errorMsg = false;

            if (data.data.success) {
                app.successMsg = data.data.message + "..Redirecting!!";
                $timeout(function () {
                    $location.path("/login");
                }, 2000);
            } else {
                app.errorMsg = data.data.message + "..Redirecting!!";
                $timeout(function () {
                    $location.path("/login");
                }, 2000);
            }
        });
    })

    .controller('resendCtrl', function (User) {
        app = this;

        app.checkCredentials = function () {
            app.errorMsg = false;
            app.successMsg = false;
            app.disabled = true;

            User.checkCredentials(app.loginData).then(function (data) {
                if (data.data.success) {
                    User.resendLink(app.loginData).then(function (data) {
                        if (data.data.success) {
                            app.successMsg = data.data.message;
                        }
                    });
                } else {
                    app.disabled = false;
                    app.errorMsg = data.data.message;
                }
            });
        }
    })

    .controller('usernameCtrl', function (User) {
        app = this;

        app.sendUsername = function (userData, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                User.sendUsername(app.userData.email).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                    } else {
                        app.disabled = false;
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.disabled = true;
                app.errorMsg = "Please enter a valid e-mail";
            }
        };
    })

    .controller('passwordCtrl', function (User) {
        app = this;

        app.sendPassword = function (resetData, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                User.sendPassword(app.resetData).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                    } else {
                        app.disabled = false;
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.disabled = true;
                app.errorMsg = "Please enter a valid username";
            }
        };
    });