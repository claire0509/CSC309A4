var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    models = require('./model/models.js')
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy;

/* set up port no. */
var port = process.env.PORT || 3000;

/* connect to db */
mongoose.connect(require('./config/db').url, function(err) {
    if (err) {
        console.log("* cannot connect to db server");
        process.exit(1);
    }
});

/* routers (api) */
var index = require('./router/index');
var api = require('./router/api');
var authenticate = require('./router/authenticate')(passport);

var app = express();

/* view setup */
app.set('view',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/* server setup */
//app.use(favicon(_dirname + '/public/favicon.ico'));
//need icon image to be placed in the public file
//create a .ico file and uncomment the above line
app.use(logger('dev'));
app.use(session({
    sercret: 'keyborad cat'
}));
app.use(bodyParser.urlencoded({limit: "20mb", extended: true}));
app.use(bodyParser.json({limit: "20mb"}));
app.use(cookieParser());

/* static files */
app.use(express.static(path.join(__dirname, 'public')));

/* passport */
app.use(passport.initialized());
app.use(passport.session());

var initPassport = requre('./passport-init');
initPassport(passport);

/* register routers */
app.use('/', index);
app.use('/api', api);
app.use('/auth', authenticate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;           
