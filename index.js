var express = require('express');
var app = express();
// Used for configuration and by Heroku
var App = require("app.json");

// Includes termination condition
app.is_solution = require("./is_solution.js");

// Other configuration variables 
app.config = App.new(__dirname + "/app.json");

// configure for openshift or heroku
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'; 
app.set('port', (process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5555))

// set up static dir
app.use(express.static(__dirname + '/public'))

var log = [];
var chromosomes = {};
var IPs = {};
var sequence = 0;

// Retrieves a random chromosome
app.get('/random', function(req, res){
    if (Object.keys(chromosomes ).length > 0) {
	var keys = Object.keys(chromosomes );
	var one = keys[ Math.floor(keys.length*Math.random())];
	res.send( { 'chromosome': one } );
	log.push({ get: process.hrtime()});
    } else {
	res.status(404).send('No chromosomes yet');
    }
    
});

// Retrieves the log
app.get('/log', function(req, res){
    res.send( log );
});

// Retrieves the whole chromosome pool
app.get('/chromosomes', function(req, res){
    res.send( chromosomes );
});

// Retrieves the IPs used
app.get('/IPs', function(req, res){
    res.send( IPs );
});

// Adds one chromosome to the pool, with fitness
app.put('/one/:chromosome/:fitness', function(req, res){
    if ( req.params.chromosome ) {
	chromosomes[ req.params.chromosome ] = req.params.fitness; // to avoid repeated chromosomes
	IPs[ req.connection.remoteAddress ]++;
	log.push( { put: process.hrtime(),
		    chromosome: req.params.chromosome,
		    IP: req.connection.remoteAddress } );
	res.send( { length : Object.keys(chromosomes).length });
	if ( app.is_solution( req.params.chromosome, req.params.fitness ) ) {
	    chromosomes = {};
	    sequence++;
	}
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
app.listen(app.get('port'), server_ip_address, function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

// Exports for tests
module.exports = app;
