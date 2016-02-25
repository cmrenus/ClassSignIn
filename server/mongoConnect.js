var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var bb = require("bluebird");

var url = 'mongodb://localhost:27017/ClassSignIn';

var exports = module.exports;

bb.promisifyAll(MongoClient, {suffix:"A"});
// bb.promisifyAll(mongo.Collection.prototype, {suffix:"A"});
// bb.promisifyAll(mongo.Cursor.prototype, {suffix:"A"});
// bb.promisifyAll(mongo.Db.prototype, {suffix:"A"});

function dbConnected(db) {
    console.log("Database connected");
    module.exports.db = db;
};

// Wraps the MongoClient.connect to auto insert the global database connection
// to module.exports as "db"
exports.connect = function() {
    return MongoClient.connectA(url).then(dbConnected);
};