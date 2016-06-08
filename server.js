var path = require('path'),
	CASAuthentication = require('./cas-authentication'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	express = require('express'),
    port = process.env.PORT || 8005,
    app = express(),
    db = require('./server/db'),
    //dbURI = 'mongodb://localhost:27017/ClassSignIn',
    dbURI = 'mongodb://' + process.env.csiDBUser + ':' + process.env.csiDBPassword + '@ds011374.mlab.com:11374/classsignin',
    MongoDBStore = require('connect-mongodb-session')(session),
    mongo = require('mongodb');
    store = new MongoDBStore({
        uri: dbURI,
        collection: 'mySessions'
    });


// Catch errors 
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

//routes
var routes = require('./server/routes/index');
var admin = require('./server/routes/admin');
var TA = require('./server/routes/TA');
var student = require('./server/routes/student');

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//static file usage
app.use('/', express.static(path.join(__dirname, '/')));
/*
//header options
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost:8005");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "format, Origin, X-Requested-With, Content-Type, Accept");
    next();
});
*/

// Set up an Express session, which is required for CASAuthentication.
app.use(session({
    secret: 'super secret key',
    store: store,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true
}));


// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url: 'https://cas-auth.rpi.edu/cas',
    service_url: process.env.herokuurl || 'http://localhost:' + port,
    cas_version: '2.0'
});

//sign in route handler
app.get('/signIn', cas.bounce, function (req, res, next) {
    if (!req.session || !req.session.cas_user) {
        res.redirect('/#/');
    }
    res.cookie('user', req.session.cas_user);
    if(req.session.cas_user == "PLOTKR"){
        res.cookie('type', 'admin');
        res.redirect('/#/admin');
    }
    else{
        db.get().collection('Classes').find({_id: new mongo.ObjectID(req.cookies.class), TA: req.session.cas_user.toLowerCase()}).toArray(function(err, docs){
            if(docs.length > 0){
                res.cookie('type', 'TA');
                res.redirect('/#/TA');
            }
            else{
                res.cookie('type', 'student');
                res.redirect('/#/signIn');
                next();
            }
        })
    }
});

//routes
app.use('/', routes);
app.use('/admin', admin);
app.use('/attendance', TA);
app.use('/signIn', student);
app.get('/logout', cas.logout);


//connect to db and if successful, start server
db.connect(dbURI, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(port, function() {
      console.log('Server running on port ' + port + '.')
    })
  }
});