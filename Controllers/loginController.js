const db = require('../db')
const path = require("path")

exports.logout = (req, res) => {
    req.session.destroy()
    return res.redirect('/login')
}

exports.getLoginPage = (req, res) => {
    // res.send('<div><form method="post">First name:<br><input type="text" name="username" value="user"><br>Password:<br><input type="password" name="password" value="pass"><br><br><input type="submit" value="Submit"></form></div>')
    res.sendFile(path.join(__dirname+'/../page/loginPage.html'));
}

exports.postLogin = (req, res) => {
    db.query("SELECT * from userdetail WHERE username = '" + req.body.username + "'", (err, result) => {
        if (err) throw err
        if (result == ''){
            console.log('WRONG Username')
            return res.redirect('/login')
        }
        const { Username, Password} = result[0]
        if(req.body.username && req.body.username === Username && req.body.password === Password ){
            req.session.username = req.body.username;
            req.session.authenticated = true;
            return res.redirect('/');
        }
        else{
            return res.redirect('/login');
        }
    })
}