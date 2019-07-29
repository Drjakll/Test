var express = require('express');
var app = express();
var WebSocket = require('ws');
var path = require('path');
var stream = require('stream');

app.set('view engine', 'ejs');

const WS_PORT = process.env.PORT || 3001;

const HTTP_PORT = process.env.PORT || 3000;

app.get("/", function(req, res){
	res.render("test");
});

app.get("/client", function(req, res){
	res.render("client");
});

app.listen(HTTP_PORT, function(){
});
