use strict; # -*- mode:cperl -*-
use warnings;
use Test::More;   

use lib qw(../lib);

use Data::Nodio;

my $data = new Data::Nodio "../../log/nodio-2015-4-4-0.log";
is( ref $data, "Data::Nodio", "Class");
ok( @{$data->{'_data_strings'}}, "Data" );
ok( $data->{'_data_strings'}[0] eq ($data->log())[0], "Data array" );
is( ref $data->data(), 'ARRAY', "Processed data" );
is( ref $data->data()->[0], 'HASH', "Processed data" );

done_testing();
