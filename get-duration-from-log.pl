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

my @brackets = grep( /(start|solution)/, @file_contents);

my @times;
my $format = DateTime::Format::RFC3339->new();
while (@brackets ) {
    my $start = shift @brackets;
    my $contents_start = decode_json $start;

    if ( @brackets ) { #Maybe unpaired
      my $end = shift @brackets;
      my $contents_end = decode_json $end;
      
      my $duration = $format->parse_datetime( $contents_end->{'timestamp'} ) 
	- $format->parse_datetime( $contents_start->{'timestamp'} );
      push @times, $duration->in_units('minutes')*60000+$duration->in_units('nanoseconds')/1e6; #milliseconds
    }
}

say join("\n", @times);
