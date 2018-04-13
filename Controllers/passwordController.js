const db = require('../db')

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