var analyse = require("./analyse.js");
console.log(analyse.chat("Hello"));

var natural = require('natural'),
  classifier = new natural.BayesClassifier();

classifier.addDocument('My computer will not turn on', 'plug it in');

classifier.train();


