    angular.module('mainController', ['authServices', 'userServices'])
    
        //Controller: mainCtrl is used to handle login and main index functions
        .controller('mainCtrl', function ($location, $timeout, Auth, $rootScope, $window, $interval, AuthToken, User) {
            var app = this;

            app.loadme = false; // Hide main HTML until data is obtained in Angular

            // Function to check if the user's token has expired
            app.checkSession = function () {
                if (Auth.isLoggedIn()) {
                    app.checkingSession = true;
                    var interval = $interval(function () {
                        var token = $window.localStorage.getItem('token');
                        if (token === null) {
                            $interval.cancel(interval);
                        } else {
                            // Parse JSON Web Token using AngularJS for timestamp conversion
                            self.parseJwt = function (token) {
                                var base64Url = token.split('.')[1];
                                var base64 = base64Url.replace('-', '+').replace('_', '/');
                                return JSON.parse($window.atob(base64));
                            };
                            var expireTime = self.parseJwt(token);
                            var timeStamp = Math.floor(Date.now() / 1000);
                            var timeCheck = expireTime.exp - timeStamp;
                            //Check if token has less than 30 minutes till expiration
                            if (timeCheck <= 1800) {
                                $interval.cancel(interval);
                                showModal(1);
                            } else {

                            }
                        }
                    }, 2000);
                }
            };

            app.checkSession();

            //Function to show bootstrap modal
            var showModal = function (option) {
                app.choiceMade = false;
                app.modalHeader = undefined;
                app.modalBody = undefined;
                app.hideButton = false;

                //Session expire
                if (option === 1) {
                    app.modalHeader = "Timeout Warning";
                    app.modalBody = "Your session is about to expire, would you like to renew your session??";
                    $("#myModal").modal({
                        backdrop: "static"
                    });
                } else if (option === 2) { //Logout user
                    app.hideButton = true;
                    app.modalHeader = "Logging Out";
                    $("#myModal").modal({
                        backdrop: "static"
                    });
                    $timeout(function () {
                        Auth.logOut();
                        $location.path("/");
                        hideModal();
                        $route.reload();
                    }, 2000);
                }

                $timeout(function () {
                    if (!app.choiceMade) {
                        hideModal();
                    }
                }, 4000);
            };

            //Function that allows user to renew their token
            app.renewSession = function () {
                app.choiceMade = true;
                User.renewSession(app.username).then(function (data) {
                    if (data.data.success) {
                        AuthToken.setToken(data.data.token);
                        app.checkSession();
                    } else {
                        app.modalBody = data.data.message;
                    }
                });
                hideModal();
            };
        
            //Function to expire session and logout
            app.endSession = function () {
                app.choiceMade = true;
                hideModal();
                $timeout(function () {
                    showModal(2);
                }, 1000);
            };

            //Function to hide modal
            var hideModal = function () {
                $("#myModal").modal("hide");
            }

            //Run code every time a route changes
            $rootScope.$on('$routeChangeStart', function () {
                if (!app.checkingSession) app.checkSession();

                if (Auth.isLoggedIn()) {
                    //console.log("Success: User is Logged In");
                    app.isLoggedIn = true;
                    Auth.getUser().then(function (data) {
                        //console.log(data.data.username);
                        app.username = data.data.username;
                        app.useremail = data.data.email;

                        User.getPermission().then(function (data) {
                            app.loadme = true;
                            if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                                app.authorized = true;
                            }
                        });

                    });
                } else {
                    app.isLoggedIn = false;
                    app.username = '';
                    app.loadme = true;
                }
            });

            //Function that performs login
            app.doLogin = function () {

                Auth.login(app.loginData).then(function (data) {
                    app.errorMsg = false;
                    app.expired = false;
                    app.disabled = true;
                    /* console.log(data.data.success);
                     console.log(data.data.message);*/

                    if (data.data.success) {
                        app.successMsg = data.data.message;

                        $timeout(function () {
                            $location.path('/about'); //For re-directing
                            app.loginData = '';
                            app.successMsg = false;
                            app.checkSession();
                        }, 2000);

                    } else {
                        app.errorMsg = data.data.message;
                        if (data.data.expired) {
                            app.expired = true;
                        } else {
                            app.disabled = false;
                        }
                    }
                });
            };
            
            //Function that performs logout
            app.logOut = function () {
                showModal(2);
            };
        });