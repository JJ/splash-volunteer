var chromosomes_ev=[];
var initial = '1111000011110000';
for ( var i = 0; i < 10; i++ ) {
    var this_one = initial;
    for ( var j = 0; j < 10; j ++ ) {
	this_one = mutate(this_one);
    }
    chromosomes_ev.push( this_one );
    $('#gen1').append("<p>"+this_one+"</p>");
}

$("#eval").submit(function(){
    for ( var j in chromosomes_ev) {
	console.log(chromosomes_ev[j]);
	$('#gen2').append("<p>"+chromosomes_ev[j]+"->"+max_ones(chromosomes_ev[j])+"</p>");
    }
    return false;
});