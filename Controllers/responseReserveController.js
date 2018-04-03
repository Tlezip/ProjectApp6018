const db = require('../db')
//for Admin
exports.responseReserve = (req, res) => {
    const { id, status } = req.body
    db.query("UPDATE Request SET Status = '" + status + "' WHERE RequestID = '" + id + "'", (err, result) => {
        console.log("Response Reserve Complete")
        if (status == "Approve") {
            db.query("SELECT * FROM Request WHERE RequestID = '" + id + "'", (err, result) => {
                const { timeStart,timeEnd } = result[0]
                db.query("INSERT INTO RequestDetail (RequestID, timeStart, timeEnd) VALUES ('" + id + "," + timeStart + "," + timeEnd + "')", (err, result) => {
                    console.log("INSERT INTO RequestDetail Complete")
                })
            })
        }
    })
}