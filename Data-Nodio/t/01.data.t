use strict; # -*- mode:cperl -*-
use warnings;
use Test::More;   

use lib qw(../lib);

use Data::Nodio;

my $data = new Data::Nodio "../../log/nodio-2015-4-4-0.log";
is( ref $data, "Data::Nodio", "Class");
ok( @{$data->{'_data'}}, "Data" );
ok( $data->{'_data'}[0] eq ($data->data())[0], "Data" );


done_testing();
