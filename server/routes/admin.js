var express = require('express'),
	router = express.Router(),
	multiparty = require('multiparty'),
	Converter = require('csvtojson').Converter,
	converter = new Converter({}),
	mongo = require('mongodb'),
	db = require('../db');

var app = express();

//Add a new class
router.post("/newClass", function(req, res){
	var collection = db.get().collection('Classes');
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files){
		var semester = collection.find({'semester': fields.semester[0], 'className': fields.className[0], 'section' : fields.section[0]}).toArray(function(err, docs){
			if(docs.length > 0){
				res.status(409).send("Class already exists");
			}
			else{
				if(Object.keys(files).length == 0){
					console.log('no files');
					collection.insert({'semester': fields.semester[0], 'className': fields.className[0], 'section': fields.section[0], 'TA': fields.TARCS[0], 'startTime' : fields.startTime[0], 'days': fields.days[0]},
						function(err, result){
							if(err) throw err;
							res.json({'Success': 'Class added without students'});
							res.end();
						}
					);
				}
				else{
					converter.fromFile(files.file[0].path, function(err, results){
						console.log(results);
						if(results == undefined || results[0].rcs == undefined || results[0].firstName == undefined || results[0].lastName == undefined){
							res.status(400).send('CSV file not formatted correctly');
						}
						else{
							collection.insert({'semester': fields.semester[0], 'className': fields.className[0], 'section': fields.section[0], 'TA': fields.TARCS[0], 'startTime' : fields.startTime[0], 'days': fields.days[0], 'classList': results},
								function(err, result){
									if(err) throw err;
									res.json({'Success': 'Class added'});
									res.end();
								}
							);
						}
					});
				}
			}
		});
	});
});

//change the current semester
router.post("/changeSemester", function(req, res){
	var collection = db.get().collection('Current');
	collection.find().toArray(function(err, docs){
		if (err) throw err;
		if(docs[0] == undefined){
			res.status(400).send('An error has occurred');
		}
		else{
			if(docs[0]._id == ''){
				res.status(400).send('You cannot do that');
			}
			else{
				collection.updateOne({"_id": docs[0]._id}, {$set: {'semester': req.body.semester}},function(err, docs){
					res.json({'Success': 'Semester Changed'});
					res.end();
				});
			}
		}
	});

});

router.post("/addStudent", function(req, res){
	var collection = db.get().collection('Classes');
	var student = req.body.student;
	collection.update({'_id': new mongo.ObjectId(req.body.classID)}, {$push: {classList: {rcs: student.rcs, firstName: student.firstName, lastName: student.lastName}}},function(err){
		if(err) res.send(err);
		else res.send("Success");
	});
});

router.post("/editClass", function(req, res){
	var collection = db.get().collection('Classes');
	collection.update({'_id': new mongo.ObjectId(req.body._id)}, {$set: {startTime: req.body.startTime, TA: req.body.TA, days: req.body.days}}, function(err){
		if(err) res.send(err);
		else res.send("Success");
	})
});

//retrieve the current semester
router.get('/currentSemester', function(req, res){
	var collection = db.get().collection('Current');
	collection.find().toArray(function(err, docs){
		if (err) throw err;
		if(docs[0] == undefined){
			res.send('');
		}
		else{
			res.send(docs[0].semester);
		}
		
	});
	
});

//get list of all semesters
router.get("/semesters", function(req, res){
	var collection = db.get().collection('Classes');
	collection.distinct('semester', function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});

//get list of class choices based on semester
router.get("/classList", function(req, res){
	var collection = db.get().collection('Classes');
	collection.find({'semester': req.query.semester}, {'className': 1, 'section': 1}).sort({className: 1, section: 1}).toArray(function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});


router.get('/classInfo', function(req, res){
	var collection = db.get().collection('Classes');
	collection.find({'_id': new mongo.ObjectId(req.query.classID)}).toArray(function(err, docs){
		if(err) throw err;
		console.log(docs[0]);
		res.send(docs[0]);
	});
});


router.delete('/deleteStudent', function(req, res){
	var collection = db.get().collection('Classes');
	collection.update({'_id': new mongo.ObjectId(req.query.classID)}, {$pull: {classList: {rcs: req.query.rcs}}}, function(err){
		if(err) throw err;
		res.send(req.query.rcs + ' Removed');
	});

});

router.post('/addNewClassOption', function(req, res){
	var collection = db.get().collection('ClassOptions');
	collection.insert({name: req.body.name}, function(err, results){
		res.send();
	});
});

router.delete('/deleteClassOption', function(req, res){
	var collection = db.get().collection('ClassOptions');
	collection.remove({name: req.query.name}, function(err, results){
		res.send();
	});
});

router.get('/classOptions', function(req, res){
	var collection = db.get().collection('ClassOptions');
	collection.find().toArray(function(err, docs){
		res.send(docs);
	});
});






module.exports = router;