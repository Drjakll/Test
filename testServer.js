var express = require('express');
var app = express();
var body = require('body-parser');
const {verify} = require('hcaptcha');

app.use(eIP().getIpInfoMiddleware);
app.use(ip.mw());
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/views"));
app.set('view engine', 'ejs');
app.set('trust proxy', true);

app.use(body.json());
app.use(body.urlencoded({extended: true}));

var token = "";
var IPPass = {};
var SECRET_KEY = "0xab2c774B811883a775885266c5166B6697571417";

app.get("/", function(req, res){

	res.render("testrun", {});

});

app.post("/", function(req, res){
	var currentToken = req.body["h-captcha-response"];

	verify(SECRET_KEY, currentToken).then(function(data){
		console.log("checking success");
		if(data["success"]){
			console.log("Sucess!");
			IPPass[req.ip] = currentToken;
			console.log(req.ip);
		}
		res.redirect("/");
	}).catch(console.error);
});

app.post("/verify", function(req, res){
	var verified = false;
	if(IPPass[req.body.ip] != null ){
		delete IPPass[req.body.ip];
		verified = true;
	}
	res.send({"verified": verified});
});

app.listen(process.env.PORT || 3000, function(){
});