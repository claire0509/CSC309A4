var app = angular.module('resApp', ['ngRoute', 'ngResource']).run(function($http, $rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = 'Guest';

	$rootScope.signout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = 'Guest';
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
			templateUrl: 'signin.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'signup.html',
			controller: 'authController'
		});
		//the posting display
		.when('/post', {
			templateUrl: 'post.html',
			controller: 'mainController'
		});

		//the user profile display
		.when('/profile', {
			templateUrl: 'profile.html',
			controller: 'authController'
		});

		//the administration display
		//not so sure about this part!!!!!


});


app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

app.controller('mainController', function($scope, $rootScope, postService){
	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
/*
//used for basic read from json
	postService.getAll().success(function(data){
		$scope.posts = data;
	});
*/
	$scope.post = function() {
		$scope.newPost.created_by = $rootScope.current_user;
		$scope.newPost.created_at = Date.now();
		postService.save($scope.newPost}, function(){
			$scope.posts = postService.query();
			$scope.newPost = {created_by: '', text: '', created_at: ''};
		});
	};
	$scope.delete = function(post)	{
		postService.delete({id: post._id});
		$scope.posts = postService.query();
	};
});
app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.uid;
				$location.path('/');
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
				$rootScope.current_user = data.user.uid;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};
});