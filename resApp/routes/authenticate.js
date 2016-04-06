var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');

module.exports = function(passport){

	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user ? req.user : null});
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: "Invalid username or password"});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.route('/users')
	//gets all users
	.get(function(req, res){
		console.log('debug1');
		User.find(function(err, users){
			console.log('debug2');
			if(err){
				return res.send(500, err);
			}
			return res.send(200,users);
		});
	});

	//post-specific commands. likely won't be used
	router.route('/users/:id')
	//gets specified post
	.get(function(req, res){
		User.findById(req.params.id, function(err, user){
			if(err)
				res.send(err);
			res.json(user);
		});
	}) 
	//updates specified post
	.put(function(req, res){
		User.findById(req.params.id, function(err, user){
			if(err)
				res.send(err);

			user.username = req.body.username;
			user.password = createHash(req.body.password);
			user.fname = req.body.fname;
			user.lname = req.body.lname;
			user.school = req.body.school;
			user.save(function(err, user){
				if(err)
					res.send(err);

				res.json(user);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		User.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});



	return router;

}