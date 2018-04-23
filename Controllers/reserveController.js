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
    // const { timeStart, timeEnd } = req.body
    let reservequery = []
    let reservedetailquery = []
                
    // db.query("SELECT * FROM Request WHERE RequestID = '" + id + "'", (err, result) => {
    // const { timeStart,timeEnd,TypeReserve } = result[0]
    // const { timeStart, timeEnd } = req.body
    const timeStart = new Date(req.body.timeStart)
    const timeEnd = new Date(req.body.timeEnd)
    const TypeReserve = req.body.type
    // console.log(result)
    const timeStartString = timeStart.toLocaleString()
    const timeEndString = timeEnd.toLocaleString()
    let timeStartepoch = new Date(timeStart.getTime())
    // timeStartepoch.setTime()
    let timeStartepochint = timeStartepoch.getTime()
    let timeEndepoch = new Date(timeEnd.getTime())
    // timeEndepoch.setTime()
    let timeEndepochint = timeEndepoch.getTime()
    // const timeEndString = timeEndepoch.toLocaleString()
    // const timeStartString = timeStartepoch.toLocaleString()
    // console.log(TypeReserve)
    if(TypeReserve == 'Continue'){
        // console.log('12aaa3')
        // console.log(timeStartepoch.getTime(), timeStart.getTime())
        const timeEndFirstDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + (timeStartepoch.getDate()) + " 23:59:59"
        // console.log('Day : ',timeStartepoch.getDate(), timeStart.getDate())
        // console.log('timestart :', timeStartepochint, timeEndepochint)
        // console.log(timeEndFirstDay, timeStartString)
        if(timeStartepochint+86400000 < timeEndepochint){
            reservedetailquery.push({ timeStartString: timeStartString, timeEndString: timeEndFirstDay })
            // db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartString + "','" + timeEndFirstDay + "')", (err, result) => {
                timeStartepochint += 86400000
                timeStartepoch.setTime(timeStartepochint)
                timeStartepoch.setHours(0)
                timeStartepoch.setMinutes(0)
                timeStartepoch.setSeconds(0)
                timeStartepochint = timeStartepoch.getTime()
                timeEndepoch.setHours(0)
                timeEndepoch.setMinutes(0)
                timeEndepoch.setSeconds(0)
                timeEndepochint = timeEndepoch.getTime()
                // console.log(timeStartepochint, timeEndepochint)
                for( timeStartepochint; timeStartepochint + 86400000 <= timeEndepochint ; timeStartepochint+=86400000){
                    // console.log('inforloop')
                    timeStartepoch.setTime(timeStartepochint)
                    const timeStartDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " 00:00:00"
                    const timeEndDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " 23:59:59"
                    // db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartDay + "','" + timeEndDay + "')", (err, result) => {
                    // })
                    reservedetailquery.push({ timeStartString: timeStartDay, timeEndString: timeEndDay })
                }
                // timeStartepochint-=86400000
                timeStartepoch.setTime(timeStartepochint)
                // console.log(timeStartepoch.getDate(), timeEndepoch.getDate())
                if(timeStartepoch.getDate() == timeEndepoch.getDate()){
                    const timeStartDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " 00:00:00"
                    // db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartDay + "','" + timeEndString + "')", (err, result) => {
                        // db.query("SELECT RoomName FROM GroupRoom WHERE RequestID = '" + id + "'", (err, result) => {
                        //     if(err){
                        //         console.log(err)
                        //     }
                        //     connectServer(result[0].RoomName)
                        // })
                        // return res.json({ responseMessage: 'Reserve Complete'})
                    // })
                    reservedetailquery.push({ timeStartString: timeStartDay, timeEndString: timeEndString })
                }
                // return res.json({ responseMessage: 'Reserve Updated'})
            // })
        }
        else if(timeStartepoch.getDate() === timeEndepoch.getDate()){
            // db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartString + "','" + timeEndString + "')", (err, result) => {
                // db.query("SELECT RoomName FROM GroupRoom WHERE RequestID = '" + id + "'", (err, result) => {
                //     if(err){
                //         console.log(err)
                //     }
                //     connectServer(result[0].RoomName)
                // })
                // return res.json({ responseMessage: 'Reserve Complete'})
            // })
            reservedetailquery.push({ timeStartString: timeStartString, timeEndString: timeEndString})
        }
        else if((timeStartepoch.getDate() + 1) === timeEndepoch.getDate() && timeStartepochint+86400000 > timeEndepochint){
            const timeEndOneDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " 23:59:59"
            const timeStartOneDay = timeEndepoch.getFullYear() + "-" + (timeEndepoch.getMonth()+1) + "-" + timeEndepoch.getDate() + " 00:00:00"
            reservedetailquery.push({ timeStartString: timeStartString, timeEndString: timeEndOneDay })
            reservedetailquery.push({ timeStartString: timeStartOneDay, timeEndString: timeEndString })
            // db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartString + "','" + timeEndOneDay + "')", (err, result) => {
                // db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartOneDay + "','" + timeEndString + "')", (err, result) => {
                    // db.query("SELECT RoomName FROM GroupRoom WHERE RequestID = '" + id + "'", (err, result) => {
                    //     if(err){
                    //         console.log(err)
                    //     }
                    //     connectServer(result[0].RoomName)
                    // })
                    // return res.json({ responseMessage: 'Reserve Complete'})
                // })
            // })
        }
    }
    else if(TypeReserve == 'Period' || TypeReserve == 'Repeat'){
        const Day = req.body.day
        // console.log(day)
        const HourStart = timeStart.getHours()
        const MinuteStart = timeStart.getMinutes()
        const SecondStart = timeStart.getSeconds()
        const HourEnd = timeEnd.getHours()
        const MinuteEnd = timeEnd.getMinutes()
        const SecondEnd = timeEnd.getSeconds()
        timeStartepoch.setHours(0)
        timeStartepoch.setMinutes(0)
        timeStartepoch.setSeconds(0)
        timeEndepoch.setHours(0)
        timeEndepoch.setMinutes(0)
        timeEndepoch.setSeconds(0)
        timeStartepochint = timeStartepoch.getTime()
        timeEndepochint = timeEndepoch.getTime()
        const dayEnum = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6
        }
        for(timeStartepochint = timeStartepoch.getTime(); timeStartepochint <= timeEndepochint ; timeStartepochint += 86400000){
            // console.log(timeStartepoch.getDay(), dayEnum[day])
            timeStartepoch.setTime(timeStartepochint)
            const timeStartStringDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " " + HourStart + ":" + MinuteStart + ":" + SecondStart
            const timeEndStringDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " " + HourEnd + ":" + MinuteEnd + ":" + SecondEnd
            // console.log(timeStartepoch.getDay(),dayEnum[Day])
            if(TypeReserve == 'Period'){
                // console.log(timeStartepochint)
                // db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartStringDay + "','" + timeEndStringDay + "')", (err, result) => {
                // })
                reservedetailquery.push({ timeStartString: timeStartStringDay, timeEndString: timeEndStringDay })
            }
            else if(TypeReserve == 'Repeat' && (timeStartepoch.getDay() == dayEnum[Day])){
                // db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartStringDay + "','" + timeEndStringDay + "')", (err, result) => {
                //     if(err){
                //         console.log(err)
                //     }
                // })
                reservedetailquery.push({ timeStartString: timeStartStringDay, timeEndString: timeEndStringDay })
            }
            if(timeStartepochint === timeEndepochint) {
                // db.query("SELECT RoomName FROM GroupRoom WHERE RequestID = '" + id + "'", (err, result) => {
                //     if(err){
                //         console.log(err)
                //     }
                //     connectServer(result[0].RoomName)
                // })
                // return res.json({ responseMessage: 'Reserve Complete'})
            }
        }
    }
    // console.log(reservedetailquery)
    let isfound = 0
    reservedetailquery.forEach((reserve,index) => {
        db.query("SELECT * FROM RequestDetail,Request WHERE (NOT (RequestDetail.timeEnd <= '" + reserve.timeStartString + "' OR RequestDetail.timeStart >= '" + reserve.timeEndString + "')) AND RequestDetail.RequestID IN (SELECT RequestID FROM GroupRoom WHERE RoomName = '" + req.body.room + "') AND Request.RequestID=RequestDetail.RequestID AND Request.Status = 'Approved'", (err, result) => {
            // console.log(result.length)
            if(result.length > 0){
                isfound = 1
                // console.log('doghfhlf;hlf;hl;')
                // res.json({ responseMessage: 'Reserve Repeatly'})
            }
            if((index == reservedetailquery.length -1) && isfound == 0){
                db.query("INSERT INTO Request (Username, TypeReserve, Day, timeStart, timeEnd, Described, Status, isUpdate, Subject ) VALUES ('" + username + "','" + req.body.type + "','" + day + "','" + req.body.timeStart + "','" + req.body.timeEnd + "','" + req.body.describe + "','Pending','0','" + req.body.subject + "')", (err, result) => {
                    console.log('result :', result.insertId)
                    const id = result.insertId
                    db.query("INSERT INTO Member (RequestID, Username) VALUES ('" + id + "','" + username + "')", (err, result) => {
                        if(member){
                            member.forEach((data) => {
                                console.log(data)
                                db.query("INSERT INTO Member (RequestID, Username) VALUES ('" + id + "','" + data.username + "')", (err, result) => {
                                })
                            })
                        }
                        console.log('Reserve Complete')
                        db.query("INSERT INTO GroupRoom (RequestID, RoomName) VALUES ('" + id + "','" + req.body.room + "')", (err, result) => {
        
                        })
                    })
                    reservedetailquery.forEach((reserve) => {
                        db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + reserve.timeStartString + "','" + reserve.timeEndString + "')", (err, result) => {
                            if(err){
                                console.log(err)
                            }
                            // objectfile.forEach((fileobj) => {
                            //     const file = req.files[fileobj]
                            //     file.mv('fileupload/' + file.name, (err) => {
                            //         if(err)
                            //             return res.status(500)
                            //         console.log('File uploaded!')
                            //     })
                            // })
                        })
                    })
                    return res.json({ responseMessage: 'Reserve Complete', requestid: id })
                })
            } else if((index == reservedetailquery.length -1) && isfound == 1){
                // console.log('endnddddd')
                return res.json({ responseMessage: 'Reserve Repeatly'})
            }
            
        })
    })
                
                
                // return res.json({ responseMessage: 'Reserve Complete'});
    // })
}

exports.cancelReserve = (req, res) => {
    // console.log(req.params.id)
    db.query("SELECT * FROM UserDetail,Request WHERE UserDetail.Username=Request.Username AND Request.RequestID= '" + req.params.id + "'", (err, result) => {
        if(result){
            // console.log(result[0].Status)
            if(result[0].Status === 'Approved'){
                db.query("DELETE FROM RequestDetail WHERE RequestID = '" + req.params.id + "'", (err, result) => {
                    db.query("UPDATE Request SET Status = 'canceled' WHERE RequestID = '" + req.params.id + "'", (err, result) => {
                        return res.json({ responseMessage: 'cancel Complete'})
                    })
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