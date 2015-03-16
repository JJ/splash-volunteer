// Checks whether the chromosome is the solution. This function should be set to whatever the user wants. 

var traps = 30;
var b = 2;
exports.is_solution = function( chromosome ) {
    if ( chromosome.fitness < traps*b ) {
	return false;
    } else {
	return true;
    }
}
