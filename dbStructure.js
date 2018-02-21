var db = require('./db');

db.connect(function(err){
    db.on('error', function(err) {
        console.log("[mysql error]",err);
      });
    console.log("Connected");
    const sql = [
        'CREATE TABLE UserDetail (uid VARCHAR(8) PRIMARY KEY,Username VARCHAR(10),Password VARCHAR(10),Department VARCHAR(20),Branch VARCHAR(20),Name VARCHAR(20),Year INT,Sec INT,Disabled BIT)',
        'CREATE TABLE groups (GroupID INT AUTO_INCREMENT PRIMARY KEY, GroupName VARCHAR(10))',
        'CREATE TABLE UserInGroup (GroupID INT NOT NULL,uid VARCHAR(8) NOT NULL,FOREIGN KEY (GroupID) REFERENCES groups(GroupID),FOREIGN KEY (uid) REFERENCES UserDetail(uid), primary key (GroupID, uid))',
        'CREATE TABLE Request (RequestID INT AUTO_INCREMENT PRIMARY KEY,uid VARCHAR(8) NOT NULL,TypeReserve VARCHAR(10),Day VARCHAR(10),timeStart DATETIME,timeEnd DATETIME,Described TEXT,Status VARCHAR(15),FOREIGN KEY (uid) REFERENCES UserDetail(uid))',
        'CREATE TABLE Member (RequestID INT,uid VARCHAR(8),FOREIGN KEY (RequestID) REFERENCES request(RequestID),FOREIGN KEY (uid) REFERENCES UserDetail(uid),PRIMARY KEY (RequestID,uid))',
    ]
    sql.map((query) => {
        db.query(query, function(error, result){
        if (error !== null){
            var nameTable = ""
            for(var i=7 ; error.sqlMessage[i+1]!== ' ' ; i++){
                nameTable = nameTable.concat(error.sqlMessage[i])
            }
            if (error.errno === 1050 || error.code === 'ER_TABLE_EXISTS_ERROR'){
                console.log("Table",nameTable,"Already Exist")
                return
            }
        }
        
        if (error) throw error;
        console.log("Table created")
        })
    })
    // CREATE TABLE Request (RequestID INT AUTO_INCREMENT PRIMARY KEY,uid VARCHAR(8) NOT NULL,TypeReserve VARCHAR(10),Day VARCHAR(10),timeStart DATETIME,timeEnd DATETIME,Described TEXT,Status VARCHAR(15),FOREIGN KEY (uid) REFERENCES UserDetail(uid))
    // ,uid PRIMARY KEY FOREIGN KEY REFERENCES UserDetail(uid)
    // db.query('CREATE TABLE customers (GroupID INT NOT NULL,uid VARCHAR(8) NOT NULL,FOREIGN KEY (GroupID) REFERENCES groups(GroupID),FOREIGN KEY (uid) REFERENCES UserDetail(uid), primary key (GroupID, uid))', function(error, result){
    //     // console.log(error.errno)
    //     // console.log(error.sqlMessage[7],error.sqlMessage[8])
    //     var nameTable = ""
    //     for(var i=7 ; error.sqlMessage[i+1]!== ' ' ; i++){
    //         nameTable = nameTable.concat(error.sqlMessage[i])
    //     }

    //     if (error.errno === 1050 || error.code === 'ER_TABLE_EXISTS_ERROR'){
    //         console.log("Table",nameTable,"Already Exist")
    //         return
    //     }
    //     if (error) throw error;
    //     console.log("Table",nameTable, "created")
    // })
        
        
    // db.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Table created");
    // });
});