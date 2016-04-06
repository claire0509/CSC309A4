var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	//created_by: { type: Schema.ObjectId, ref: 'User' }, 
	//should be changed to ObjectId, ref "User"
	created_by: {type: String, ref: 'User' },		
	created_at: {type: Date, default: Date.now},
	
	//edited
	location: String,
	tcommute: String,
	nroom: String,
	nbathroom: String,
	price: String,
	description: String,

	

	img: {type: Buffer , default: './img/image.png'},

	//Comments and Likes
});

var userSchema = new mongoose.Schema({
	username: String, //email
	password: String, //hash created from password

	//edited
	fname: String,
	lname: String,
	school: String,	
})

mongoose.model('Post', postSchema);
mongoose.model('User', userSchema)
