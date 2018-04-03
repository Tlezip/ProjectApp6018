const db = require('../db')

exports.reserve = (req, res) => {
    const { username } = req.session
    const { room } = req.body
    db.query("SELECT uid FROM UserDetail WHERE Username = '" + username + "'", (err, result) => {
        const { uid } = result[0]
        let day
        if( req.body.type != "repeat"){
            day = ""
        }
        else{
            day = req.body.day
        }
        db.query("SELECT RequestID FROM GroupRoom WHERE RoomName = '" + room + "'", (err, result) => {
            const requestID = result
            db.query("SELECT * FROM Request FROM Request WHERE RequestID IN (" + requestID + ") AND (timeStart >= '" + req.body.timeEnd + "' OR timeEnd  <= '" + req.body.timeStart + "')", (err, result) => {
                if(result){
                    console.log('111111')
                    return res.send('error')
                }
            })
        })
        db.query("INSERT INTO Request (uid, TypeReserve, Day, timeStart, timeEnd, Described, Status) VALUES ('" + uid + "','" + req.body.type + "','" + day + "','" + req.body.timeStart + "','" + req.body.timeEnd + "','" + req.body.describe + "','Pending')", (err, result) => {
            if(err){
                console.log(err)
            }
            console.log('result :', result.insertId)
            const id = result.insertId
            db.query("INSERT INTO Member (RequestID, uid) VALUES ('" + id + "','" + uid + "')", (err, result) => {
                if(err){
                    console.log(err)
                }
                console.log('Reserve Complete')
                return res.json({ responseMessage: 'Reserve Complete'});
            })
        })
    })
}

exports.cancelReserve = (req, res) => {
    console.log(req.params.id)
    return res.json({ responseMessage: 'cancel Complete'})
    // const { id } = req.params
    // const { username } = req.session
    // db.query("SELECT uid FROM Request WHERE RequestID = '" + id + "'", (err, result) => {
    //     const uidRequest = result[0].uid
    //     db.query("SELECT uid FROM UserDetail WHERE Username = '" + username +"'", (err, result) => {
    //         if( uidRequest == result[0].uid){
    //             db.query("UPDATE Request SET Status = 'Cancled' WHERE RequestID = '" + id + "'", (err, result) => {
    //                 console.log('Update Complete')
    //                 return res.redirect('/');
    //             })
    //         }
    //         else{
    //             return res.send('error')
    //         }
    //     })
    // })
    
}