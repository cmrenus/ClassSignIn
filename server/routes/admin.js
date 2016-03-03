var express = require('express'),
	router = express.Router(),
	mongoConnect = require('../mongoConnect.js'),
	db;

mongoConnect.connect().then(function(){
	db = mongoConnect.db;
});

var app = express();


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

router.post("/changeSemester", function(req, res){
	console.log(req.body);
	var collection = db.collection('Current');
	collection.find().toArray(function(err, docs){
		if (err) throw err;
		console.log(docs[0]);
		collection.updateOne({"_id": docs[0]._id}, {$set: {'semester': req.body.semester}},function(err, docs){
			console.log(docs);
		});
	});

});


router.get('/currentSemester', function(req, res){
	var collection = db.collection('Current');
	collection.find().toArray(function(err, docs){
		if (err) throw err;
		res.send(docs[0].semester);
	});
	
});


router.get("/semesters", function(req, res){
	var collection = db.collection('Classes');
	collection.distinct('semester', function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});

router.get("/classList", function(req, res){
	var collection = db.collection('Classes');
	collection.find({'semester': req.query.semester}, {'className': 1}).toArray(function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});















module.exports = router;