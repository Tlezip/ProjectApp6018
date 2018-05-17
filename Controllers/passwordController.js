const db = require('../db')
const mailer = require('express-mailer');
var generator = require('generate-password');


exports.changePassword = (req, res) => {
    const { oldpassword, newpassword, repeatpassword } = req.body
    db.query("SELECT Password FROM UserDetail WHERE Username = '" + req.session.username + "'", (err, result) => {
        if(oldpassword == result[0].Password){
            db.query("UPDATE UserDetail SET Password = '" + newpassword + "', token = NULL WHERE Username = '" + req.session.username + "' AND Disabled = 0", (err, result) => {
                return res.json({ responseMessage: 'ChangePassword Complete'})
            })
        }
        else{
            return res.json({ responseMessage: 'Wrong Old Password'})
        }
    })
}

exports.forgotpassword = (req, res) => {
    const { email } = req.body
    var token = generator.generate({
        length: 25,
        numbers: true
    })
    db.query("Update UserDetail SET token = '" + token + "', Password = NULL WHERE Email = '" + email + "'", (err, result) => {
        if(result.affectedRows != 0){
            res.mailer.send('email', {
            to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
            subject: 'Door-Lock Access Controll : ' + req.body.studentid + " registered", // REQUIRED. 
            otherProperty: 'Other Property',
            message: {  // data to view template, you can access as - user.name
                name: 'Arjun PHP',
                message: 'We\'ve reset your Password Please Click Link below',
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
            return res.json({ responseMessage: 'forgot Complete'});
        }
        else {
            return res.json({ responseMessage: 'can\'t forgot '})
        }
    })

    
}