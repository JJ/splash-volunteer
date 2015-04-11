#!/usr/bin/env perl

use strict;
use warnings;

use v5.14;

use lib qw(Data-Nodio/lib);
use Data::Nodio;

my $file_name = shift || "log/nodio-2015-4-4-0.log";

my $data = new Data::Nodio $file_name;

my @runs = @{$data->runs()};

for my $run (@runs ) {
  say scalar keys %{$run->{'puts'}};
}
