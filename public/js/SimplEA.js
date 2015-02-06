function max_ones( chromosome ) {
    var ones=0;
    for ( var i=0; i < chromosome.length; i++ ){ 
	ones += parseInt(chromosome.charAt(i));
    }
    return ones;
}

function get_pool_roulette_wheel (population, need ) {
    var total_fitness = 0;
    for ( var i in population ) {
	total_fitness += population[i].fitness;
    }
    var wheel = new Array;
    for ( var i in population ) {
	wheel[i]  = population[i].fitness/total_fitness;
    }
    var slots = spin( wheel, population.length );
    var pool = new Array;
    var index = 0;
    do {
	var p = index++ % slots.length;
	var copies = slots[p];
	if ( ! copies ) 
	    continue; 
	for (var i = 1; i < copies; i++) {
	    pool.push( population[p] );
	}
    } while ( pool.length < need );
  
    return pool;
}

function spin( wheel, number_of_slots ) {
    var slots = new Array;
    for (var i in wheel ) {
	slots[i] = wheel[i]*number_of_slots;
    }
   return slots;
}

function produce_offspring( pool, offspring_size) {
    var crossed_strings = new Array;
    pool.shuffle;
    for ( var i = 0; i < offspring_size/2; i++ )  {
	var first = pool.pop();
	var second = pool.pop();
	crossed_strings.push( crossover( first, second ) );
    }
    var population = new Array;
    for ( i in crossed_strings ) {
	population.push( mutate(crossed_strings[i]) );
    }
    return population;
}


// applied over the first chromosome
function crossover( guy_1, guy_2 ) {
    var first_chromosome = guy_1;
    var second_chromosome = guy_2;
    var this_len = first_chromosome.length;
    var point_1 = Math.floor( Math.random()* this_len);
    var len = 1+Math.floor( Math.random()*(this_len - point_1 - 1));
     var resulting_chromosome= first_chromosome.substr(0,point_1) +
    second_chromosome.substr(point_1, len) +
	first_chromosome.substr(point_1+len, this_len - (point_1 + len ));
    return resulting_chromosome;
}

function mutate( chromosome ) {
    var mutation_point = Math.floor( Math.random() * chromosome.length);
    var temp = chromosome;
    var flip_bit = temp.charAt(mutation_point).match(/1/)?"0":"1";
    chromosome = temp.substring(0,mutation_point) +
	flip_bit + 
	temp.substring(mutation_point+1,temp.length) ;
    return chromosome;
}