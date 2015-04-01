#!/usr/bin/env perl

use strict;
use warnings;

use v5.14;

use File::Slurp::Tiny qw(read_lines);
use Time::Piece;

my $file_name = shift || "log/50runs.dat";

my @file_contents = read_lines($file_name);

die "Nothing in that file $file_name" unless @file_contents;

my @starts = grep( /started with/, @file_contents );
my @ends = grep( /sending SIGTERM/, @file_contents );

my @durations;
for (my $i = 0; $i <= $#starts; $i++ ) {
    my ($start_time) = ($starts[$i] =~ /^(\d+:\d+:\d+)/); 
    my ($end_time) = ($ends[$i] =~ /^(\d+:\d+:\d+)/); 
    push @durations, Time::Piece->strptime( $end_time, '%H:%M:%S' ) - 
	Time::Piece->strptime( $start_time, '%H:%M:%S' );
}
say join("\n",@durations);
