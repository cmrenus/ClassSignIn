
var routes = require('./server/routes/index');
var path = require('path');

var express = require('express'),
    port = 8005,
    app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, '/')));


app.use('/', routes);

app.listen(port);
console.log('Server running on port ' + port + '.');