const db = require('../db')


exports.homepage = (req, res) => {
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
                if(result){
                    result.forEach((data) => {
                        data.timeStart = data.timeStart.toLocaleString()
                        data.timeEnd = data.timeEnd.toLocaleString()
                    })
                }
                return res.json(result)
            })
        })
    })
    //db.query("SELECT Request ID from Member WHERE uid = '" + req.body.username + "'", (err, result)
}

exports.reserveDetail = (req, res) => {
    // console.log('1234')
    // console.log(req.params.id)
    const requestID = req.params.id
    const username = req.session.username
    db.query("SELECT uid, Name from UserDetail WHERE Username = '" + username + "'", (err, result) => {
        const { Name, uid } = result[0]
        db.query("SELECT * from Member WHERE uid = '" + uid + "' AND RequestID = '" + requestID + "'", (err, result) => {
            if (result == ''){
                return res.send('error')
            }
            db.query("SELECT * FROM Request WHERE RequestID = '" + requestID + "'", (err, result) => {
                let Member = []
                let datajson = result[0]
                datajson.timeStart = datajson.timeStart.toLocaleString()
                datajson.timeEnd = datajson.timeEnd.toLocaleString()
                db.query("SELECT * FROM Member WHERE RequestID = '" + requestID + "'", (err, result) => {
                    datajson.member = result
                    datajson.name = Name
                    res.json(datajson)
                })
            })
        })
    })
}

exports.group = (req, res) => {
    db.query("SELECT groups.GroupName, groups.GroupID, count(*) count FROM `useringroup`, `groups` where useringroup.GroupID = groups.GroupID group by groups.GroupName", (err, result) => {
        res.json(result)
    })
}

exports.groupCreate = (req, res) => {
    db.query("SELECT UserName, Name, UserDetail.uid FROM `UserDetail`", (err, result) => {
        const nonmember = result
        db.query("SELECT GroupName,UserDetail.uid,Groups.GroupID,UserDetail.UserName,UserDetail.Name FROM Groups,UserInGroup, UserDetail WHERE Groups.GroupID=UserInGroup.GroupID AND UserDetail.uid=UserInGroup.uid ORDER BY Groups.GroupID", (err, result) => {
            let group =[]
            let index = 0
            result.forEach((data) => {
                if(group.length == 0){
                    group.push({ GroupName:data.GroupName, member:[]})
                    group[index].member.push({ uid:data.uid, UserName: data.UserName, Name: data.Name})
                }
                else{
                    if(group[index].GroupName == data.GroupName){
                        group[index].member.push({ uid:data.uid, UserName: data.UserName, Name: data.Name})
                    }
                    else{
                        group.push({ GroupName:data.GroupName, member:[]})
                        index +=1
                        group[index].member.push({ uid:data.uid, UserName: data.UserName, Name: data.Name})
                    }
                }
            })
            return res.json({ nonmember:nonmember, group:group })
        })
    })
    
}

exports.groupDetail = (req, res) => {
    const groupid = req.params.id
    // db.query("SELECT GroupName FROM groups WHERE GroupID = '" + groupid + "'", (err, result) => {
    //     let datajson = {}
    //     datajson.groupName = result[0]
    //     db.query("SELECT uid FROM UserInGroup WHERE GroupID = '" + groupid + "'", (err, result) => {
    //         datajson.member = result
    //         res.json(datajson)
    //     })
    // })
    let data = []
    db.query("SELECT UserName, Name, UserDetail.uid FROM `UserDetail`,`UserInGroup` WHERE UserInGroup.GroupID = '" + groupid + "' AND UserDetail.uid=UserInGroup.uid", (err, result) => {
        const member = result
        db.query("SELECT UserName, Name, UserDetail.uid FROM `UserDetail` WHERE UserDetail.uid NOT IN (SELECT uid FROM UserInGroup WHERE GroupID='" + groupid + "')", (err, result) => {
            const nonmember = result
            db.query("SELECT GroupName,UserDetail.uid,Groups.GroupID,UserDetail.UserName,UserDetail.Name FROM Groups,UserInGroup, UserDetail WHERE Groups.GroupID=UserInGroup.GroupID AND UserDetail.uid=UserInGroup.uid AND Groups.GroupID!= '" + groupid + "' ORDER BY Groups.GroupID", (err, result) => {
                let group =[]
                let index = 0
                result.forEach((data) => {
                    if(group.length == 0){
                        group.push({ GroupName:data.GroupName, member:[]})
                        group[index].member.push({ uid:data.uid, UserName: data.UserName, Name: data.Name})
                    }
                    else{
                        if(group[index].GroupName == data.GroupName){
                            group[index].member.push({ uid:data.uid, UserName: data.UserName, Name: data.Name})
                        }
                        else{
                            group.push({ GroupName:data.GroupName, member:[]})
                            index +=1
                            group[index].member.push({ uid:data.uid, UserName: data.UserName, Name: data.Name})
                        }
                    }
                })
                return res.json({ member:member, nonmember:nonmember, group:group })
            })
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

exports.responseReservePage = (req,res) => {
    db.query("SELECT request.RequestID, request.uid, request.TypeReserve, request.Day, request.timeStart, request.timeEnd, request.Described, request.Status, UserDetail.Name, GroupRoom.RoomName FROM request, UserDetail, GroupRoom WHERE request.uid = UserDetail.uid AND request.RequestID = grouproom.RequestID", (err, result) => {
        res.json(result)
    })
}

exports.roomcreate = (req, res) => {
    db.query("SELCT RoomName from Room", (err, result) => {
        return res.json(result)
    })
}

