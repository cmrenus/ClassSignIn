var path = require('path'),
	CASAuthentication = require('cas-authentication'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	express = require('express'),
    port = 8005,
    app = express(),
    mongoConnect = require('./server/mongoConnect'),
    db;


mongoConnect.connect().then(function() {
    //maybe some additional logic if need by when mongo connects
    db = mongoConnect.db;
});


//routes
var routes = require('./server/routes/index');
var admin = require('./server/routes/admin');
var TA = require('./server/routes/TA');
var student = require('./server/routes/student');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, '/')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost:8005");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "format, Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Set up an Express session, which is required for CASAuthentication.
app.use(session({
    secret: 'super secret key',
    resave: false,
    saveUninitialized: true
}));


// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url: 'https://cas-auth.rpi.edu/cas',
    service_url: 'http://localhost:' + port,
    cas_version: '2.0',
    is_dev_mode: true,
    dev_mode_user: 'renusc'
});


//routes
app.use('/', routes);
app.use('/admin', admin);
app.use('/attendance', TA);
app.use('/signIn', student);

//CAS route handlers
app.get('/login', cas.bounce, function (req, res) {
    req.session.class = req.query.class;
  	if (!req.session || !req.session.cas_user) {
        res.redirect('/');
    }
    console.log(req.session);
    if(req.session.cas_user == "PLOTKA"){
    	res.redirect('/#/admin');
    }
    else{
        res.redirect('/#/signIn');
    }
});

app.get('/logout', cas.logout);




app.listen(port);
console.log('Server running on port ' + port + '.');