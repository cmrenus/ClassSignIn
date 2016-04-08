var express = require('express'),
	router = express.Router(),
	dateFormat = require('dateformat'),
	mongoConnect = require('../mongoConnect.js'),
	mongo = require('mongodb'),
	q = require('q'),
	db;

dateFormat.masks.format = 'mm-dd-yyyy';

mongoConnect.connect().then(function(){
	db = mongoConnect.db;
});

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


router.get("/byDate", function(req, res){
	//console.log(req.query);
	var date = dateFormat(req.query.date, 'format');
	//console.log(date);
	var collection = db.collection('Attendance');
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
	//collection.find({'classID': req.query.classID, 'attendance.date': date}, {_id: 0,{$filter: {input: '$attendance', as: "item", cond: {$eq: ['$$item.date': date}]}}}).toArray(function(err, docs){
		if(err) throw err;
		if(docs[0] == undefined){
			res.status(204).send('No Attendance');
		}
		else{
			var inClass = docs[0].attendance;
			console.log(inClass);
			db.collection('Classes').find({'_id': new mongo.ObjectId(req.query.classID)}, {"classList": 1, _id: 0}).toArray(function(err, docs){
				if(err) throw err;
				//$scope.inClass.map(function(e){return e.rcs}).indexOf(student.rcs)
				createAttendanceList(inClass, docs[0].classList).then(function(data){
					res.send({classList: data})
				});
				//res.send({classList: docs[0].classList, inClass: inClass});
			});
		}

	});

});

router.get('/byStudent', function(req, res){
	console.log(req.query);
	db.collection('Attendance').aggregate(
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
			console.log(docs[0].attendance);
			res.send(docs[0].attendance);
		});
});


module.exports = router;