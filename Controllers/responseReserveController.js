const db = require('../db')
//for Admin
exports.responseReserve = (req, res) => {
    const { id, status } = req.body
    console.log(id,status)
    db.query("UPDATE Request SET Status = '" + status + "' WHERE RequestID = '" + id + "'", (err, result) => {
        console.log("Response Reserve Complete")
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
                            console.log(timeStartepochint, timeEndepochint)
                            for( timeStartepochint; timeStartepochint + 86400000 < timeEndepochint ; timeStartepochint+=86400000){
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
                        })
                    }
                    else if(timeStartepoch.getDate() === timeEndepoch.getDate()){
                        db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartString + "','" + timeEndString + "')", (err, result) => {
                            return res.json({ responseMessage: 'Reserve Updated'})
                        })
                    }
                    // for( timeStartepoch ; timeStartepoch < timeEndepoch ; timeStartepoch+=86400 ){
                        
                        
                    // }
                }
                // console.log(typeof timeStart)
                // console.log(timeStart, timeEnd)
                // db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "','" + timeStartString + "','" + timeEndString + "')", (err, result) => {
                //     if(err){
                //         console.log(err)
                //     }
                //     console.log("INSERT INTO RequestDetail Complete")
                //     return res.json({ responseMessage: 'Reserve Updated'})
                // })
            })
        }
        else if(status == "Rejected"){
            return res.json({ responseMessage: 'Reserve Updated'})
        }
    })
}