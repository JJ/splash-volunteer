var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5555))
app.use(express.static(__dirname + '/public'))

//app.get('/', function(request, response) {
//  response.send('Hello World!')
//})

// console.log(conf);
var log = [];
var chromosomes = {};

// Retrieves a random chromosome
app.get('/random', function(req, res){
	    if (Object.keys(chromosomes ).length > 0) {
		var keys = Object.keys(chromosomes );
		var one = keys[ Math.floor(keys.length*Math.random())];
		res.send({ chromosome : one });
		log.push({ get: process.hrtime()});
	    } else {
		res.status(404).send('No chromosomes yet');
	    }
	   
});

// Retrieves the log
app.get('/log', function(req, res){
	    res.send( log );
});

// Adds one chromosome to the pool
app.put('/one/:chromosome', function(req, res){
	    if ( req.params.chromosome ) {
		chromosomes[ req.params.chromosome ] = 1; // to avoid repeated chromosomes
		log.push( { put: process.hrtime(),
			    chromosome: req.params.chromosome,
			    IP: req.connection.remoteAddress } );
		res.send( { length : Object.keys(chromosomes).length });
	    } else {
		res.send( { length : 0 });
	    }
	    
});

// Error check
app.use(function(err, req, res, next){
	      //check error information and respond accordingly
	      console.error( "Exception in server ", err.stack);
});

// Start listening
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

// Exports for tests
module.exports = app;
