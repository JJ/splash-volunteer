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
my %rebooters;
while (@brackets ) {
    my $start = shift @brackets;
    my $contents_start = decode_json $start;

    last if !@brackets;
    my $JSON_msg = shift @brackets;
    next if $JSON_msg =~ /start/;
    my %these_IPs;
    my %fitness_sequence;
    my $real_puts = 0;
    my %these_actual_IPs;
    my $puts = 0;
    my $reboots = 0;
    my $last_fitness_by_IP = 0;
    while ( $JSON_msg !~ /solution/ ) {
      if ( $JSON_msg !~ /start/ ) {
	  $puts++;
	  my $msg_start = decode_json $JSON_msg;
	  my $this_IP=$msg_start->{'IP'};
	  if ( $fitness_sequence{$this_IP} ) {
	    $last_fitness_by_IP = shift @{$fitness_sequence{$this_IP}};
	    say "$this_IP, $last_fitness_by_IP, $msg_start->{'fitness'}";
	    if ( $last_fitness_by_IP > $msg_start->{'fitness'} ) {
	      $rebooters{$this_IP}++;
	      $reboots++;
	    }
	    push @{$fitness_sequence{$this_IP}}, ($last_fitness_by_IP,$msg_start->{'fitness'}); # put it back	
	  } else {
	    $fitness_sequence{$msg_start->{'IP'}} = [$msg_start->{'fitness'}];
	  }
	  
	  my $this_ID = $msg_start->{'worker_uuid'}?$msg_start->{'worker_uuid'}:$msg_start->{'IP'};
	  $these_IPs{ $this_ID }++;
	  if ( $msg_start->{'updated'} == 1) {
	      $these_actual_IPs{ $this_ID }++;
	      $real_puts++;
	  }
      }
      last if !@brackets;
      $JSON_msg = shift @brackets;
    }
    if ( $JSON_msg =~ /solution/ ) { #Maybe unpaired
      my $end = $JSON_msg;
      my $contents_end = decode_json $end;
      
      my $duration = $format->parse_datetime( $contents_end->{'timestamp'} ) 
	- $format->parse_datetime( $contents_start->{'timestamp'} );
      push @times, 
	[ scalar keys %these_IPs, 
	  $duration->in_units('minutes')*60000+$duration->in_units('nanoseconds')/1e6, $puts, scalar keys %these_actual_IPs, $real_puts, $reboots ]; #milliseconds
    }
}

#say "IPs,milliseconds,PUTs,actualIPs,actualPUTs,reboots";
say join("\n", map("$_->[0],$_->[1],$_->[2],$_->[3],$_->[4],$_->[5]",@times));
