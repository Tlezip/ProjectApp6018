const db = require('../db')
const mailer = require('express-mailer');
const net = require('net');

    // var client = new net.Socket();
    // client.connect(8100, '127.0.0.1', function() {
    //     console.log('Connected');
    //     client.write('SendReservation,ECC810');
    // });
//for Admin
exports.responseReserve = (req, res) => {
    const { id, status } = req.body
    // console.log(id,status)
    if(status == 'Approved'){
        db.query("SELECT RoomName FROM GroupRoom WHERE RequestID = '" + id + "'", (err, result) => {
            const room = result[0]
            // db.query("SELECT Request.RequestID FROM RequestDetail,Request WHERE RequestDetail.RequestID=Request.RequestID AND Request.RequestID = '" + id + "' AND RequestDetail.RequestID IN (SELECT RequestID FROM GroupRoom WHERE RoomName = '" + room + "')")
        })
    }
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
                    console.log(err);
                    return;
                }
            });
            return res.json({ responseMessage: 'Reserve Updated'})
            
        })
    })
}

const connectServer = (roomname) => {
    var client = new net.Socket();
    client.connect(8100, '127.0.0.1', function() {
        console.log('Connected');
        client.write('SendReservation,' + roomname);

        client.on('data', function(data) {
            data = data.toString()
            if(data.localeCompare("Updated Reservation") == 0){
                db.query("UPDATE Room SET isUpdate = 1 WHERE RoomName = '" + roomname + "'", (err, result) => {
                    return
                })
            }
            console.log('Updated: ' + roomname);
            client.destroy(); // kill client after server's response
        });

        client.on('close', function() {
            console.log('Connection closed');
        });
    });
}