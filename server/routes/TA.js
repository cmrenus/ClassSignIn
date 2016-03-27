var express = require('express'),
	router = express.Router(),
	dateFormat = require('dateformat'),
	mongoConnect = require('../mongoConnect.js'),
	mongo = require('mongodb'),
	db;

dateFormat.masks.format = 'mm-dd-yyyy';

mongoConnect.connect().then(function(){
	db = mongoConnect.db;
});

var app = express();



router.get("/byDate", function(req, res){
	//console.log(req.query);
	var date = dateFormat(req.query.date, 'format');
	//console.log(date);
	var collection = db.collection('Attendance');
	collection.find({'classID': req.query.classID, 'attendance.date': date}, {_id: 0, 'attendance.rcs': 1}).toArray(function(err, docs){
		if(err) throw err;
		if(docs[0] == undefined){
			res.status(404).send('No Attendance');
		}
		else{
			console.log(docs[0].attendance);
			var inClass = docs[0].attendance;
			db.collection('Classes').find({'_id': new mongo.ObjectId(req.query.classID)}, {"classList": 1, _id: 0}).toArray(function(err, docs){
				if(err) throw err;
				res.send({classList: docs[0].classList, inClass: inClass});
			});
		}

	});

});



module.exports = router;