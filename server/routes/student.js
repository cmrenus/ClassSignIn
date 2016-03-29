var express = require('express'),
	router = express.Router(),
	mongoConnect = require('../mongoConnect.js'),
	db;


mongoConnect.connect().then(function(){
	db = mongoConnect.db;
});

var app = express();


router.post('/', function(req,res){
	console.log(req.body);
});


module.exports = router;