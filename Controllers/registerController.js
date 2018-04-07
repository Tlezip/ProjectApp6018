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
          db.query("INSERT INTO UserDetail ( Username, Name, Email, Password, Disabled, Admin ) VALUES ('" + req.body.studentid + "','" + req.body.name + " " + req.body.surname + "','" + email + "','" + password + "','0','0')", (err, result) => {
            if(err){
                console.log(err)
            }
            if(email){
                console.log(password)
                // console.log('123')
                res.mailer.send('email', {
                to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'Test Email', // REQUIRED. 
                otherProperty: 'Other Property',
                message: {  // data to view template, you can access as - user.name
                    name: 'Arjun PHP',
                    message: password
                }
                }, function (err) {
                if (err) {
                    // handle error 
                    console.log('dfsdgksdfgk')
                    console.log(err);
                    return;
                }
                console.log('dgfkdfl;ghkdfk')
                });
                return res.json({ responseMessage: 'register Complete'});
            } else {
                return res.json({ responseMessage: 'can\'t register '})
            }
          })  
        }
    })
}