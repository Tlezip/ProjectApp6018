var net = require("net");
const utf8 = require('utf8');

const db = require('./db')
// console.log(Date.now())
const currentTime = new Date()
// console.log(currentTime.getDate())
// console.log(currentTime.getMonth() +1 )
const currentTImeString = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds()
// console.log(currentTImeString)
db.query("SELECT * from RequestDetail", (err, result) => {
console.log(result)
})
const sendReservation = (roomName) => {
	let reservation = roomName + '\n'
	db.query("SELECT * from RequestDetail WHERE roomname = '" + roomName + "' AND timeStart <= '" + currentTImeString +"'", (err, result) => {
		if (err) throw err
		// let reservation = roomName + '\n'
		console.log(result)
		// console.log(result.length)
		result.forEach(({ uid, timeStart, timeEnd }) => {
			reservation += (uid + "," + timeStart.getTime() + "," + timeEnd.getTime() + "\n")
			// console.log('test',reservation)
			
			// console.log(RoomName, timeStart.getTime())
		})
		console.log('in fn',reservation)
		var server = net.createServer(function(socket) {
			socket.write(reservation)
			socket.on('data', function(data){
				data = data.toString()
				console.log(data)
			});
		});
		
		server.listen(8100, function(){
			console.log('Now listening');
		});
		
	})
	// console.log('down :',reservation)
}
// let list = sendReservation.call()
// let result = callFn.call()
// console.log('call fn : ', sendReservation("ECC810"))
sendReservation("ECC810")
