var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new mongoose.Schema({
    uid         : ObjectId,
    first_name  : String,
    last_name   : String,
    email       : String,
    password    : String,
    date        : String
});

var PostSchema = new mongoose.Schema({
	created_by: ObjectId,
	created_at: {type: Date, default: Date.now},
	roomNum: int,
	bathNum: int,
	dis: int,
	text: String
});


mongoose.model('User', UserSchema);
mongoose.model('Post', PostSchema);

var User = mongoose.model('User');
exports.findByUsername = function(userName, callback){

	User.findOne({ user_name: userName}, function(err, user){

		if(err){
			return callback(err);
		}

		return callback(null, user);
	});
}

exports.findById = function(id, callback){

	User.findById(id, function(err, user){

		if(err){
			return callback(err);
		}

		return callback(null, user);
	});
}
