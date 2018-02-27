var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var router = require('./route/route.js')
var db = require('./db');
// var testt = require('./Controller/loginController')
app.use(session({
    secret: 'keyboard cat',
    authenticated: false
  }))

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.use('/', router)

// ฟังค์ชัน สำหรับรับ request จาก client และส่ง response กลับไปยัง client
// req คือ request และ res คือ response
// res.send('') คือการส่ง response กลับไป

// เมื่อ client เข้าถึงหน้า Home Page ของเว็บไซต์ http://localhost:5555/
// app.get(URL, getHomePage)
// URL - คือ PATH ของเว็บไซต์
// start server ด้วย port 5555
var server = app.listen(5555, function() {
    console.log('Express is running on port 5555.');
});