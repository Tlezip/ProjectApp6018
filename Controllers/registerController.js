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
          db.query("INSERT INTO UserDetail ( Username, Name, Email, Password, Disabled, Admin, token ) VALUES ('" + req.body.studentid + "','" + req.body.name + " " + req.body.surname + "','" + email + "','" + password + "','0','" + req.body.userRole + "','"+ token +"')", (err, result) => {
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
                    url: 'http://161.246.6.1:8007/#/changepassword/' + token
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
    const { newpassword, repeatPassword, token } = req.body
    // console.log(req.body)
    if(newpassword == repeatPassword){
        return res.json({ responseMessage: 'Wrong repeat password'})
    }

    db.query("SELECT * FROM UserDetail WHERE token = '" + token + "'", (err, result) => {
        const username = result[0].Username
        if(result){
            db.query("UPDATE UserDetail SET Password = '" + newpassword + "', token = NULL WHERE Username = '" + username + "'", (err, result) => {
                if(req.session){
                    req.session.destroy()
                }
                return res.json({ responseMessage: 'changeregis Complete'})
            })
        }
    })
}

exports.changeemail = (req, res) => {
    const { newemail, username } = req.body

    db.query("SELECT * FROM UserDetail WHERE Username = '" + username + "'", (err, result) => {
        const token = result[0].token
        if(token){
            res.mailer.send('email', {
                    to: newemail, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                    subject: 'Door-Lock Access Controll : ' + username + " registered", // REQUIRED. 
                    otherProperty: 'Other Property',
                    message: {  // data to view template, you can access as - user.name
                        name: 'Arjun PHP',
                        message: result[0].password,
                        url: 'http://161.246.6.1:8007/#/changepassword/' + token
                    }
            }, function (err) {
                if (err) {
                    // handle error 
                    console.log(err);
                    return res.json({ responseMessage: 'can\'t register '})
                    return;
                }
            });
        }
        db.query("UPDATE UserDetail SET Email = '" + newemail + "' WHERE Username = '" + username + "'", (err, result) => {
            return res.json({ responseMessage: 'change email Complete'})
        })
    })
}