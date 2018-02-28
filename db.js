var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "project",
});

module.exports = connection;