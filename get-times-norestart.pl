#!/usr/bin/env perl

use strict;
use warnings;

use v5.14;

use File::Slurp::Tiny qw(read_file);
use Time::Piece;

my $file_name = shift || "log/50runs-norestart.dat";

my $file_contents = read_file($file_name);

die "Nothing in that file $file_name" unless $file_contents;

my @starts = ($file_contents =~/Starting.+?(\d{2}:\d{2}:\d{2})/gs);
my @ends = ($file_contents =~/(\d{2}:\d{2}:\d{2}).+?Finished/gs);

my @durations;
for (my $i = 0; $i <= $#starts; $i++ ) {
    push @durations, Time::Piece->strptime( $ends[$i], '%H:%M:%S' ) - 
	Time::Piece->strptime( $starts[$i], '%H:%M:%S' );
}
say join("\n",@durations);
