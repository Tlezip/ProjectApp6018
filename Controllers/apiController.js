const db = require('../db')


exports.homepage = (req, res) => {
    // console.log('123')
    // var net = require('net');

    // var client = new net.Socket();
    // client.connect(8100, '127.0.0.1', function() {
    //     console.log('Connected');
    //     client.write('SendReservation,ECC810');
    // });
    const currentTime = new Date()
    const username = req.session.username
    // db.query("SELECT uid from UserDetail WHERE Username = '" + username + "'", (err, result) => {
        // console.log(result.length)
        // console.log(result)
    // const uid = result[0].uid
    db.query("SELECT RequestID FROM Member WHERE Username = '" + req.session.username + "'", (err, result) => {
        // console.log(JSON.stringify(result))
        let requestID = []
        result.map((data) => {
            requestID.push(data.RequestID)
        })
        // console.log(requestID)
        const currentTimeString = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds()
        db.query("SELECT * FROM Request,GroupRoom WHERE Request.RequestID IN (" + requestID + ") AND Request.RequestID=GroupRoom.RequestID AND timeEnd >= '" + currentTimeString + "'" , (err, result) => {
            // console.log(result)
            if(result){
                result.forEach((data) => {
                    data.timeStart = data.timeStart.toLocaleString()
                    data.timeEnd = data.timeEnd.toLocaleString()
                    data.roomname = data.RoomName
                })
            }
            return res.json(result)
        })
    })
    // })
    //db.query("SELECT Request ID from Member WHERE uid = '" + req.body.username + "'", (err, result)
}

exports.reserveDetail = (req, res) => {
    // console.log('1234')
    // console.log(req.params.id)
    const requestID = req.params.id
    const username = req.session.username
    db.query("SELECT uid, Name from UserDetail WHERE Username = '" + username + "'", (err, result) => {
        const { Name, uid } = result[0]
        db.query("SELECT * from Member WHERE Username = '" + username + "' AND RequestID = '" + requestID + "'", (err, result) => {
            if (result == '' && req.session.isAdmin != true){
                return res.send('error')
            }
            db.query("SELECT * FROM Request, UserDetail, GroupRoom WHERE Request.RequestID=GroupRoom.RequestID AND UserDetail.Username=Request.Username AND Request.RequestID = '" + requestID + "'", (err, result) => {
                // console.log(result)
                let Member = []
                let name = result[0].Name
                let username = result[0].Username
                let datajson = result[0]
                datajson.timeStart = datajson.timeStart.toLocaleString()
                datajson.timeEnd = datajson.timeEnd.toLocaleString()
                db.query("SELECT RequestID, Username FROM Member WHERE RequestID = '" + requestID + "'", (err, result) => {
                    datajson.member = []
                    if(result.length > 0){
                        result.forEach((data) => {
                            datajson.member.push({ requestid: data.RequestID, username: data.Username})
                        })
                    } 
                    datajson.name = name
                    datajson.username = username
                    if(username == datajson.Username){
                        datajson.isReserver = true
                    }
                    else{
                        datajson.isReserver = false
                    }
                    db.query("SELECT filename from fileupload WHERE RequestID = '" + requestID + "'", (err, result) => {
                        if(err){
                            console.log(err)
                        }
                        let filename = []
                        result.forEach((name) => {
                            filename.push(name.filename)
                        })
                        if(result.length > 0){
                            datajson.file = filename
                            return res.json(datajson)
                        } else {
                            datajson.file = ''
                            return res.json(datajson)
                        }
                    })
                })
            })
        })
    })
}

exports.group = (req, res) => {
    db.query("SELECT groups.GroupName, groups.GroupID, count(*) count FROM `UserInGroup`, `groups` where UserInGroup.GroupID = groups.GroupID group by groups.GroupName", (err, result) => {
        if(err){
            console.log(err)
        }
        res.json(result)
    })
}

exports.groupCreate = (req, res) => {
    // console.log('15156156')
    db.query("SELECT Username, Name, UserDetail.uid FROM `UserDetail`", (err, result) => {
        if(err){
            console.log(err)
        }
        let nonmember = []
        result.forEach((data) => {
            nonmember.push({ username: data.Username, name: data.Name, uid: data.uid })
        })
        db.query("SELECT GroupName,UserDetail.uid,groups.GroupID,UserDetail.UserName,UserDetail.Name FROM groups,UserInGroup, UserDetail WHERE groups.GroupID=UserInGroup.GroupID AND UserDetail.Username=UserInGroup.Username ORDER BY groups.GroupID", (err, result) => {
            if(err){
                console.log(err)
            }
            let group =[]
            let index = 0
            if(result){
                result.forEach((data) => {
                    if(group.length == 0){
                        group.push({ groupname:data.GroupName, member:[]})
                        group[index].member.push({ uid:data.uid, username: data.UserName, name: data.Name})
                    }
                    else{
                        if(group[index].groupname == data.GroupName){
                            group[index].member.push({ uid:data.uid, username: data.UserName, name: data.Name})
                        }
                        else{
                            group.push({ groupname:data.GroupName, member:[]})
                            index +=1
                            group[index].member.push({ uid:data.uid, username: data.UserName, name: data.Name})
                        }
                    }
                })
                // console.log(group)
                // console.log(group[0].member)
                return res.json({ nonmember:nonmember, group:group })
            }
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
    db.query("SELECT UserDetail.Username username, Name name, UserDetail.uid FROM `UserDetail`,`UserInGroup` WHERE UserInGroup.GroupID = '" + groupid + "' AND UserDetail.Username=UserInGroup.Username", (err, result) => {
        if(err){
            console.log(err)
        }
        let member = result
        db.query("SELECT UserDetail.Username username, Name name, UserDetail.uid FROM `UserDetail` WHERE UserDetail.Username NOT IN (SELECT Username FROM UserInGroup WHERE GroupID='" + groupid + "')", (err, result) => {
            if(err){
                console.log(err)
            }
            const nonmember = result
            db.query("SELECT GroupName,UserDetail.uid,groups.GroupID,UserDetail.UserName,UserDetail.Name FROM groups,UserInGroup, UserDetail WHERE groups.GroupID=UserInGroup.GroupID AND UserDetail.Username=UserInGroup.Username AND groups.GroupID!= '" + groupid + "' ORDER BY groups.GroupID", (err, result) => {
                if(err){
                    console.log(err)
                }
                let group =[]
                let index = 0
                result.forEach((data) => {
                    if(group.length == 0){
                        group.push({ groupname:data.GroupName, member:[]})
                        group[index].member.push({ uid:data.uid, username: data.Username, name: data.Name})
                    }
                    else{
                        if(group[index].groupname == data.GroupName){
                            group[index].member.push({ uid:data.uid, username: data.Username, name: data.Name})
                        }
                        else{
                            group.push({ groupname:data.GroupName, member:[]})
                            index +=1
                            group[index].member.push({ uid:data.uid, username: data.Username, name: data.Name})
                        }
                    }
                })
                return res.json({ member:member, nonmember:nonmember, group:group })
            })
        })
    })

}

// exports.history = (req, res) => {
//     const { username } = req.session
//     db.query("SELECT uid FROM UserDetail WHERE Username = '" + username + "'", (err, result) => {
//         const uid = result[0]
//         db.query("SELECT * FROM Log WHERE uid = '" + uid + "'", (err, result) => {
//             res.json(result)
//         })
//     })
// }

exports.findroom = (req, res) => {
    // const { year,month,dateEnd } = req.body
    // const timeStartString = year + "-" + month + "-1 00:00:00"
    // const timeEndString = year + "-" + month + "-" + dateEnd + " 23:59:59"
    // db.query("SELECT * FROM RequestDetail WHERE timeStart >= '" + timeStartString + "' AND timeStart <= '" + timeEndString + "'", (err, result) => {
        // res.json(result)
    // })
    // const epochTime = (new Date(timeString).getTime()) / 1000
    db.query("SELECT RequestDetail.RequestID, GroupRoom.RoomName, RequestDetail.timeStart, RequestDetail.timeEnd FROM RequestDetail, GroupRoom, Request WHERE GroupRoom.RequestID=RequestDetail.RequestID AND RequestDetail.RequestID=Request.RequestID AND Request.Status='Approved'", (err, result) => {
        datajson = []
        result.forEach((data) => {
            datajson.push({ requestid: data.RequestID, roomname: data.RoomName, timestart: data.timeStart.toLocaleString(), timeend: data.timeEnd.toLocaleString() })
        })
        return res.json(datajson)
    })
}

exports.reservation = (req, res) => {
    db.query("SELECT RoomName FROM Room", (err, result) => {
        // const { RoomName } = result
        let RoomName = []
        if(result.length > 0){
            result.forEach((data) => {
                RoomName.push(data.RoomName)
            })
        }
        const currentTime = new Date()
        const currentTImeString = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds()
        db.query("SELECT RequestDetail.RequestID,RequestDetail.timeStart, RequestDetail.timeEnd, GroupRoom.RoomName FROM RequestDetail, Request, GroupRoom WHERE RequestDetail.timeEnd >= '" + currentTImeString + "' AND RequestDetail.RequestID=Request.RequestID AND Request.Status='Approved' AND GroupRoom.RequestID=RequestDetail.RequestID", (err, result) => {
            res.json({ room: RoomName, reservation: result, username: req.session.username })
        })
        // db.query("SELECT ")
    })
}

exports.responseReservePage = (req,res) => {
    db.query("SELECT Request.RequestID, Request.Username, Request.TypeReserve, Request.Day, Request.timeStart, Request.timeEnd, Request.Described, Request.Status, UserDetail.Name, GroupRoom.RoomName FROM Request, UserDetail, GroupRoom WHERE Request.Username = UserDetail.Username AND Request.RequestID = GroupRoom.RequestID", (err, result) => {
	if(err){
	  console.log(err)
	}
        datajson = []
        if(result){
            result.forEach((data) => {
                datajson.push({ requestid: data.RequestID, username: data.Username, typereserve: data.TypeReserve, day: data.Day, timestart: data.timeStart.toLocaleString(), timend: data.timeEnd.toLocaleString(), described: data.Described, status: data.Status, name: data.Name, roomname: data.RoomName})
            })
            res.json(datajson)
        }
    })
}

exports.roomcreate = (req, res) => {
    db.query("SELECT RoomName FROM Room", (err, result) => {
        if(err){
            console.log(err)
        }
        let room = []
        result.forEach((data) => {
            room.push({ roomname: data.RoomName})
        })
        return res.json(room)
    })
}

exports.profileDetail = (req, res) => {
    db.query("SELECT * FROM UserDetail WHERE Username = '" + req.session.username + "' AND Disabled = 0", (err, result) => {
        const { uid, Username:username, Department, Branch, Name, Email, Sec } = result[0]
        res.json({ uid:uid, username:username, department:Department, branch:Branch, name:Name, email:Email, sec:Sec })
    })
}

exports.userinfo = (req, res) => {
    db.query("SELECT Username, Email, uid FROM UserDetail", (err, result) => {
        res.json(result)
    })
}

exports.matchuid = (req, res) => {
    const { id, uid } = req.body
    db.query("UPDATE UserDetail SET uid = '" + uid + "' WHERE Username = '" + id + "'", (err , result) => {
        return res.json({ responseMessage: 'uid Complete'})
    })
}