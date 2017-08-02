var express = require('express'),
bodyParser = require('body-parser'),
app = express(),
port = process.env.PORT || 3000;
  
app.use(bodyParser.json());

app.route('/items').get(function(request, response){	
	var maxitem = 10;
	var fs = require('fs');
	var jsonobject = {};
	jsonobject.itemlist=[];
	try {
		jsonobject = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, 'input.json'), 'utf8'));
		jsonobject.paginationInfo = {"totalResults":0,"resultPerPage":0,"currentPage":0,"pages":0};	
	} 
	catch (e) {
		console.log('Error:', e);
	}

	jsonobject.paginationInfo = {"totalResults":0,"resultPerPage":0,"currentPage":0,"pages":0};

	if(jsonobject.itemlist == null){
		jsonobject.itemlist=[];
	}
	else {
		jsonobject.paginationInfo["totalResults"] = jsonobject.itemlist.length;		
		jsonobject.paginationInfo["resultPerPage"] = maxitem;
		jsonobject.paginationInfo["currentPage"] = 1;
		jsonobject.paginationInfo["pages"] = Math.ceil(jsonobject.itemlist.length / maxitem);	
		
		for(var i = jsonobject.itemlist.length - 1; i >= 0; i--) {
			if(i >= maxitem ) {
				jsonobject.itemlist.splice(i, 1);
			}
		}
		
		
	}
	
	response.json(jsonobject);
})

app.route('/items/:id').delete(function(request, response){	
	var fs = require('fs');
	var jsonobject = {};
	jsonobject.itemlist=[];
	try {
		jsonobject = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, 'input.json'), 'utf8'));
	} 
	catch (e) {
		console.log('Error:', e);
	}
	
	if(jsonobject.itemlist == null){
		jsonobject.itemlist=[];
	}	
	
	var deletestatus = false;
	for(var i = jsonobject.itemlist.length - 1; i >= 0; i--) {
		if(jsonobject.itemlist[i].items.id == request.params.id){
			jsonobject.itemlist.splice(i, 1);
			deletestatus = true;
		}
	}
	
	fs.writeFile(require('path').resolve(__dirname, 'input.json'), JSON.stringify(jsonobject), function(err) {
		if(err) {
			console.log(err);
		}
		else {
			if(deletestatus){
				response.send("record deleted.");
			}
			else {
				response.send("record not found.");
			}
		}

	});	

	});
	
// {"name":"note xx","Price":"1122.30","Brand":"Samsung"}
app.route('/items/:id').patch(function(request, response){	
	var fs = require('fs');
	var jsonobject = {};
	jsonobject.itemlist=[];
	try {
		jsonobject = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, 'input.json'), 'utf8'));
	} 
	catch (e) {
		console.log('Error:', e);
	}
	
	if(jsonobject.itemlist == null){
		jsonobject.itemlist=[];
	}	
	
	var updateresult = [];
	for(var i = jsonobject.itemlist.length - 1; i >= 0; i--) {
		if(jsonobject.itemlist[i].items.id == request.params.id){
			jsonobject.itemlist[i].items.name = request.body.name;
			
			jsonobject.itemlist[i].items.Price = request.body.Price;
			jsonobject.itemlist[i].items.Brand = request.body.Brand;
			updateresult = jsonobject.itemlist[i];
		}
	}
	
	fs.writeFile(require('path').resolve(__dirname, 'input.json'), JSON.stringify(jsonobject), function(err) {
		if(err) {
			console.log(err);
		}
		else {
			response.json(updateresult);
		}

	});	

});
	
//input :: {"items":{"id":"123","name":"iPhone 9","Price":"2999.90","Brand":"Apple"}}
app.route('/items').post(function(request, response){	
	var fs = require('fs');
	var jsonobject = {};
	jsonobject.itemlist=[];
	try {
		jsonobject = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, 'input.json'), 'utf8'));
	} 
	catch (e) {
		console.log('Error:', e);
	}
	jsonobject.itemlist.push( request.body );
	
	fs.writeFile(require('path').resolve(__dirname, 'input.json'), JSON.stringify(jsonobject), function(err) {
		if(err) {
			console.log(err);
		}
		else {
			response.json(request.body);
		}

	}); 
});

app.listen(port);
