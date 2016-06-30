var MongoClient = require('mongodb').MongoClient
 

var url = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' + process.env.MONGO_URL;

var exportCallback = function(){}
var messageCollection = null

function getMessageCollection(){
	return messageCollection
}

function addMessageToCollection(data, callback){
	//data in the form {userId, message, timeStamp, isSupportBot}
	//callback in the form function(res, err)

	if(messageCollection){
		messageCollection.insert(data, function(e,r){
			callback(e,r)
		})
	}
	else
		callback(null, "Cannot access messageCollection... Has it loaded yet?")
}

var exportFunctions = {
	addMessageToCollection: addMessageToCollection,
	getMessageCollection: getMessageCollection,
}

module.exports = function(cb){
	exportCallback = cb || function(){}

	return exportFunctions
	
}

MongoClient.connect(url, function(err, db) {
	console.log("connected")

	messageCollection = db.collection('messages')

	exportCallback(exportFunctions)


});