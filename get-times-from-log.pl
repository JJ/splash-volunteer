#!/usr/bin/env perl

use strict;
use warnings;

use v5.14;

use JSON;
use File::Slurp::Tiny qw(read_lines);
use DateTime::Format::RFC3339;

my $file_name = shift || "log/nodio-2015-4-4-0.log";

my @file_contents = read_lines($file_name);

die "Nothing in that file $file_name" unless @file_contents;

my @puts = grep( /chromosome/, @file_contents);

my %times;
my $format = DateTime::Format::RFC3339->new();
for my $put (@puts ) {
  my $contents = decode_json $put;

  push @{$times{$contents->{'IP'}}}, $format->parse_datetime( $contents->{'timestamp'} );
}

my @intervals;
for my $IP ( keys %times ) {
    my @times = @{$times{$IP}};
    for ( my $t = 1; $t <= $#times; $t++ ) {
      my $interval = $times[$t]-$times[$t-1];
      push @intervals, $interval->nanoseconds()/1e6;
    }
}
say join("\n", @intervals);
