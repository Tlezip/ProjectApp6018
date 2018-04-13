const db = require('../db')
const mailer = require('express-mailer');
//for Admin
exports.responseReserve = (req, res) => {
    const { id, status } = req.body
    // console.log(id,status)
    db.query("UPDATE Request SET Status = '" + status + "' WHERE RequestID = '" + id + "'", (err, result) => {
        console.log("Response Reserve Complete")
        db.query("SELECT Request.Username, Email FROM Request,UserDetail WHERE RequestID = '" + id + "' AND Request.Username = UserDetail.Username", (err, result) => {
            // console.log('result :', result[0].Email)
            res.mailer.send('response', {
                to: result[0].Email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'Door-Lock Access Controll : ' + result[0].Username + " Response Reservation", // REQUIRED. 
                otherProperty: 'Other Property',
                message: {  // data to view template, you can access as - user.name
                    name: 'RequestID : ' + id,
                    status: status
                }
                }, function (err) {
                if (err) {
                    // handle error 
                    console.log('dfsdgksdfgk')
                    console.log(err);
                    return;
                }
                console.log('dgfkdfl;ghkdfk')
            });
            if (status == "Approved") {
                db.query("SELECT * FROM Request WHERE RequestID = '" + id + "'", (err, result) => {
                    const { timeStart,timeEnd,TypeReserve } = result[0]
                    console.log(result)
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
                    console.log(TypeReserve)
                    if(TypeReserve == 'Continue'){
                        // console.log('12aaa3')
                        // console.log(timeStartepoch.getTime(), timeStart.getTime())
                        const timeEndFirstDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + (timeStartepoch.getDate()) + " 23:59:59"
                        // console.log('Day : ',timeStartepoch.getDate(), timeStart.getDate())
                        // console.log('timestart :', timeStartepochint, timeEndepochint)
                        // console.log(timeEndFirstDay, timeStartString)
                        if(timeStartepochint+86400000 < timeEndepochint){
                            db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartString + "','" + timeEndFirstDay + "')", (err, result) => {
                                if(err){
                                    console.log(err)
                                }
                                console.log('123')
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
                                console.log(timeStartepochint, timeEndepochint)
                                for( timeStartepochint; timeStartepochint + 86400000 <= timeEndepochint ; timeStartepochint+=86400000){
                                    console.log('inforloop')
                                    timeStartepoch.setTime(timeStartepochint)
                                    const timeStartDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " 00:00:00"
                                    const timeEndDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " 23:59:59"
                                    db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartDay + "','" + timeEndDay + "')", (err, result) => {
                                        if(err){
                                            console.log(err)
                                        }
                                    })
                                }
                                // timeStartepochint-=86400000
                                timeStartepoch.setTime(timeStartepochint)
                                console.log(timeStartepoch.getDate(), timeEndepoch.getDate())
                                if(timeStartepoch.getDate() == timeEndepoch.getDate()){
                                    const timeStartDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " 00:00:00"
                                    db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartDay + "','" + timeEndString + "')", (err, result) => {
                                        return res.json({ responseMessage: 'Reserve Updated'})
                                    })
                                }
                                // return res.json({ responseMessage: 'Reserve Updated'})
                            })
                        }
                        else if(timeStartepoch.getDate() === timeEndepoch.getDate()){
                            db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartString + "','" + timeEndString + "')", (err, result) => {
                                return res.json({ responseMessage: 'Reserve Updated'})
                            })
                        }
                        else if((timeStartepoch.getDate() + 1) === timeEndepoch.getDate() && timeStartepochint+86400000 > timeEndepochint){
                            const timeEndOneDay = timeStartepoch.getFullYear() + "-" + (timeStartepoch.getMonth()+1) + "-" + timeStartepoch.getDate() + " 23:59:59"
                            const timeStartOneDay = timeEndepoch.getFullYear() + "-" + (timeEndepoch.getMonth()+1) + "-" + timeEndepoch.getDate() + " 00:00:00"
                            db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartString + "','" + timeEndOneDay + "')", (err, result) => {
                                db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartOneDay + "','" + timeEndString + "')", (err, result) => {
                                    return res.json({ responseMessage: 'Reserve Updated'})
                                })
                            })
                        }
                    }
                    else if(TypeReserve == 'Period' || TypeReserve == 'Repeat'){
                        const { Day } = result[0]
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
                            if(TypeReserve == 'Period'){
                                console.log(timeStartepochint)
                                db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartStringDay + "','" + timeEndStringDay + "')", (err, result) => {
                                })
                            }
                            else if(TypeReserve == 'Repeat' && (timeStartepoch.getDay() == dayEnum[Day])){
                                db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartStringDay + "','" + timeEndStringDay + "')", (err, result) => {
                                })
                            }
                            if(timeStartepochint === timeEndepochint) {
                                return res.json({ responseMessage: 'Reserve Updated'})
                            }
                        }
                    }
                })
            }
            else if(status == "Rejected"){
                return res.json({ responseMessage: 'Reserve Updated'})
            }
        })
    })
}