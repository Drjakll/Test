var express = require('express');
var app = express();
var mongodb = require('mongodb').MongoClient;
var URI = 'mongodb://localhost:27017/?gssapiServiceName=mongodb';
var dataBase = 'shop';
var body = require('body-parser');

app.use(body.json());
app.use(body.urlencoded({extended: true}));

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/views"));
app.set('view engine', 'ejs');

function ReleaseData(collectionName, pageName, res, dbo){
	dbo.collection(collectionName).find({}).toArray(function(err, result){
		if(err) 
			throw err;
		res.render(pageName, {data: result});
	});
}

app.get("/", function(req, res){
	mongodb.connect(URI, {useNewUrlParser: true}, function(err, db){
		 var dbo = db.db(dataBase);
		 if(err)
			 throw err;
		ReleaseData("Categories", "Main", res, dbo);
	});
});

app.get("/Admin", function(req, res){
	mongodb.connect(URI, {useNewUrlParser: true}, function(err, db){
		 var dbo = db.db(dataBase);
		 if(err)
			 throw err;
		ReleaseData("Categories", "AdminPage", res, dbo);
	});
});

app.post("/AddCategory", function(req, res){
	var CategoryToAdd = req.body.addCategory;
	
	if(CategoryToAdd == undefined){
		return;
	}
	
	mongodb.connect(URI, {useNewUrlParser: true}, function(err, db){
		if(err)
			throw err;
		var dbo = db.db(dataBase);
		
		var addObj = {};
		addObj.CategoryName = CategoryToAdd;
		addObj.Items = {};
		
		dbo.collection("Categories").findOne({CategoryName: CategoryToAdd}, function(err, result){
			if(result != null)
			{
				return;
			}
			else{
				dbo.collection("Categories").insertOne(addObj, function(err, response){
					if(err)
						throw err;
				});
			}
		});
		
		res.redirect("/Admin");
	});
});

app.post("/AddLink", function(req, res){
	var SelectedCategory = req.body.Category;
	var LinkToAdd = req.body.link;
	
	if(SelectedCategory == undefined || LinkToAdd == undefined)
	{
		return;
	}
	
	mongodb.connect(URI, {useNewUrlParser: true}, function(err, db){
		if(err)
			throw err;
		var dbo = db.db(dataBase);
		
		dbo.collection("Categories").findOne({CategoryName: SelectedCategory}, function(err, result){
			
			if(result.Items[LinkToAdd] != null)
				return;
			
			result.Items[LinkToAdd] = {"Description": LinkToAdd};
			var NewValue = {$set : {Items : result.Items}};
			dbo.collection("Categories").updateOne({CategoryName: SelectedCategory}, NewValue ,function(err, res){
				if(err)
					throw err;
			});
		});
	});
	
	res.redirect("/Admin");
});

app.post("/RemoveCategory", function(req, res){
	var Category = req.body.Category;
	
	if(Category == undefined){
		return;
	}
	mongodb.connect(URI, {useNewUrlParser: true}, function(err, db){
		if(err)
			throw err;
		
		var dbo = db.db(dataBase);
		
		dbo.collection("Categories").deleteOne({CategoryName : Category}, function(err, response){
			if(err)
				throw err;
		});
	});
	
	res.redirect("/Admin");
});

app.post("/RemoveLink", function(req, res){
	var Category = req.body.Category;
	var RemoveLink = req.body.link;
	
	if(Category == undefined || RemoveLink == undefined)
	{
		return;
	}
	
	mongodb.connect(URI, {useNewUrlParser: true}, function(err, db){
		if(err)
			throw err;
		
		var dbo = db.db(dataBase);
		
		dbo.collection("Categories").findOne({CategoryName: Category}, function(err, result){
			delete result.Items[RemoveLink];
			
			dbo.collection("Categories").updateOne({CategoryName: Category}, {$set : {Items: result.Items}}, function(err, response){
				if(err)
					throw err;
			});
		});
	});
	res.redirect("/Admin");
});

app.listen(process.env.PORT || 8000, function(){
});