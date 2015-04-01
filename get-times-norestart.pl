#!/usr/bin/env perl

use strict;
use warnings;

use v5.14;

use File::Slurp::Tiny qw(read_lines);
use Time::Piece;

my $file_name = shift || "log/50runs-norestart.dat";

my @file_contents = grep(/(Starting|Finished|^\d{2}:\d{2}:\d{2})/, read_lines($file_name) );

die "Nothing in that file $file_name" unless @file_contents;

my (@starts, @ends);
for (my $i = 0; $i <= $#file_contents; $i++ ) {
  if ( $file_contents[$i]=~ /Starting/ )  {
    my $this_time;
    if  ($file_contents[$i-1] =~ /(^\d{2}:\d{2}:\d{2})/) {
      $this_time = $1;
    } elsif ($file_contents[$i-2] =~ /(^\d{2}:\d{2}:\d{2})/) {
      $this_time = $1;
    }
    push @starts, $this_time;
  }
  
  if ( $file_contents[$i]=~ /Finished/ ) {
    my $this_time;
    if  ($file_contents[$i-1] =~ /(^\d{2}:\d{2}:\d{2})/) {
      $this_time = $1;
    } elsif ($file_contents[$i+1] =~ /(^\d{2}:\d{2}:\d{2})/) {
      $this_time = $1;
    }
    push @ends, $this_time;
  }

}

my @durations;
for (my $i = 0; $i <= $#starts; $i++ ) {
    my ($start_time) = ($starts[$i] =~ /^(\d+:\d+:\d+)/); 
    my ($end_time) = ($ends[$i] =~ /^(\d+:\d+:\d+)/); 
    push @durations, Time::Piece->strptime( $end_time, '%H:%M:%S' ) - 
	Time::Piece->strptime( $start_time, '%H:%M:%S' );
}


say join("\n",@durations);
