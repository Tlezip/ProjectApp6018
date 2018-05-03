// var express = require('express');
// var app = express();

var net = require("net")
const utf8 = require('utf8')

const db = require('./db')
const currentTime = new Date()
const currentTimeString = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds()
// console.log(currentTImeString)
const sendReservation = (roomName, callback) => {
	let reservation = roomName + '\n'
	db.query("SELECT * from RequestDetail,GroupRoom WHERE RequestDetail.RequestID = GroupRoom.RequestID AND GroupRoom.RoomName = '"+ roomName + "'", (err, result) => {
		if (err) throw err
		// let reservation = roomName + '\n'
		// console.log(result)
		// console.log(result.length)
		result.forEach(({ uid, timeStart, timeEnd }) => {
			let keepuid = uid
			if(uid == undefined){
				keepuid = ''
			}
			reservation += ('' + "," + timeStart.getTime() + "," + timeEnd.getTime() + "\n")
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
			const a = result.length-1
			console.log(result[a])
			//console.log('length :', result.length)
			//console.log(roomName)
			console.log('roomName :', roomName)
			// if(result[0] == 'finish'){
			// 	console.log('qweeeeeee')
			// 	return
			// }
			for (var i=2 ; i<result.length && i+3 <= result.length ; i+=3){
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
						// socket.end()
						// return
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

// receiveLog()
let a = ''
var server = net.createServer(function(socket) {
 
	socket.on('data', function(data){
		data = data.toString()
		console.log(data)
		arrayOfData = data.split(/,|\n|\r/)
		let result = arrayOfData.filter(word => word.localeCompare(''))
		if( result[0] == 'Register'){
			for(var i=1 ; i<result.length && i+2 <= result.length ; i+=2){
				db.query("UPDATE UserDetail SET uid = '" + result[i+1] + "' WHERE Username = '" + result[i] + "'", (err, result) => {
					if(err){
						console.log(err)
					}
					if(i+2 <= result.length){
						console.log('match uid Complete')
						return
					}
				})
			}
		}
		else if( result [0] == 'LOG'){
			const room = result[1]
			for (var i=2 ; i<result.length && i+3 <= result.length ; i+=3){
				if(result[i] == ''){
					console.log(i)
				}
				// if(roomName == 'finish'){
				// 	console.log('break')
				// 	break;
				// }
				const epochTime = result[i+1]
				const date = new Date(0)
				date.setUTCSeconds(epochTime)
				const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
				var sql = "INSERT INTO Log (uid, RoomName, Time, Status) VALUES ('" + result[i] + "','" + result[1] + "','" + dateString + "','" + result[i+2] + "')"
				db.query(sql , (err, result) => {
					if (err) throw err
					console.log("inserted into LOG")
					// if(result[a] == "finish" && i == a-3){
					// 	console.log('fdewgdfgsdfdfg')
						// socket.end()
						// return
					// }
					if(i+3 <= result.length){
						console.log("insert Log complete")
						return
					}
				})
			}
		}
		else if( result[0] == 'checkreservation' ){ //ReceiveLog
			const room = result[1]
			db.query("SELECT isUpdate FROM Request WHERE Request.isUpdate = 0 AND Request.RequestID IN (SELECT RequestID FROM GroupRoom WHERE GroupRoom.RoomName = '" + room + "')", (err, result) => {
				if(err){
					console.log(err)
				}
				if(result){
					const currentTS = new Date().toLocaleString()
					console.log('current Time : ',currentTS)
					db.query(`SELECT Request.RequestID,UserDetail.uid,UserDetail.Username,RequestDetail.timeStart,RequestDetail.timeEnd,Request.isUpdate 
					FROM GroupRoom, Request, RequestDetail, Member, UserDetail 
					WHERE Request.RequestID=RequestDetail.RequestID AND Request.RequestID=GroupRoom.RequestID AND 
					Request.RequestID IN (SELECT RequestID FROM GroupRoom WHERE RoomName = '${room}') AND Member.RequestID 
					IN (Request.RequestID) AND Request.Status = 'Approved' AND Request.timeEnd > '${currentTS}' 
					AND RequestDetail.timeEnd > '${currentTS}' AND Request.isUpdate = 0 AND Member.UserName = UserDetail.Username`, (err, result) => {
						if(err){
							console.log(err)
						}
						console.log(result)
						if(result.length > 0){
							console.log('havedata')
							socket.write('havedata')
							let reservation = ''
							let requestid = []
							console.log('lentgth :',result.length)
							result.forEach(({ RequestID,uid, Username, timeStart, timeEnd, isUpdate }, index) => {
								// console.log('issss : ', isUpdate)
								let keepuid = uid
								if(!requestid.includes(RequestID)){
									requestid.push(RequestID)
								}
								if(uid == undefined){
									keepuid = ''
								}
								console.log(timeStart.getTime())
								console.log(timeStart)
								console.log(timeStart.toLocaleString())
								reservation += (keepuid + "," + Username + "," + (timeStart.getTime()/1000) + "," + (timeEnd.getTime()/1000) + "\n")
								// console.log(index)
								if(index == result.length-1 ){
									socket.write(reservation)
									socket.on('data', function(data){
										data = data.toString()
										if(data == ("end," + room)){
											console.log('endddd')
											db.query("UPDATE Request SET isUpdate = 1 WHERE Request.RequestID IN (" + requestid + ")", (err, result) => {
												if(err){
													console.log(err)
												}
												return
											})
										}
									})
									return
									console.log("write done")
									// console.log(reservation)
									// console.log('requestid :',requestid)
									
								}
								// console.log('test',reservation)
								
								// console.log(RoomName, timeStart.getTime())
							})
						}
					})
				}
			})
		}
		else{
			return
		}

		// const roomName = result[0]
		// const a = result.length-1
		// console.log(result[a])
		// console.log('roomName :', roomName)
		// for (var i=1 ; i<result.length && i+3 <= result.length ; i+=3){
		// 	if(result[i] == ''){
		// 		console.log(i)
		// 	}
		// 	console.log('len :',a)
		// 	console.log('last :',result[a])
		// 	const epochTime = result[i+1]
		// 	const date = new Date(0)
		// 	date.setUTCSeconds(epochTime)
		// 	const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
		// 	var sql = "INSERT INTO Log (uid, RoomName, Time, Status) VALUES ('" + result[i] + "','" + result[0] + "','" + dateString + "','" + result[i+2] + "')"
		// 	db.query(sql , (err, result) => {
		// 		if (err) throw err
		// 		console.log("inserted into LOG")
		// 		if(result[a] == "finish" && i == a-3){
		// 			console.log('fdewgdfgsdfdfg')
		// 			socket.end()
		// 			return
		// 		}
		// 	})
		// }
	})

	socket.on('error', function(exception) {
		console.log('SOCKET ERROR');
		socket.destroy();
		return
		// return
	})

	console.log(a)
	if( a != ''){
		console.log('gkofdg;lkdf;gk')
		socket.write('dgfdgdg')
	}
	// socket.on('end', () =>{
	// 	console.log('disconnect from server')
	// 	return
	// })
})

console.log('a :', a)

server.listen(8100, function(){
	console.log('Now listening on 8100')
})


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

