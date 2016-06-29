var MongoClient = require('mongodb').MongoClient
 

var url = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' + process.env.MONGO_URL;

var exportCallback
var messageCollection = null

module.exports = function(callback){
	exportCallback = callback

	return {
		getMessageCollection: function(){return messageCollection}
	}
}

MongoClient.connect(url, function(err, db) {
	console.log("connected")

	messageCollection = db.collection('messages')

	exportCallback(messageCollection)


});