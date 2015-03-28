var request = require('supertest'), 
should = require('should'),
app = require('../index.js'),
one_chromosome = { "string": "101101101101",
		   "fitness": 0 },
great_chromosome = { "string": "whatever",
		     "fitness": 60 };

describe( "Loads configuration correctly", function() {
    it('Should set repo correctly', function( done ) {
	app.config.should.have.property('repository', "https://github.com/JJ/splash-volunteer");
	done();
    });
});

describe( "Loads termination correctly", function() {
    it('Should terminate when needed', function( done ) {
	app.is_solution(great_chromosome.string,great_chromosome.fitness).should.be.ok;
	done();
    });
});

describe( "Puts and returns chromosome", function() {
    it('should return correct type', function (done) {
	request(app)
	    .put('/one/'+one_chromosome.string+"/"+one_chromosome.fitness)
	    .expect('Content-Type', /json/)
	    .expect(200,done);
    });
    it('should return chromosome', function (done) {
	request(app)
	    .get('/random')
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end( function ( error, resultado ) {
		if ( error ) {
		    return done( error );
		}
		resultado.body.should.have.property('chromosome', one_chromosome.string);
		done();
	    });
    });
    it('should return chromosomes', function (done) {
	request(app)
	    .get('/chromosomes')
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end( function ( error, resultado ) {
		if ( error ) {
		    return done( error );
		}
		resultado.body.should.be.instanceof(Object);
		done();
	    });
    });
    it('should return IPs', function (done) {
	request(app)
	    .get('/IPs')
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end( function ( error, resultado ) {
		if ( error ) {
		    return done( error );
		}
		resultado.body.should.be.instanceof(Object);
		done();
	    });
    });
});
