const db = require('../db')


exports.homepage = (req, res) => {
    console.log(req.session)
    // console.log('123')
    const currentTime = new Date()
    const username = req.session.username
    db.query("SELECT uid from UserDetail WHERE Username = '" + username + "'", (err, result) => {
        // console.log(result.length)
        // console.log(result)
        const uid = result[0].uid
        db.query("SELECT RequestID FROM Member WHERE uid = '" + uid + "'", (err, result) => {
            // console.log(JSON.stringify(result))
            let requestID = []
            result.map((data) => {
                requestID.push(data.RequestID)
            })
            // console.log(requestID)
            const currentTImeString = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds()
            db.query("SELECT * FROM Request WHERE RequestID IN (" + requestID + ") AND timeEnd >= '" + currentTImeString + "' AND Status <> 'Rejected'" , (err, result) => {
                // console.log(result)
                console.log(result)
                return res.json(result)
            })
        })
    })
    //db.query("SELECT Request ID from Member WHERE uid = '" + req.body.username + "'", (err, result)
}

exports.roomID = (req, res) => {
    // console.log('1234')
    // console.log(req.params.id)
    const requestID = req.params.id
    const username = req.session.username
    db.query("SELECT uid from UserDetail WHERE Username = '" + username + "'", (err, result) => {
        const uid = result[0].uid
        db.query("SELECT * from Member WHERE uid = '" + uid + "' AND RequestID = '" + requestID + "'", (err, result) => {
            if (result == ''){
                return res.send('error')
            }
            db.query("SELECT * FROM Request WHERE RequestID = '" + requestID + "'", (err, result) => {
                let Member = []
                let datajson = result[0]
                db.query("SELECT * FROM Member WHERE RequestID = '" + requestID + "'", (err, result) => {
                    datajson.member = result
                    res.json(datajson)
                })
            })
        })
    })
}

exports.group = (req, res) => {
    db.query("SELECT * FROM groups", (err, result) => {
        res.json(result)
    })
}

exports.groupDetail = (req, res) => {
    const groupid = req.params.id
    db.query("SELECT GroupName FROM groups WHERE GroupID = '" + groupid + "'", (err, result) => {
        let datajson = {}
        datajson.groupName = result[0]
        db.query("SELECT uid FROM UserInGroup WHERE GroupID = '" + groupid + "'", (err, result) => {
            datajson.member = result
            res.json(datajson)
        })
    })
}

exports.history = (req, res) => {
    const { username } = req.session
    db.query("SELECT uid FROM UserDetail WHERE Username = '" + username + "'", (err, result) => {
        const uid = result[0]
        db.query("SELECT * FROM Log WHERE uid = '" + uid + "'", (err, result) => {
            res.json(result)
        })
    })
}

exports.findroom = (req, res) => {
    const { year,month,dateEnd } = req.body
    const timeStartString = year + "-" + month + "-1 00:00:00"
    const timeEndString = year + "-" + month + "-" + dateEnd + " 23:59:59"
    db.query("SELECT * FROM RequestDetail WHERE timeStart >= '" + timeStartString + "' AND timeStart <= '" + timeEndString + "'", (err, result) => {
        res.json(result)
    })
    // const epochTime = (new Date(timeString).getTime()) / 1000

}

exports.reservation = (req, res) => {
    db.query("SELECT RoomName FROM Room", (err, result) => {
        // const { RoomName } = result
        let RoomName = []
        result.forEach((data) => {
            RoomName.push(data.RoomName)
        })
        const currentTime = new Date()
        const currentTImeString = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds()
        db.query("SELECT * FROM RequestDetail WHERE timeEnd >= '" + currentTImeString + "'", (err, result) => {
            res.json({ room: RoomName, reservation: result })
        })
        // db.query("SELECT ")
    })
}