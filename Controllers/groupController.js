const db = require('../db')

exports.editgroup = (req, res) => {
    const { add, remove } = req.body
    const groupid = req.params.id
    add.forEach((data) => {
        db.query("INSERT INTO UserInGroup (GroupID, uid) VALUES ('" + groupid + "','" + data.Username + "')", (err, result) => {
        })
    })
    remove.forEach((data) => {
        db.query("DELETE FROM UserInGroup WHERE GroupID ='" + groupid + "' AND Username = '" + data.Username + "'", (err, result) => {
            if(err){
                console.log(err)
            }
        })
    })
    return res.json({ responseMessage: 'Update Complete'})
}

exports.create = (req, res) => {
    const { groupname, member } = req.body
    db.query("SELECT * FROM Groups WHERE GroupName = '" + groupname + "'", (err, result) => {
        if(!result.length){
            db.query("INSERT INTO Groups (GroupName) VALUES ('" + groupname + "')", (err, result) => {
                const groupid = result.insertId
                if(err){
                    console.log(err)
                }
                if(member.length > 0){
                    member.forEach((member) => {
                        console.log('infore')
                        db.query("INSERT INTO UserInGroup (GroupID, Username) VALUES ('" + groupid + "','" + member.username + "')", (err, result) => {
                            if(err){
                                console.log(err)
                            }
                        })
                    })
                    return res.json({ responseMessage: 'create Complete'})
                }
            })
        } else{
            return res.json({ responseMessage: 'can\'t create'})
        }
    })
}