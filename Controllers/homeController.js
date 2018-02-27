const path = require("path")

exports.getHomePage = (req,res) => {
    // response = '<h1>This is homepage.</h1>' + req.session.username +'<br/>'+'<div><form action="/logout" method="get"><button type=submit>logout</button></form></div>'
    // res.send(response)
    res.sendFile(path.join(__dirname+'/../page/homePage.html'))
}