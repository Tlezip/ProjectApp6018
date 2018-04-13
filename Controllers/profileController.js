const db = require('../db')

exports.updateprofile = (req, res) => {
    const { name, department, branch, sec, email } = req.body
    db.query("UPDATE UserDetail SET Name = '" + name + "',Department = '"+ department + "',Branch = '" + branch + "',Sec = '" + sec + "',email = '" + email + "' WHERE Username = '" + req.session.username + "' AND Disabled = '0'", (err, result) => {
        if(err){
            console.log(err)
        }
        return res.json({ responseMessage: 'Update Complete'})
    })
}