var path = require('path'),
	CASAuthentication = require('cas-authentication'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	express = require('express'),
    port = 8005,
    app = express();


//routes
var routes = require('./server/routes/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, '/')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
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
    cas_version: '2.0'
});


app.use('/', routes);


app.get('/login', cas.bounce, function (req, res) {
	console.log(res);
  	/*if (!req.session || !req.session.cas_user) {
        res.redirect('/logout');
    }
    res.send( '<html><body>Hello!</body></html>' );*/
    /*var rcs_id = req.session.cas_user.toLowerCase();
    console.log(rcs_id);*/
    /*
    Q.all([
        cms.getWTG(rcs_id),
        cms.getRNE(rcs_id)
    ]).then(function (responses) {
        var wtg_status = JSON.parse(responses[0]).result,
            rne_status = JSON.parse(responses[1]).result;

        if(wtg_status || rne_status) {
            var logger_desc = "Granted admin access by CMS for ";
            if(wtg_status) logger_desc += "WTG ";
            if(wtg_status && rne_status) logger_desc += "and ";
            if(rne_status) logger_desc += "RNE ";
            logger_desc += "membership";

            custom_logger.write(null, req.session.cas_user, 'CMS_ADMIN', logger_desc);
        }

        req.session.admin_rights = wtg_status || rne_status;
        req.session.is_authenticated = true;

        res.redirect('/');
    });*/
});

app.get('/logout', cas.logout);


app.listen(port);
console.log('Server running on port ' + port + '.');