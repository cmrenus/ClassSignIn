var express = require('express'),
	router = express.Router(),
	dateFormat = require('dateformat'),
	q = require('q'),
	mongo = require('mongodb'),
	db = require('../db');

dateFormat.masks.format = 'mm-dd-yyyy';


//synchrounous helper function to create attendance list for specific date
createAttendanceList = function(inClass, classList){
	var deferred = q.defer();
	var index;
	for(x = 0; x < inClass.length; x++){
		index = classList.map(function(e) { return e.rcs; }).indexOf(inClass[x].rcs)
		if(index != -1){
			classList[index].present = true;
		}
		if(x == inClass.length - 1){
			deferred.resolve(classList);
		}
	}
	return deferred.promise;
}

//synchronous helper function to create student attendance list
createStudentAttendance = function(dates, attendance){
	var deferred = q.defer();
	var index;
	for(x = 0; x < dates.length; x++){
		index = attendance.map(function(e) { return e.date; }).indexOf(dates[x]);
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

//middleware to allow only TA and admin to view attendance
router.use('*', function(req, res, next){
	if((req.session == undefined || req.session.cas_user == undefined) && req.session.cas_user != req.cookies.user && (req.cookies.type != 'TA' || req.cookies.type != 'admin')){
		res.status(403).send('Forbidden');
	}
	else{
		next();
	}
});

//retrieve attendance by date
router.get("/byDate", function(req, res){
	var date = dateFormat(req.query.date, 'format');
	var collection = db.get().collection('Attendance');
	collection.aggregate(
		[{$match: {classID: req.query.classID, 'attendance.date': date}}, 
		 {$project: {
		 	attendance: {
		 		$filter: {
		 			input: '$attendance', 
		 			as: 'item', 
		 			cond: {$eq: ['$$item.date', date]}
		 		}
		 	}
		 }
		}]).toArray(function(err, docs){
		if(err) res.status(500).send("Error getting attendance");
		else if(docs[0] == undefined){
			res.status(204).send('No Attendance');
		}
		else{
			var inClass = docs[0].attendance;
			db.get().collection('Classes').find({'_id': new mongo.ObjectId(req.query.classID)}, {"classList": 1, _id: 0}).toArray(function(err, docs){
				if(err) res.status(500).send("Error getting class list");
				else{
					createAttendanceList(inClass, docs[0].classList).then(function(data){
						res.send({classList: data})
					});
				}
			});
		}

	});

});

//retrieve attendance by student
router.get('/byStudent', function(req, res){
	if(req.session == undefined || req.session.cas_user == undefined){
		res.status(403).send('Forbidden');
	}
	else{
		db.get().collection('Attendance').aggregate(
			[
			{$unwind: '$attendance'},
			{$match: {classID: req.query.classID, 'attendance.rcs': req.query.rcs}},
			{$group: {
				_id: '$_id',
				attendance: {$push: '$attendance'},
				count:{$sum: 1}
			}}
		]).toArray(function(err, docs){
		 	if(err) res.status(500).send("Error getting attendance");
		 	else if(docs[0] == undefined){
		 		res.status(204).send('No Attendance');
		 	}
		 	else{
		 		db.get().collection('Attendance').distinct("attendance.date", {classID: req.query.classID}, function(err, results){
		 			if(err) res.status(500).send("Error getting attendance");
		 			else{
		 				createStudentAttendance(results, docs[0].attendance).then(function(data){
			 				res.send({attendance: data, count: docs[0].count});
			 			});
			 		}
		 		});
				
			}
		});
	}
});


router.put('/editAttendance', function(req, res){
	var date = dateFormat(req.body.date, 'format');
	if(req.session == undefined || req.session.cas_user == undefined){
		res.status(403).send('Forbidden');
	}
	else{
		if(req.body.present == undefined || req.body.present == false){
			db.get().collection('Attendance').update({classID: req.body.classID}, {$push: {attendance: {rcs: req.body.rcs, date: date}}}, function(err, results){
				if(err) res.status(503).send("Error editing Attendance");
				else{
					res.send("Students attendance was changed successfully");
				}
			});	
		}
		else{
			db.get().collection('Attendance').update({classID: req.body.classID}, {$pull: {attendance: {date: date, rcs: req.body.rcs}}}, function(err, results){
				if(err) res.status(503).send("Error editing Attendance");
				else{
					res.send("Students attendance was changed successfully");
				}
			});
		}	
	}
});

module.exports = router;