angular.module('userServices', [])

.factory('User', function($http){
    userFactory = {};
    
    userFactory.create = function(regData){
        return $http.post('/api/users', regData);
    };
    
    userFactory.checkUsername = function(regData){
        return $http.post('/api/checkusername', regData);
    };
    
    userFactory.checkEmail = function(regData){
        return $http.post('/api/checkemail', regData);
    };
    
    userFactory.activateAccount = function(token){
        return $http.put('/api/activate' + token);
    };
    
    userFactory.checkCredentials = function(loginData){
        return $http.post('/api/resend', loginData);
    };
    
    userFactory.resendLink = function(loginData){
        return $http.put('/api/resend', loginData);
    };
    
    userFactory.sendUsername = function(userData){
        return $http.get('/api/sendusername/' + userData);
    };
    
    userFactory.sendPassword = function(resetData){
        return $http.put('/api/resetpassword', resetData);
    }
    
    userFactory.checkUser = function(token){
        return $http.get('/api/resetpassword/' + token);
    }
    
    return userFactory;
});
