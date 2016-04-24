var express = require('express'),
	router = express.Router(),
	mongoConnect = require('../mongoConnect.js'),
	mongo = require('mongodb'),
	dateFormat = require('dateformat'),
	db;

dateFormat.masks.format = 'mm-dd-yyyy';

mongoConnect.connect().then(function(){
	db = mongoConnect.db;
});


router.post('/', function(req,res){
	var classes = db.collection('Classes');
	var attendance = db.collection('Attendance');
	var rcs = req.session.cas_user.toLowerCase();
	var date = dateFormat(req.body.time, 'format');
	console.log(date);
	date = '4-26-2016';
	classes.find({_id: new mongo.ObjectId(req.cookies.class), 'classList.rcs': rcs}, {'classList.rcs': 1}).toArray(function(err, docs){
		if(err) throw err;
		if(docs.length == 0){
			//return err, not in class
			console.log("not in this class");
		}
		else{
			console.log("in this class");
			attendance.aggregate([
				{$match: {classID: req.cookies.class, 'attendance.rcs': rcs}},
				{$project: {
					attendance:{
						$filter: {
							input: '$attendance', 
		 					as: 'item', 
		 					cond: {$and:[{$eq: ['$$item.date', date]}, {$eq: ['$$item.rcs', rcs]}]}
						}
					}
				}}
			]).toArray(function(err,docs){
				if(err) throw err;
				console.log(docs);
				if(docs.length == 0){
					//not signed in
					console.log("not signed in");
					attendance.update({'classID': req.cookies.class}, {$push: {attendance: {rcs:rcs, date: date}}}, function(err, docs){
						if(err) throw err;
						res.send(docs);
					});
					
				}
				else{
					console.log('already signed in');
					//already signed in
				}
			});
		}
	});

});


module.exports = router;