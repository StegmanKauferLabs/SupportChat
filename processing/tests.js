//var natural = require('natural'),
//  classifier = new natural.BayesClassifier();

var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();
natural.PorterStemmer.attach();

var problems = [
	"My computer won't turn on",
	"My screen is shattered",
	"The screen on my computer is blank"
];

for(var i=0; i<problems.length; i++){
	var keywords = problems[i].tokenizeAndStem();
	console.log("Added keywords", keywords);
	tfidf.addDocument(keywords);
}

var queries = [
	"My computer screen is blank",
	"My harddrive is making a loud noise",
	"I have a broken screen",
	"My charger won't work"
];

for(var i=0; i<queries.length; i++){
	console.log("-----");	
	var stems = queries[i].tokenizeAndStem();
	console.log("Query keywords:", stems);
	tfidf.tfidfs(stems, function(i, measure) {
    		console.log('\tproblem #' + i + ' is ' + measure);
	});
}
