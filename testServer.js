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

app.get("/", function(req, res){
	res.render("testrun", {msg : "Hi!"});
});

app.post("/verify", function(req, res){
	var SECRET_KEY = "0xab2c774B811883a775885266c5166B6697571417";
	var VERIFY_URL = "https://hcaptcha.com/siteverify";
	var token = req.body["h-captcha-response"];
	
	verify(SECRET_KEY, token).then(function(data){
		console.log(data);
		res.send(data);
	}).catch(console.error);
});

app.get("/verify", function(req, res){
	res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
});