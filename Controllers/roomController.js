const db = require('../db')

exports.create = (req, res) => {
    const { roomName } = req.body
    db.query("INSERT INTO Room (RoomName) VALUES ('" + roomName + "')", (err, result) => {
        return res.json({ responseMessage: 'create Complete'})
    })
}