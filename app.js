var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
const fileUpload = require('express-fileupload');
var mailer = require('express-mailer');
var router = require('./route/route.js')
var cookieParser = require('cookie-parser')
var cors = require('cors')
// var db = require('./db');
// var testt = require('./Controller/loginController')

app.use(cors({
    origin: true,
    credentials: true
}))

app.use(session({
    secret: 'keyboard cat',
    authenticated: false,
    cookie: { httpOnly: false,
        secure: false},
  }))

  
app.use(cookieParser())

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.use(fileUpload());
app.use(express.static('fileupload'))

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

mailer.extend(app, {
    from: 'no-reply@example.com',
    host: 'smtp.gmail.com', // hostname 
    secureConnection: true, // use SSL 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
      user: 'dlacsystem@gmail.com',
      pass: 'admindlac'
    }
});

app.use('/', router)

app.use(express.static(__dirname + '/public'))

// app.get('/qwerty', function (req, res, next) {
//     app.mailer.send('email', {
//       to: 'title0@hotmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
//       subject: 'Test Email', // REQUIRED. 
//       otherProperty: 'Other Property'
//     }, function (err) {
//       if (err) {
//         // handle error 
//         console.log('dfsdgksdfgk')
//         console.log(err);
//         return;
//       }
//       console.log('l;ghkdfk')
//     });
//     return res.json({});
// });

// ฟังค์ชัน สำหรับรับ request จาก client และส่ง response กลับไปยัง client
// req คือ request และ res คือ response
// res.send('') คือการส่ง response กลับไป

// เมื่อ client เข้าถึงหน้า Home Page ของเว็บไซต์ http://localhost:5555/
// app.get(URL, getHomePage)
// URL - คือ PATH ของเว็บไซต์
// start server ด้วย port 5555
var server = app.listen(8207, function() {
    console.log('Express is running on port 8207.');
});
