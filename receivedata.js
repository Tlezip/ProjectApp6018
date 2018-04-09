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
			//if(data.localeCompare("finish") == 0){
			//	console.log('qwewerwrqerqw')
			//	setTimeout(function(){
			//	}, 10000)
			//	socket.end()
			//	server.close()
			//}
			// if( data.localeCompare("Node Received Reservation") == 0){
			// 	server.close()
			// }
			arrayOfData = data.split(/,|\n|\r/)
			const result = arrayOfData.filter(word => word.localeCompare(''))
			const roomName = result[0]
			// if(roomName == 'finish'){
			// 	console.log('eieiieieieieiie')
			// 	socket.end()
			// 	server.close()
			// 	return
			// }
			const a = result.length-1
			console.log(result[a])
			//console.log('length :', result.length)
			//console.log(roomName)
			console.log('roomName :', roomName)
			// if(result[0] == 'finish'){
			// 	console.log('qweeeeeee')
			// 	return
			// }
			for (var i=1 ; i<result.length && i+3 <= result.length ; i+=3){
				if(result[i] == ''){
					console.log(i)
				}
				// if(roomName == 'finish'){
				// 	console.log('break')
				// 	break;
				// }
				console.log('len :',a)
				console.log('last :',result[a])
				const epochTime = result[i+1]
				const date = new Date(0)
				date.setUTCSeconds(epochTime)
				const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
				var sql = "INSERT INTO Log (uid, RoomName, Time, Status) VALUES ('" + result[i] + "','" + result[0] + "','" + dateString + "','" + result[i+2] + "')"
				db.query(sql , (err, result) => {
					if (err) throw err
					console.log("inserted into LOG")
					if(result[a] == "finish" && i == a-3){
						console.log('fdewgdfgsdfdfg')
						socket.end()
						return
					}
				})
			}
			// if(roomName == 'finish'){
			// 	socket.end()
			// 	return
			// }
			// socket.write('Server Received Log')
			//console.log(data)
		})
		socket.on('end', () =>{
			console.log('disconnect from server')
			return
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

