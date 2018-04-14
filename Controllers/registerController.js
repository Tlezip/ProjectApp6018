const db = require('../db')
const mailer = require('express-mailer');
var generator = require('generate-password');

exports.register = (req, res) => {
    const email = req.body.email
    db.query("SELECT UserName,Email FROM UserDetail WHERE UserName = '" + req.body.studentid + "' AND Email = '" + req.body.email + "'", (err, result) => {
        if(result.length == 0){
            var password = generator.generate({
                length: 10,
                numbers: true
                });
            var token = generator.generate({
                length: 25,
                numbers: true
            })
          db.query("INSERT INTO UserDetail ( Username, Name, Email, Password, Disabled, Admin, token ) VALUES ('" + req.body.studentid + "','" + req.body.name + " " + req.body.surname + "','" + email + "','" + password + "','0','0','"+ token +"')", (err, result) => {
            if(err){
                console.log(err)
            }
            if(email){
                console.log(password)
                // console.log('123')
                res.mailer.send('email', {
                to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'Door-Lock Access Controll : ' + req.body.studentid + " registered", // REQUIRED. 
                otherProperty: 'Other Property',
                message: {  // data to view template, you can access as - user.name
                    name: 'Arjun PHP',
                    message: password,
                    url: 'http://localhost:8080/#/changepassword/' + token
                }
                }, function (err) {
                if (err) {
                    // handle error 
                    console.log(err);
                    return res.json({ responseMessage: 'can\'t register '})
                    return;
                }
                });
                return res.json({ responseMessage: 'register Complete'});
            } else {
                return res.json({ responseMessage: 'can\'t register '})
            }
          })  
        }
    })
}

exports.changeafterregis = (req, res) => {
    const { token } = req.params
    console.log(req.body)
    const { newpassword, repeatPassword } = req.body
    // console.log(req.body)
    if(newpassword == repeatPassword){
        return res.json({ responseMessage: 'Wrong repeat password'})
    }

    db.query("SELECT * FROM UserDetail WHERE token = '" + token + "'", (err, result) => {
        if(result){
            db.query("UPDATE UserDetail SET Password = '" + newpassword + "', token = NULL", (err, result) => {
                if(req.session){
                    req.session.destroy()
                }
                return res.json({ responseMessage: 'changeregis Complete'})
            })
        }
    })
}