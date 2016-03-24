var express = require('express'),
	router = express.Router(),
	mongoConnect = require('../mongoConnect.js'),
	mongo = require('mongodb'),
	db;

mongoConnect.connect().then(function(){
	db = mongoConnect.db;
});

var app = express();

//Add a new class
router.post("/newClass", function(req, res){
	console.log(req.body);
	var collection = db.collection('Classes');
	var semester = collection.find({'semester': req.body.semester, 'className': req.body.className}).toArray(function(err, docs){
		if(docs.length > 0){
			res.error(409).send("Class already exists");
		}
		else{
			collection.insert({'semester': req.body.semester, 'className': req.body.className, 'TA': req.body.TARCS},
				function(err, result){
					if(err) throw err;
					console.log(result);
				}
			);
			res.json({'Success': 'Class added'});
			res.end();
		}
	});
});

//change the current semester
router.post("/changeSemester", function(req, res){
	console.log(req.body);
	var collection = db.collection('Current');
	collection.find().toArray(function(err, docs){
		if (err) throw err;
		console.log(docs[0]);
		collection.updateOne({"_id": docs[0]._id}, {$set: {'semester': req.body.semester}},function(err, docs){
			console.log(docs);
			res.json({'Success': 'Semester Changed'});
			res.end();
		});
	});

});

router.post("/addStudent", function(req, res){
	var collection = db.collection('Classes');
	var student = req.body.student;
	collection.update({'_id': new mongo.ObjectId(req.body.classID)}, {$push: {classList: {rcs: student.RCSID, firstName: student.fName, lastName: student.lName}}},function(err){
		if(err) res.send(err);
		else res.send("Success");
	});
});

//retrieve the current semester
router.get('/currentSemester', function(req, res){
	var collection = db.collection('Current');
	collection.find().toArray(function(err, docs){
		if (err) throw err;
		res.send(docs[0].semester);
	});
	
});

//get list of all semesters
router.get("/semesters", function(req, res){
	var collection = db.collection('Classes');
	collection.distinct('semester', function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});

//get list of class choices based on semester
router.get("/classList", function(req, res){
	var collection = db.collection('Classes');
	collection.find({'semester': req.query.semester}, {'className': 1}).toArray(function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});


router.get('/studentList', function(req, res){
	var collection = db.collection('Classes');
	collection.find({'_id': new mongo.ObjectId(req.query.classID)}, {'classList': 1}).toArray(function(err, docs){
		if(err) throw err;
		res.send(docs[0].classList);
	});
});







module.exports = router;