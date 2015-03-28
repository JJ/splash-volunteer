// Checks whether the chromosome is the solution. This function should be set to whatever the user wants. 

module.exports = exports = function( chromosome, fitness, traps, b ) {
    if ( !fitness ) {
	return false;
    }
    if ( fitness < traps*b ) {
	return false;
    } else {
	return true;
    }
};
