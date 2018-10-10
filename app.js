// --- LOADING MODULES
var express = require('express');
var mongoose = require('mongoose');
var body_parser = require('body-parser');

// --- INSTANTIATE APP
var app = express();

// --- STATIC MIDDLEWARE
app.use(express.static(__dirname + '/public'));
app.use(body_parser.json());
var emptySchema = new mongoose.Schema({}, {strict: false});
var Entry = mongoose.model('Entry', emptySchema);

mongoose.connect('process.env.CONNECTION');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback(){
	console.log('database opened')
})


// --- VIEW LOCATION, SET UP SERVING STATIC HTML
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// --- ROUTING
app.get('/', function(request, response){
	response.render('coChoice_draft.html')
});

app.get('/experiment', function(request, response){
	response.render('coChoice_draft.html')
})

app.get('/debrief', function(request, response){
	response.render('debrief.html')
})

// --- SAVING DATA
app.post('/experiment-data', function(request, response){
	Entry.create({
		"data":request.body
	});
	response.end();
})
// --- START THE SERVER
var server = app.listen(process.env.PORT, function(){
	console.log('Listening on port %d', server.address().port);
});




