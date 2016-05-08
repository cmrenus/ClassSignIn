var express = require('express'),
	router = express.Router(),
	dateFormat = require('dateformat'),
	q = require('q'),
	mongo = require('mongodb'),
	db = require('../db');

dateFormat.masks.format = 'mm-dd-yyyy';

var app = express();

createAttendanceList = function(inClass, classList){
	var deferred = q.defer(),
	index;
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

router.use('*', function(req, res, next){
	console.log(req.session, req.cookies);
	if((req.session == undefined || req.session.cas_user == undefined) && req.session.cas_user != req.cookies.user && (req.cookies.type != 'TA' || req.cookies.type != 'admin')){
		res.status(403).send('Forbidden');
	}
	else{
		next();
	}
});

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
		if(err) throw err;
		if(docs[0] == undefined){
			res.status(204).send('No Attendance');
		}
		else{
			var inClass = docs[0].attendance;
			db.get().collection('Classes').find({'_id': new mongo.ObjectId(req.query.classID)}, {"classList": 1, _id: 0}).toArray(function(err, docs){
				if(err) throw err;
				createAttendanceList(inClass, docs[0].classList).then(function(data){
					res.send({classList: data})
				});
			});
		}

	});

});

router.get('/byStudent', function(req, res){
	db.get().collection('Attendance').aggregate(
		[{$match: {classID: req.query.classID, 'attendance.rcs': req.query.rcs}},
		 {$project: {
		 	_id: 0,
		 	attendance: {
		 		$filter: {
		 			input: '$attendance', 
		 			as: 'item', 
		 			cond: {$eq: ['$$item.rcs', req.query.rcs]}
		 		}
		 	}
		 }},
		 ]).toArray(function(err, docs){
		 	if(err) throw err;
		 	if(docs[0] == undefined){
		 		res.status(204).send('No Attendance');
		 	}
		 	else{
				res.send(docs[0].attendance);
			}
		});
});

module.exports = router;