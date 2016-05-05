var express = require('express'),
	router = express.Router(),
	dateFormat = require('dateformat'),
	mongo = require('mongodb'),
	db = require('../db'),
	q = require('q');

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
					res.status(400).send("<p class='text-warning'>You are not in the classroom</p><small class='text-info'>Tip!:If you are in the classroom disconnect your wifi and reconnect.</small></br><small class='text-info'>Tip!: You can also use your phone which may be more accurate!</small>");
				}
			}
			else{
				console.log("Not Time for class");
				res.status(400).send("It is not time for class yet");
			}
		}
	});

});

createStudentAttendance = function(dates, attendance){
	var deferred = q.defer(),
	index;
	for(x = 0; x < dates.length; x++){
		index = attendance.map(function(e) { return e.date; }).indexOf(dates[x]);
		console.log(index);
		if(index != -1){
			attendance[index].present = true;
		}
		else{
			attendance.push({date: dates[x], present: false});
		}
		if(x == dates.length - 1){
			deferred.resolve(attendance);
		}
	}
	return deferred.promise;
}

router.get('/checkAttendance', function(req, res){
	console.log('start check');
	console.log(req.cookies.class);
	db.get().collection('Attendance').find({classID: req.cookies.class}).toArray(function(err, docs){
		console.log(docs[0]);;
	});
	db.get().collection('Attendance').aggregate(
		[
		{$unwind: '$attendance'},
		{$match: {classID: req.cookies.class, 'attendance.rcs': req.session.cas_user.toLowerCase()}},
		{$group: {
			_id: '$_id',
			attendance: {$push: '$attendance'}
		}}
		 /*{$project: {
		 	_id: 0,
		 	attendance: {
		 		$filter: {
		 			input: '$attendance', 
		 			as: 'item', 
		 			cond: {$eq: ['$$item.rcs', req.session.cas_user.toLowerCase()]}
		 		}
		 	}
		 }}*/
		 ]).toArray(function(err, docs){
		 	if(err) throw err;
		 	console.log('after aggregate', docs[0]);
		 	if(docs[0] == undefined){
		 		res.status(204).send('No Attendance');
		 	}
		 	else{
		 		db.get().collection('Attendance').distinct("attendance.date", {classID: req.cookies.class}, function(err, results){
		 			console.log(results);
		 			createStudentAttendance(results, docs[0].attendance).then(function(data){
		 				res.send(data);
		 			})
		 			//res.send({attendance: docs[0].attendance, dates: results});
		 		})
				
			}
		});
});


module.exports = router;