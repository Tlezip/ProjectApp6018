var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

var db = require('./db');

app.use(session({secret: 'ssshhhhh',
                }));
// ฟังค์ชัน สำหรับรับ request จาก client และส่ง response กลับไปยัง client
// req คือ request และ res คือ response
// res.send('') คือการส่ง response กลับไป
var sess;
function getHomePage(req, res) {
    console.log('test');
    // if(req.session.authenticated == undefined){
    //     console.log('in here');
    //     res.redirect('/login');
    // }
    response = '<h1>This is homepage.</h1>' + req.session.username +'<br/>'+'<div><form action="/logout" method="get"><button type=submit>logout</button></form></div>'
    res.send(response);
}

var auth = function(req, res, next){
    if(req.session && req.session.authenticated){
        return next();
    }
    else
        return res.redirect('/login');
}

var no_auth = (req, res, next) => {
    if(!req.session.authenticated){
        return next();
    }
    else
        return res.redirect('/');
}

function getAboutPage(req, res){
    res.send('<h1>This is about page.</h1>');
}

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

function getLoginPage(req, res){
    res.send('<div><form method="post">First name:<br><input type="text" name="username" value="user"><br>Password:<br><input type="password" name="password" value="pass"><br><br><input type="submit" value="Submit"></form></div>')
}
// เมื่อ client เข้าถึงหน้า Home Page ของเว็บไซต์ http://localhost:5555/
// app.get(URL, getHomePage)
// URL - คือ PATH ของเว็บไซต์
// getHomePage คือ callback function ที่มี request และ response
app.get('/', auth, getHomePage);
app.get('/about', getAboutPage);
app.get('/login', no_auth,getLoginPage);
app.get('/logout', (req, res) => {req.session.destroy()
                                return res.redirect('/login')})
app.post('/login', function(req, res, next){
    db.query("SELECT * from userdetail WHERE username = '" + req.body.username + "'", (err, result) => {
        if (err) throw err
        if (result == ''){
            console.log('WRONG Username')
            return res.redirect('/login')
        }
        console.log(result)
        const { Username, Password} = result[0]
        console.log(Username, Password)
        // console.log(result)
        // console.log(result[0].Disabled)
        // console.log(result[0].Disabled == Buffer("0000"))
        if(req.body.username && req.body.username === Username && req.body.password === Password ){
            req.session.username = req.body.username;
            req.session.authenticated = true;
            return res.redirect('/');
        }
        else{
            return res.redirect('/login');
        }
    })
});
// start server ด้วย port 5555
var server = app.listen(5555, function() {
    console.log('Express is running on port 5555.');
});