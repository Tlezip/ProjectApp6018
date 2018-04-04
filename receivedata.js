var net = require("net")
const utf8 = require('utf8')

const db = require('./db')
// console.log(Date.now())
const currentTime = new Date()
// console.log(currentTime.getDate())
// console.log(currentTime.getMonth() +1 )
const currentTImeString = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds()
// console.log(currentTImeString)
const sendReservation = (roomName, callback) => {
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
		// console.log('in fn',reservation)
		callback(reservation)
		// var server = net.createServer(function(socket) {
		// 	socket.write(reservation)
		// 	socket.on('data', function(data){
		// 		data = data.toString()
		// 		console.log(data)
		// 	});
		// });
		
		// server.listen(8100, function(){
		// 	console.log('Now listening');
		// });
		
	})
	// console.log('down :',reservation)
}

const receiveLog = () => {
	var server = net.createServer(function(socket) {
		socket.write("TEST ECC810")
		socket.on('data', function(data){
			data = data.toString()
			// if( data.localeCompare("Node Received Reservation") == 0){
			// 	server.close()
			// }
			arrayOfData = data.split(/,|\n|\r/)
			const result = arrayOfData.filter(word => word.localeCompare(''))
			const roomName = result[0]
			//console.log('length :', result.length)
			//console.log(roomName)
			for (var i=1 ; i<result.length && i+3 <= result.length ; i+=3){
				if(result[i] == ''){
					console.log(i)
				}
				const epochTime = result[i+1]
				const date = new Date(0)
				date.setUTCSeconds(epochTime)
				const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
				var sql = "INSERT INTO Log (uid, RoomName, Time, Status) VALUES ('" + result[i] + "','" + result[0] + "','" + dateString + "','" + result[i+2] + "')"
				db.query(sql , (err, result) => {
					if (err) throw err
					console.log("inserted into LOG")
				})
			}
			console.log(result)
			socket.write('Server Received Log')
			//console.log(data)
			console.log('******************* IN DB *************')
			db.query("SELECT * FROM Log", (err, result) =>{
				console.log(result)
				console.log('\n********************* END ***************')
			})
		})
	})
	
	server.listen(8100, function(){
		console.log('Now listening')
	})
}

receiveLog()

// sendReservation("ECC810", (val) => {
// 	var server = net.createServer(function(socket) {
// 			socket.write(val)
// 			socket.on('data', function(data){
// 				data = data.toString()
// 				if( data.localeCompare("Node Received Reservation") == 0){
// 					server.close()
// 				}
// 				console.log(data)
// 			})
// 		})
		
// 		server.listen(8100, function(){
// 			console.log('Now listening')
// 		})
// })

