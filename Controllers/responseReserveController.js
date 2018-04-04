const db = require('../db')
//for Admin
exports.responseReserve = (req, res) => {
    const { id, status } = req.body
    console.log(id,status)
    db.query("UPDATE Request SET Status = '" + status + "' WHERE RequestID = '" + id + "'", (err, result) => {
        console.log("Response Reserve Complete")
        if (status == "Approved") {
            db.query("SELECT * FROM Request WHERE RequestID = '" + id + "'", (err, result) => {
                const { timeStart,timeEnd } = result[0]
                db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "," + timeStart + "," + timeEnd + "')", (err, result) => {
                    console.log("INSERT INTO RequestDetail Complete")
                    return res.json({ responseMessage: 'Reserve Updated'})
                })
            })
        }
        else if(status == "Rejected"){
            return res.json({ responseMessage: 'Reserve Updated'})
        }
    })
}