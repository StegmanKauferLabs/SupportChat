var chats = require('./chats').list;

var natural = require('natural'),
    TfIdf = natural.TfIdf,
    seeds = new TfIdf();
natural.PorterStemmer.attach();

for(var i=0; i<chats.length; i++){
	seeds.addDocument(chats[i][0].tokenizeAndStem());
}


var lastThree = ["","",""];
var possibleChats = [];
var count = 0;
var repliesGiven = [];

function analyse(query){

	query = query.text;
	
	if(query.toLowerCase() == "thanks"){
		lastThree = ["","",""];
		possibleChats = [];
		count = 0;
		repliesGiven = [];
		return "No problem";
	}

	keywords = query.tokenizeAndStem();
	lastThree.push(keywords);
	lastThree.shift();
	
	count += 1;
	
	if(count == 1){
		var bestChat = -1;
		var bestScore = 0;
		for(var i=0; i<chats.length; i++){
			var score = seeds.tfidf(keywords, i);
			if(score > 1){
				possibleChats.push(i);
				if(score > bestScore){
					bestScore = score;
					bestChat = i;
				}
			}
		}
		if(bestChat == -1){
			return "Seek a human for help";
		}
		
		lastThree.push(chats[bestChat][1].tokenizeAndStem());
		lastThree.shift();
		
		return chats[bestChat][1];
	}
	
	var bestScore = 0;
	var bestIndex = 0;	
	var bestChat = 0;
	for(var i=0; i<possibleChats.length; i++){
		var result = getScoreAndIndex(chats[possibleChats[i]], possibleChats[i]);
		if(result.score > bestScore){
			bestScore = result.score;
			bestIndex = result.index;
			bestChat = possibleChats[i];
		}
	}
	
	if(bestScore == 0){
		return "Seek a human for help";
	}
	
	var result = chats[bestChat][bestIndex];
	
	if(result === undefined){
		return "Seek a human for help";
	}
	
	repliesGiven.push([bestChat, bestIndex]);
	
	lastThree.push(result.tokenizeAndStem());
	lastThree.shift();
	
	return result;
}

function getScoreAndIndex(chat, chatIndex){
	var bestScore = 0;
	var bestIndex = 0;
	for(var i=0; i<chat.length - 2; i++){
		var nextThree = new TfIdf();
		var score = 0;
		nextThree.addDocument(chat[i].tokenizeAndStem());
		nextThree.addDocument(chat[i+1].tokenizeAndStem());
		nextThree.addDocument(chat[i+2].tokenizeAndStem());
		score += 0.125 * nextThree.tfidf(lastThree[0], 0);
		score += 0.25 * nextThree.tfidf(lastThree[1], 1);
		score += 0.5 * nextThree.tfidf(lastThree[2], 2);
		//console.log("Comparing", chat[i].tokenizeAndStem(), chat[i+1].tokenizeAndStem(), chat[i+2].tokenizeAndStem(), "to", lastThree);
		//console.log("\tScore", );
		if(score > bestScore && repliesGiven.indexOf([chatIndex, i+3]) == -1){
			bestScore = score;
			bestIndex = i+3;
		}
	}
	return {"score": bestScore, "index": bestIndex}
}

module.exports = {
	chat: analyse
}
