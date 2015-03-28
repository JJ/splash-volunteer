var express = require('express'),
app = express(),
winston = require('winston'),
loggly = require('winston-loggly'),
App = require("app.json"); // Used for configuration and by Heroku


// Includes termination condition
app.is_solution = require("./is_solution.js");

// Other configuration variables 
app.config = App.new(__dirname + "/app.json");

// configure for openshift or heroku
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'; 
app.set('port', (process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5555))

// set up static dir
app.use(express.static(__dirname + '/public'))

// logger
var logger = new (winston.Logger)({
    transports: [
	new (winston.transports.Console)( { level: 'info'} ),
	new (winston.transports.File)({ filename: 'nodio.log', level: 'info' })
    ]
});

if ( process.env.LOGGLY_TOKEN && process.env.LOGGLY_PASS && process.env.LOGGLY_USER) {
    logger.add( winston.transports.Loggly, 
		{ inputToken: process.env.LOGGLY_TOKEN ,
		  level: 'info',
		  subdomain: process.env.LOGGLY_USER,
		  json: true,
		  "auth": {
		      "username": process.env.LOGGLY_USER,
		      "password": process.env.LOGGLY_PASS
		  }
		} );
}

var chromosomes = {};
var IPs = {};
var sequence = 0;

// Retrieves a random chromosome
app.get('/random', function(req, res){
    if (Object.keys(chromosomes ).length > 0) {
	var keys = Object.keys(chromosomes );
	var one = keys[ Math.floor(keys.length*Math.random())];
	res.send( { 'chromosome': one } );
	logger.info('get');
    } else {
	res.status(404).send('No chromosomes yet');
    }
    
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
	logger.info("put", { chromosome: req.params.chromosome,
			     fitness: parseInt(req.params.fitness),
			     IP: req.connection.remoteAddress } );
	res.send( { length : Object.keys(chromosomes).length });
	if ( app.is_solution( req.params.chromosome, req.params.fitness, app.config.vars.traps, app.config.vars.b ) ) {
	    console.log( "Solution!");
	    logger.info( "finish", { solution: req.params.chromosome } );
	    chromosomes = {};
	    sequence++;
	    logger.info( { "start": sequence });	    
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
    console.log("Node app is running at localhost:" + app.get('port'));
    logger.info( { "start": sequence });
})

// Exports for tests
module.exports = app;
