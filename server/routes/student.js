var express = require('express'),
	router = express.Router(),
	dateFormat = require('dateformat'),
	mongo = require('mongodb'),
	db = require('../db');

dateFormat.masks.format = 'mm-dd-yyyy';

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "M";
weekday[2] = "T";
weekday[3] = "W";
weekday[4] = "R";
weekday[5] = "F";
weekday[6] = "Saturday";

function checkLocation(coords){
	if(coords.latitude > 42.730061 && coords.latitude < 42.730118){
		if(coords.longitude > -73.681723 && coords.longitude < -73.682089){
			return true;
		}
		else {
			return false;
		}
	}
	else{
		return false;
	}
}


router.post('/', function(req,res){
	var classes = db.get().collection('Classes');
	var attendance = db.get().collection('Attendance');
	var rcs = req.session.cas_user.toLowerCase();
	var date = dateFormat(req.body.time, 'format');
	classes.find({_id: new mongo.ObjectId(req.cookies.class), 'classList.rcs': rcs}, {'classList.rcs': 1, startTime: 1, days: 1}).toArray(function(err, docs){
		if(err) throw err;
		if(docs.length == 0){
			//return err, not in class
			console.log("not in this class");
			res.status(400).send('You are not in this class');
		}
		else{
			console.log("in this class");
			var currentHours = new Date(docs[0].startTime).getHours()
			var d = new Date();
			if(docs[0].days.indexOf(weekday[d.getDay()]) > -1 && (d.getHours() - currentHours < 2 && d.getHours() - currentHours >= 0)){
				console.log("Correct Time");
				if(checkLocation(req.body.coords)){
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

						if(docs.length == 0){
							//not signed in
							console.log("not signed in");
							attendance.update({'classID': req.cookies.class}, {$push: {attendance: {rcs:rcs, date: date}}}, function(err, docs){
								if(err) throw err;
								res.send(docs);
							});
							
						}
						else{
							res.status(400).send('You have already signed in today');
							console.log('already signed in');
							//already signed in
						}
					});
				}
				else{
					console.log("Not in the classroom");
					res.status(400).send("You are not in the classroom");
				}
			}
			else{
				console.log("Not Time for class");
				res.status(400).send("It is not time for class yet");
			}
		}
	});

});


module.exports = router;