var express = require('express');
var app = express();
//var WebSocket = require('ws');
var path = require('path');
//var stream = require('stream');
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, {pingInterval: 10000});

app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/node_modules"));
app.use(express.static(__dirname + "/views"));

const WS_PORT = process.env.WS_PORT || 3001;

const HTTP_PORT = process.env.HTTP_PORT || 3000;



//const wsServer = new WebSocket.Server({ port: WS_PORT }, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));


let connectedClients = [];

var num = 0;

io.on('connection', function(socket) {
	console.log("a client connected");
	socket.on('msg', function(data) {
		num++;
		console.log(num);
      io.sockets.emit('newmsg', data);
   });
});

/*wsServer.on('connection', (ws, req) => {

    console.log('Connected');

    // add new connected client

    connectedClients.push(ws);

    // listen for messages from the streamer, the clients will not send anything so we don't need to filter

    ws.on('message', data => {

        // send the base64 encoded frame to each connected ws

        setTimeout(function() {
			connectedClients.forEach((ws, i) => {

				if (ws.readyState === ws.OPEN) { // check if it is still connected
					//var sendData = new Buffer.from(data, 'binary');
					num++;
					console.log(num);
					let buff = new Buffer(data, 'base64');
					let text = buff.toString('ascii');
					ws.send(data); // send

				} else { // if it's not connected remove from the array of connected ws

					connectedClients.splice(i, 1);

				}

			});
		}, 0);
    });

});*/

app.get("/", function(req, res){
	res.render("test");
});

app.get("/client", function(req, res){
	res.render("client");
});


server.listen(HTTP_PORT);
/*app.listen(HTTP_PORT, function(){
});*/