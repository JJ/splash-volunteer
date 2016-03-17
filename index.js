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
var log_file_name = get_winston_filename( log_dir );
console.log( log_file_name );
// create logger to console and file
var logger = new (winston.Logger)({
    transports: [
	new (winston.transports.Console)( { level: 'info'} ),
	new (winston.transports.File)({ filename: log_file_name, level: 'info' })
    ]
});

// internal variables
var cache = leroux({sweepDelay: 200, maxSize: app.config.vars.cache_size || 128});
var ip_cache = leroux({maxSize: 1024 });
var IPs = {};
var sequence = 0;

// Retrieves a random chromosome
app.get('/random', function(req, res){
    console.log( "Cache size " + cache.size );
    if (cache.size > 0) {
	var random_chromosome = get_random_element();
	console.log("Random " + random_chromosome);
	res.send( { 'chromosome': random_chromosome } );
	logger.info('get');
    } else {
	res.status(404).send('No chromosomes yet');
    }
    
});

// Retrieves the whole chromosome pool
app.get('/chromosomes', function(req, res){
    var chromosomes = new Object;
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

//	console.log( "Caching "+req.params.chromosome + " " + req.params.fitness );
	var client_ip;
	var random_chromosome = get_random_element();
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
	var updated = false;
	if ( ip_cache.get(client_ip) !== req.params.chromosome ) { // guard from stalled simulations
	    cache.set( req.params.chromosome, req.params.fitness); // to avoid repeated chromosomes
	    ip_cache.set(client_ip, req.params.chromosome );
	    updated = true;
	} 

	logger.info("put", { chromosome: req.params.chromosome,
			     fitness: parseFloat(req.params.fitness),
			     IP: client_ip,
			     cache_size: cache.size,
			     updated: updated} );
	if ( app.is_solution( req.params.chromosome, req.params.fitness, app.config.vars.traps, app.config.vars.b ) ) {
	    console.log( "Solution!");
	    logger.info( "finish", { solution: req.params.chromosome } );
	    cache = leroux({sweepDelay: 200, maxSize: app.config.vars.cache_size || 128});;
	    sequence++;
	    logger.info( { "start": sequence });	    
	}
	res.send( { chromosome: random_chromosome,
		    length : cache.size,
		    updated: updated });
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

// Obtain a filename for logging, incrementing its number in a sequence
function get_winston_filename ( log_dir ) {
    var sequence = 0;
    // set up experiment sequence
    var temp = new Date();
    var date_str = temp.getFullYear() + "-" + (1 + temp.getMonth()) + "-"+ temp.getDate();
    var filename = '';
    var found = true;
    while ( found) {
	filename = log_dir+'/nodio-'+date_str+ "-" + sequence+'.log';
	try {
	    fs.accessSync(filename, fs.F_OK);
	    sequence++;
	    found = true;
	} catch (e) {
	    found = false;
	}
    }
    return filename;
}

// Get a random element from the cache
function get_random_element () {
    var keys = new Array;
    cache.forEach( function( value, key, cache ) {
	keys.push(key);
    });
    return keys[Math.floor(Math.random()*keys.length)];
}

module.exports.get_winston_filename = get_winston_filename;
module.exports.get_random_element = get_random_element;
