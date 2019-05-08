var express = require('express');
var app = express();
var mongodb = require('mongodb').MongoClient;
var URI = 'mongodb://localhost:27017/?gssapiServiceName=mongodb';
var dataBase = 'shop';
var body = require('body-parser');
var fs = require('fs');
const {verify} = require('hcaptcha');


app.use(express.static(__dirname));
app.use(express.static(__dirname + "/views"));
app.set('view engine', 'ejs');

app.use(body.json());
app.use(body.urlencoded({extended: true}));

var verified = "";

app.get("/", function(req, res){
	verified = "";
	res.render("testrun", {});
});

app.post("/", function(req, res){
	var SECRET_KEY = "0xab2c774B811883a775885266c5166B6697571417";
	var token = req.body["h-captcha-response"];
	
	verify(SECRET_KEY, token).then(function(data){
		console.log(data);
		if(data["success"])
			verified = token;
		res.redirect("/");
	}).catch(console.error);
});

app.post("/verify", function(req, res){
	res.send(verified);
});

app.listen(process.env.PORT || 3000, function(){
});