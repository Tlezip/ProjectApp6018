const db = require('../db')

exports.editgroup = (req, res) => {
    const { add, remove } = req.body
    const groupid = req.params.id
    add.forEach((data) => {
        db.query("INSERT INTO UserInGroup (GroupID, uid) VALUES ('" + groupid + "','" + data.uid + "')", (err, result) => {
        })
    })
    remove.forEach((data) => {
        db.query("DELETE FROM UserInGroup WHERE GroupID ='" + groupid + "' AND uid = '" + data.uid + "'", (err, result) => {
            if(err){
                console.log(err)
            }
        })
    })
    return res.json({ responseMessage: 'Update Complete'})
}

exports.create = (req, res) => {
    const { groupName, member } = req.body
    db.query("SELECT * FROM Groups WHERE GroupName = '" + groupName + "'", (err, result) => {
        if(!result.length){
            db.query("INSERT INTO Groups (GroupName) VALUES ('" + groupName + "')", (err, result) => {
                const groupid = result.insertId
                if(err){
                    console.log(error)
                }
                if(member.length > 0){
                    member.forEach((member) => {
                        console.log('infore')
                        db.query("INSERT INTO UserInGroup (GroupID, uid) VALUES ('" + groupid + "','" + member.uid + "')", (err, result) => {
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