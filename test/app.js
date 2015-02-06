var request = require('supertest'), 
should = require('should'),
app = require('../index.js'),
one_chromosome = "101101101101";

describe( "Puts and returns chromosome", function() {
    it('should return correct type', function (done) {
	request(app)
	    .put('/one/'+one_chromosome)
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
		resultado.body.should.have.property('chromosome', one_chromosome);
		done();
	    });
    });
});
