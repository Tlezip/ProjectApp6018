const db = require('../db')
const path = require("path")

exports.logout = (req, res) => {
    req.session.destroy()
    return res.json({ auth: false})
}

exports.IsAuth = (req, res) => {
    // console.log(req.session)
    // res.send('<div><form method="post">First name:<br><input type="text" name="username" value="user"><br>Password:<br><input type="password" name="password" value="pass"><br><br><input type="submit" value="Submit"></form></div>')
    if(req.session && req.session.authenticated){
        return res.json({ auth: true, username: req.session.username })
    }
    else{
        return res.json({ auth: false })
    }
}

exports.testlogg = (req, res) => {
    req.session.username = req.body.username;
    req.session.authenticated = true;
    const token = "s%3A" + req.sessionID
    res.cookie('abc', 'def')
    // console.log(req.sessionID)
    // console.log(req.headers)
    return res.status(200).json({ auth: true})
}

exports.postLogin = (req, res) => {
    // console.log(req)
    db.query("SELECT * from userdetail WHERE username = '" + req.body.username + "'", (err, result) => {
        if (err) throw err
        if (result == ''){
            console.log('WRONG Username')
            return res.json({ auth: false, errorMessage: 'WRONG Username'})
        }
        const { Username, Password} = result[0]
        const token = "s%3A" + req.sessionID
        if(req.body.username && req.body.username === Username && req.body.password === Password ){
            req.session.username = req.body.username;
            req.session.authenticated = true;
            return res.status(200).json({ auth: true, username: req.session.username })
        }
        else{
            console.log('WRONG Password')
            return res.json({ auth: false, errorMessage: 'WRONG Password'})
        }
    })
}
