#!/usr/bin/env node

//Libraries
var path = require('path');
var https = require('https');
var http = require('http');
var express = require('express');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'wetlab'});
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');

//Environmental variables
var PORT = parseInt(process.env.PORT) || 8000;
var appFolder = (process.env.APP || path.dirname(__dirname)) + '/dist';
var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '861870727182803';
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || 'd4d8026adb8f40d795c8f379b8661a69';
var HOST = process.env.HTTP_HOST || "http://localhost:" + PORT;

var LOCAL = process.env.LOCAL || false; //Local serving

var RPC_HOST = process.env.RPC_HOST || "platform.bionano.autodesk.com";
var RPC_PORT = parseInt(process.env.RPC_PORT) || 443;

log.info({port:PORT, appFolder:appFolder, 'process.env.APP': process.env.APP, FACEBOOK_APP_ID:FACEBOOK_APP_ID, FACEBOOK_APP_SECRET:FACEBOOK_APP_SECRET});

function rpc(method, params, callback) {
	var requestObj = {"method":method, "params":params || {}, "id":"0", "jsonrpc":"2.0"};
	var headers = {};
	headers["Content-Type"] = "text/plain";
	var options = {
		host: RPC_HOST,
		path: '/rpc',
		port: RPC_PORT,
		method: 'POST',
		headers: headers,
		//Normally node.js needs the cert, which is dumb
		// rejectUnauthorized: false,
		// requestCert: true,
		// agent: false,
	};
	console.log(options);
	var local_callback = function(response) {
		var str = '';
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function(chunk) {
			str += chunk;
		});
		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			try {
				console.log("parsing: " + str);
				var responseData = JSON.parse(str);
				callback(responseData);
			} catch(err) {
				var errorResponse = JSON.parse(JSON.stringify(requestObj));
				errorResponse.error = {message: 'Failed to parse response: ' + str, data:err, code:-32603};
				callback(errorResponse);
			}
		});
	}
	var req;
	if (RPC_PORT == 443) {
		req = https.request(options, local_callback);
	} else {
		req = http.request(options, local_callback);
	}
	req.on('error', function (err) {
		console.error(err);
		var errorResponse = JSON.parse(JSON.stringify(requestObj));
		errorResponse.error = {message: 'Error in request', data:err, code:-32603};
		callback(errorResponse);
	});
	req.write(JSON.stringify(requestObj));
	req.end();
}

/* Create the app */
var app = express();

// app.use(require('express-bunyan-logger')());
app.use(require('express-bunyan-logger').errorLogger());


/* Passport */

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: HOST + "/auth/facebook/callback",
		profileFields: ['id', 'displayName', 'emails']
	},
	function(accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		console.log({
			accessToken:accessToken,
			refreshToken:refreshToken,
			profile:profile,
			done:done
		});
		profile._json['accessToken'] = accessToken;
		console.log('profile._json=' + JSON.stringify(profile._json));
		rpc('authenticate', {type:"facebook", data:profile._json}, function(jsonrpc) {
			console.log('Result from rpc authenticate: ' + JSON.stringify(jsonrpc));
			return done(null, jsonrpc.result);
		});
	}
));


// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.use(logger());
app.use(cookieParser());
app.use(bodyParser());
// Initialize Passport!  Also use passport.session() middleware, to support
app.use(passport.initialize());

if (LOCAL) {
	app.use(express.static('.tmp'));
	app.use(express.static('bower_components'));
	app.use(express.static('app'));
} else {
	//Serve static content
	app.use(express.static(appFolder));
}


app.get('/', function(req, res){
	res.render('index', { user: req.user });
	res.sendfile(appFolder + '/index.html');
});

// app.get('/account', ensureAuthenticated, function(req, res){
//   res.render('account', { user: req.user });
// });

app.get('/login', function(req, res){
	res.render('login');
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
	passport.authenticate('facebook', { scope: ['email'] }),
	function(req, res) {
		// The request will be redirected to Facebook for authentication, so this
		// function will not be called.
	});

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/' }),
	function(req, res) {
		console.log("AUTHENTICATED, req.user=", req.user);
		res.cookie('bionano-platform-token', req.user.token);
	res.redirect('/');
	});

app.get('/logout', function(req, res){
	req.logout();
	res.clearCookie('bionano-platform-token');
	res.redirect('/');
});

app.get('/checks', function(req, res){
	res.send('OK');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login')
// }

var server = app.listen(PORT, '0.0.0.0', function () {
	var host = server.address().address;
	log.info('Listening at http://localhost:%s', PORT);
});

process.on( 'SIGINT', function() {
	log.warn( "\nGracefully shutting down from SIGINT (Ctrl-C)");
	// some other closing procedures go here
	server.close();
	process.exit(0);
})

