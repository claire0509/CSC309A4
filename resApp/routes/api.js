var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post');
var User = mongoose.model('User');
//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);

router.route('/posts')
	//creates a new post
	.post(function(req, res){

		var post = new Post();
		post.description = req.body.description;
		post.created_by = req.body.created_by;
		post.location = req.body.location;
		post.tcommute = req.body.tcommute;
		post.nroom = req.body.nroom;
		post.nbathroom = req.body.nbathroom;
		post.price = req.body.price;
		post.save(function(err, post) {
			if (err){
				return res.send(500, err);
			}
			return res.json(post);
		});
	})
	//gets all posts
	.get(function(req, res){
		console.log('debug1');
		Post.find(function(err, posts){
			console.log('debug2');
			if(err){
				return res.send(500, err);
			}
			return res.send(200,posts);
		});
	});

//post-specific commands. likely won't be used
router.route('/posts/:id')
	//gets specified post
	.get(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);
			res.json(post);
		});
	}) 
	//updates specified post
	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);

			post.created_by = req.body.created_by;
			post.description = req.body.description;
			post.location = req.body.location;
			post.tcommute = req.body.tcommute;
			post.nroom = req.body.nroom;
			post.nbathroom = req.body.nbathroom;
			post.price = req.body.price;

			post.save(function(err, post){
				if(err)
					res.send(err);

				res.json(post);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		Post.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
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
			user.password = createHash(req.body.password);			user.save(function(err, user){
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

module.exports = router;