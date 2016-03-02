#!/usr/bin/env perl

use strict;
use warnings;

use v5.14;

use JSON;
use File::Slurp::Tiny qw(read_lines);
use DateTime::Format::RFC3339;

my $file_name = shift || "log/w-workers.log";

my @file_contents = read_lines($file_name);

die "Nothing in that file $file_name" unless @file_contents;

my @brackets = grep( /(start|chromosome|solution)/, @file_contents);

my @times;
my $format = DateTime::Format::RFC3339->new();
while (@brackets ) {
    my $start = shift @brackets;
    my $contents_start = decode_json $start;

    last if !@brackets;
    my $this_IP = shift @brackets;
    next if $this_IP =~ /start/;
    my %these_IPs;
    my $real_puts = 0;
    my %these_actual_IPs;
    my $puts = 0;
    while ( $this_IP !~ /solution/ ) {
      if ( $this_IP !~ /start/ ) {
	$puts++;
	my $msg_start = decode_json $this_IP;
	my $this_ID = $msg_start->{'worker_uuid'}?$msg_start->{'worker_uuid'}:$msg_start->{'IP'};
	$these_IPs{ $this_ID }++;
	if ( $msg_start->{'updated'} == 1) {
	  $these_actual_IPs{ $this_ID }++;
	  $real_puts++;
	}
      }
      last if !@brackets;
      $this_IP = shift @brackets;
    }
    if ( $this_IP =~ /solution/ ) { #Maybe unpaired
      my $end = $this_IP;
      my $contents_end = decode_json $end;
      
      my $duration = $format->parse_datetime( $contents_end->{'timestamp'} ) 
	- $format->parse_datetime( $contents_start->{'timestamp'} );
      push @times, 
	[ scalar keys %these_IPs, 
	  $duration->in_units('minutes')*60000+$duration->in_units('nanoseconds')/1e6, $puts, scalar keys %these_actual_IPs, $real_puts ]; #milliseconds
    }
}

say "IPs,milliseconds,PUTs,actualIPs,actualPUTs";
say join("\n", map("$_->[0],$_->[1],$_->[2],$_->[3],$_->[4]",@times));
