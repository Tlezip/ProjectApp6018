const db = require('../db')

exports.updateprofile = (req, res) => {
    const { name, department, branch, sec, email } = req.body
    db.query("UPDATE userdetail SET Name = '" + name + "',Department = '"+ department + "',Branch = '" + branch + "',Sec = '" + sec + "',email = '" + email + "' WHERE Username = '" + req.session.username + "' AND Disabled = '0'", (err, result) => {
        return res.json({ responseMessage: 'Update Complete'})
    })
}