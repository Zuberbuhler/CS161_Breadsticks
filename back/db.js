// Handle database creation for question and answers
// Can return random question and answer for each occurence in JSON format
// These functions to be used as endpoints

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


// Load the initial question and answers
// This is the initial question list and is only run once by consuming the endpoint
function load_and_insert_initial() {

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("question_database");
    var myobj = [
        // Add more questions here
      { question: 'What is the full form of A.I?', answer: ["Artificial Intelligence", "None"]},
      { question: 'What is Life', answer:  ["42", "2", "1"]},
    ];
    dbo.collection("questions").insertMany(myobj, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });
}



// Get random question and answer
function get_all_and_randomize() {

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("question_database");

    // get random question and answer
    var randomDoc = dbo.getCollection("questions").aggregate([ {
        $match : {
    // criteria to filter matches
        }
    }, {
        $sample : {
            size : 1
        }
    } ]).result[0];

    var result = JSON.parse(JSON.stringify(randomDoc))
    return result;

  });
}

