///<reference path='..\typings\node.d.ts' />
///<reference path='..\typings\express.d.ts' />
///<reference path='..\typings\passport.d.ts' />

import routes = module('./routes/index')
import express = module('express')
import passport = module('passport')
import passportFlickr = module('passport-flickr')

declare var User: any;

var app = express();
var FlickrStrategy=passportFlickr.Strategy;

//app.settings.env = 'production';



// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(express.session({secret: 'drikin fff'}));
  app.use(passport.initialize());
  app.use(passport.session());
});

app.configure('development', function(){
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});



// Flickr Authentication
var FLICKR_CONSUMER_KEY: string = '9be4080c588662045e33efd094a63b0c';
var FLICKR_CONSUMER_SECRET: string = 'add12790d2e3136e';

passport.use(new FlickrStrategy({
  consumerKey: FLICKR_CONSUMER_KEY,
  consumerSecret: FLICKR_CONSUMER_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/flickr/callback"
  },
  function(token, tokenSecret, profile, done) {
    profile.token = token;
    profile.tokenSecret = tokenSecret;
    console.log(token, tokenSecret, profile);
    done(null, profile);
    //User.findOrCreate({ flickrId: profile.id }, function (err, user) {
    //  return done(err, user);
    //});
  }
));

passport.serializeUser(function(user, done){
  //console.log('serializeUser', user);
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  //console.log('deserializeUser', obj);
  done(null, obj);
});

app.get('/auth/flickr',
  passport.authenticate('flickr'),
  function(req, res){
    // The request will be redirected to Flickr for authentication, so this
    // function will not be called.
});

app.get('/auth/flickr/callback',
  passport.authenticate('flickr', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});



// Routes
//app.get('/', ensureAuthenticated, routes.index);
app.get('/', routes.index);



app.listen(3000, function(){
    console.log("Demo Express server listening on port %d in %s mode", 3000, app.settings.env);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

export var App = app;
