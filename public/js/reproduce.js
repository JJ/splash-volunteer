var chromosomes=[];
var initial = '1111000011110000';
for ( var i = 0; i < 10; i++ ) {
    var this_one = initial;
    for ( var j = 0; j < 10; j ++ ) {
	this_one = mutate(this_one);
    }
    chromosomes.push( { 'str': this_one,
			'fitness': max_ones( this_one) } );
    $('#repro1').append("<p>"+this_one+"</p>");
}

$("#repro").submit(function(){
    var new_ones = get_pool_roulette_wheel( chromosomes, chromosomes.length);
    for ( var j in new_ones) {
	$('#repro2').append("<p>"+new_ones[j].str+"</p>");
    }
    return false;
});