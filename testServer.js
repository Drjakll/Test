var express = require('express');
var app = express();
var body = require('body-parser');
const {verify} = require('hcaptcha');


app.use(express.static(__dirname));
app.use(express.static(__dirname + "/views"));
app.set('view engine', 'ejs');

app.use(body.json());
app.use(body.urlencoded({extended: true}));

var token = "";
var tokenList = {};
var SECRET_KEY = "0xab2c774B811883a775885266c5166B6697571417";

app.get("/", function(req, res){
	token = "";
	res.render("testrun", {});
});

app.post("/", function(req, res){
	var currentToken = req.body["h-captcha-response"];
	token = currentToken;
	verify(SECRET_KEY, currentToken).then(function(data){
		console.log(data);
		if(data["success"]){
			tokenList[currentToken] = 1;
		}
		res.redirect("/");
	}).catch(console.error);
});

app.post("/gettoken", function(req, res){
	if(token != "")
		console.log("token is: " + token);
	res.send(token);
});

app.post("/verify", function(req, res){
	var verified = false;
	if(tokenList[req.body.token] != null){
		console.log(req.body.token);
		delete token[req.body.token];
		verified = true;
	}
	res.send({"verified": verified});
});

app.listen(process.env.PORT || 3000, function(){
});