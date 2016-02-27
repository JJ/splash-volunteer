var fs = require('fs'),
express = require('express'),
app = express(),
winston = require('winston'),
leroux = require('leroux-cache'),
App = require("app.json"); // Used for configuration and by Heroku

// Includes termination condition
app.is_solution = require("./is_solution.js");

// Other configuration variables 
app.config = App.new(__dirname + "/app.json");

// configure for openshift or heroku
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'; 
app.set('port', (process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5555));
app.set('trust proxy', true );
var log_dir = process.env.OPENSHIFT_DATA_DIR || "log";
if (!fs.existsSync(log_dir)){
    fs.mkdirSync(log_dir);
}
// set up static dir
app.use(express.static(__dirname + '/public'))

// set up experimente sequence
var sequence = 0;
var temp = new Date();
var date_str = temp.getFullYear() + "-" + (1 + temp.getMonth()) + "-"+ temp.getDate();

// create logger to console and file
var logger = new (winston.Logger)({
    transports: [
	new (winston.transports.Console)( { level: 'info'} ),
	new (winston.transports.File)({ filename: log_dir+'/nodio-'+date_str+ "-" + sequence+'.log', level: 'info' })
    ]
});

// internal variables
var cache = leroux({sweepDelay: 200, maxSize: app.config.vars.cache_size || 128});
var IPs = {};

// Retrieves a random chromosome
app.get('/random', function(req, res){
    if (cache.size > 0) {
	var probability = 1/cache.size;
	var random_chromosome;
	cache.forEach( function( value, key, cache ) {
	    if ( !random_chromosome && Math.random() < probability ) {
		random_chromosome = key;
	    }
	});
	res.send( { 'chromosome': random_chromosome } );
	logger.info('get');
    } else {
	res.status(404).send('No chromosomes yet');
    }
    
});

// Retrieves the whole chromosome pool
app.get('/chromosomes', function(req, res){
    var chromosomes = {};
    cache.forEach( function( value, key, cache ) {
	chromosomes[key]=value;
    });
    res.send( chromosomes );
});

// Retrieves the IPs used
app.get('/IPs', function(req, res){
    res.send( IPs );
});

// Retrieves the sequence number
app.get('/seq_number', function(req, res){
    res.send( { "number": sequence} );
});

// Adds one chromosome to the pool, with fitness
app.put('/one/:chromosome/:fitness', function(req, res){
    if ( req.params.chromosome ) {
	cache.set( req.params.chromosome, req.params.fitness); // to avoid repeated chromosomes
//	console.log( "Caching "+req.params.chromosome + " " + req.params.fitness );
	var client_ip;
	if ( ! process.env.OPENSHIFT_NODEJS_IP ) { // this is not openshift
	    client_ip = req.connection.remoteAddress;
	} else {
	    client_ip = req.headers['x-forwarded-for'];
	}

	if ( !IPs[ client_ip ] ) {
	    IPs[ client_ip ]=1;
	} else {
	    IPs[ client_ip ]++;
	}

	logger.info("put", { chromosome: req.params.chromosome,
			     fitness: parseFloat(req.params.fitness),
			     IP: client_ip,
			     cache_size: cache.size } );
	if ( app.is_solution( req.params.chromosome, req.params.fitness, app.config.vars.traps, app.config.vars.b ) ) {
	    console.log( "Solution!");
	    logger.info( "finish", { solution: req.params.chromosome } );
	    cache = leroux({sweepDelay: 200, maxSize: app.config.vars.cache_size || 128});;
	    sequence++;
	    logger.info( { "start": sequence });	    
	}
	res.send( { length : cache.size });
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
