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
	console.log(req.body);
	console.log(req.session);
	var classes = db.collection('Classes');
	var attendance = db.collection('Attendance');
	var rcs = req.session.cas_user.toLowerCase();
	var date = dateFormat(req.body.time, 'format');
	console.log(rcs);

	classes.find({_id: new mongo.ObjectId(req.session.class), 'classList.rcs': rcs}, {'classList.rcs': 1}).toArray(function(err, docs){
		if(err) throw err;
		if(docs.length == 0){
			//return err, not in class
			console.log("not in this class");
		}
		else{
			console.log("in this class");
			attendance.aggregate([
				{$match: {classID: req.session.class, 'attendance.rcs': rcs, 'attendance.date': date}},
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
					console.log('already signed in');
				}
				else if(docs[0].attendance.length == 0){
					//not signed in
					console.log("not signed in");
					console.log(req.session.class);
					console.log(rcs);
					console.log(date);
					attendance.update({'classID': req.session.class}, {$push: {attendance: {rcs:rcs, date: date}}}, function(err, docs){
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