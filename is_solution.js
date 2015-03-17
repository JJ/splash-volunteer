// Checks whether the chromosome is the solution. This function should be set to whatever the user wants. 

var traps = 30
var b = 2;
module.exports = exports = function( chromosome, fitness ) {
    if ( !fitness ) {
	return false;
    }
    if ( fitness < traps*b ) {
	return false;
    } else {
	return true;
    }
};
