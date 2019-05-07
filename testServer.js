var express = require('express');
var app = express();
var mongodb = require('mongodb').MongoClient;
var URI = 'mongodb://localhost:27017/?gssapiServiceName=mongodb';
var dataBase = 'shop';
var body = require('body-parser');
var fs = require('fs');

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/views"));
app.set('view engine', 'ejs');

app.use(body.json());
app.use(body.urlencoded({extended: true}));

app.get("/", function(req, res){
	res.render("testrun", {});
});

app.post("/", function(req, res){
	console.log("I got it");
	var SECRET_KEY = "0xab2c774B811883a775885266c5166B6697571417";
	var VERIFY_URL = "https://hcaptcha.com/siteverify";
	var token = req.body["h-captcha-response"];
	var data = {'secret': SECRET_KEY, 'response': token};
	console.log(token);
	res.redirect("/");
});

app.post("https://hcaptcha.com/siteverify", function(req, res){
	console.log("Hi");
});

app.listen(process.env.PORT || 8000, function(){
});