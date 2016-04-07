var app = angular.module('ResApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';

    
    if(Date.now() - localStorage.token < 259200000 ){
        //force log in if token was set within 3 days
        $rootScope.authenticated = true;
        $rootScope.current_user = localStorage.user;
    }else{
        delete localStorage.token;
        delete localStorage.user;
    }
    

	$rootScope.signout = function(){
    	$http.get('auth/signout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
        delete localStorage.token;
        delete localStorage.user;
	};
});

app.config(function($routeProvider){

	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/signup', {
			templateUrl: 'signup.html',
			controller: 'authController'
		})
		//the signup display
		.when('/profile', {
			templateUrl: 'profile.html',
			controller: 'userController'
		});
});

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

//app.factory('commentService', function($resource){
//	return $resource('/api/posts/:id');
//});

app.controller('mainController', function(postService, $scope, $rootScope){

	$scope.newComment = {};
    $scope.comment = function(){
        console.log($scope.newComment.text);
    };

	$scope.posts = postService.query();

	$scope.newPost = {created_by: '', created_at: '', location: '', tcommute: '', nroom: '', nbathroom: '', price: '', description: '', img: ''};
	$scope.post = function() {
	  $scope.newPost.created_by = $rootScope.current_user;
	  $scope.newPost.created_at = Date.now();
	  postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
	    $scope.newPost = {created_by: '', created_at: '', location: '', tcommute: '', nroom: '', nbathroom: '', price: '', description: '', img: ''};
	  });
	};
    

});



app.factory('profileService', function($resource){
	return $resource('/api/users/:id');
});

app.controller('userController', function(postService, profileService, $scope, $rootScope){
	$scope.theUser = $theUser;
	$scope.users = profileService.query();
	$scope.newUser = {username: '', password: ''};
	$scope.post = function() {
	  $scope.newUser.username = $rootScope.current_user;
	  profileService.save($scope.newUser, function(){
	    $scope.users = profileService.query();
	    $scope.newUser = {username: '', password: ''};
	  });
	};

	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', created_at: '', location: '', tcommute: '', nroom: '', nbathroom: '', price: '', description: '', img: ''};
	$scope.post = function() {
	  $scope.newPost.created_by = $rootScope.current_user;
	  $scope.newPost.created_at = Date.now();
	  postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
	    $scope.newPost = {created_by: '', created_at: '', location: '', tcommute: '', nroom: '', nbathroom: '', price: '', description: '', img: ''};
	  });
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
        localStorage.token = Date.now();
        localStorage.user = data.user.username;

      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});

