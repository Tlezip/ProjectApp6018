const db = require('../db')

exports.reserve = (req, res) => {
    const { username } = req.session
    const { room } = req.body
    const { member } = req.body
    // db.query("SELECT uid FROM UserDetail WHERE Username = '" + username + "'", (err, result) => {
        // const { uid } = result[0]
    let day
    if( req.body.type != "Repeat"){
        day = ""
    }
    else{
        day = req.body.day
    }
    console.log(day)
    // db.query("SELECT RequestID FROM GroupRoom WHERE RoomName = '" + room + "'", (err, result) => {
    //     if(err){
    //         console.log(err)
    //     }
    //     const requestID = result
    db.query("SELECT * FROM Request FROM Request WHERE RequestID IN (SELECT RequestID FROM GroupRoom WHERE RoomName = '" + room + "') AND (timeStart >= '" + req.body.timeEnd + "' OR timeEnd  <= '" + req.body.timeStart + "')", (err, result) => {
        if(err){
            console.log(err)
        }
        if(result){
            console.log('111111')
            return res.send('error')
        }
    })
    // })
    db.query("INSERT INTO Request (Username, TypeReserve, Day, timeStart, timeEnd, Described, Status) VALUES ('" + username + "','" + req.body.type + "','" + day + "','" + req.body.timeStart + "','" + req.body.timeEnd + "','" + req.body.describe + "','Pending')", (err, result) => {
        if(err){
            console.log(err)
        }
        console.log('result :', result.insertId)
        const id = result.insertId
        db.query("INSERT INTO Member (RequestID, Username) VALUES ('" + id + "','" + username + "')", (err, result) => {
            if(err){
                console.log(err)
            }
            if(member){
                member.forEach((data) => {
                    console.log(data)
                    db.query("INSERT INTO Member (RequestID, Username) VALUES ('" + id + "','" + data.username + "')", (err, result) => {
                    })
                })
            }
            console.log('Reserve Complete')
            db.query("INSERT INTO GroupRoom (RequestID, RoomName) VALUES ('" + id + "','" + req.body.room + "')", (err, result) => {
                if(err){
                    console.log(err)
                }
                return res.json({ responseMessage: 'Reserve Complete'});
            })
        })
    })
    // })
}

exports.cancelReserve = (req, res) => {
    // console.log(req.params.id)
    db.query("SELECT * FROM UserDetail,Request WHERE UserDetail.Username=Request.Username AND Request.RequestID= '" + req.params.id + "'", (err, result) => {
        if(result){
            console.log(result[0].Status)
            if(result[0].Status === 'Approved'){
                db.query("DELETE FROM RequestDetail WHERE RequestID = '" + req.params.id + "'", (err, result) => {
                    return res.json({ responseMessage: 'cancel Complete'})
                })
            }
            else{
                return res.json({ responseMessage: 'cancel Complete'})
            }
            // db.query("UPDATE Request SET Status = 'cancel' WHERE RequestID = '" + req.params.id + "'", (err, result) => {
            //     return res.json({ responseMessage: 'cancel Complete'})
            // })
        }
    })
    // return res.json({ responseMessage: 'cancel Complete'})
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

const checkrepeatedly = (room, type, timeStart, timeEnd) => {
    let repeatedid = []
    db.query("SELECT * FROM Request WHERE RequestID IN (SELECT RequestID FROM GroupRoom WHERE RoomName = '" + room + "') AND (timeEnd >= '" + timeStart + "' OR timeStart <= '" + timeEnd + "')", (err, result) => {
        if(result){

        }
        else{
            return 1
        }
    })
}