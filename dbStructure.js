var db = require('./db');

db.connect(function(err){
    db.on('error', function(err) {
        console.log("[mysql error]",err);
      });
    console.log("Connected");
    var sql = "CREATE TABLE test (name VARCHAR(255),address VARCHAR(255))";
    db.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
});