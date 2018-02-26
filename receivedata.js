var net = require("net");
const utf8 = require('utf8');

var server = net.createServer(function(socket) {
	socket.write('Test ja');
	socket.on('data', function(data){
		data = data.toString()
		console.log(data)
	});
});

server.listen(8100, function(){
	console.log('Now listening');
});