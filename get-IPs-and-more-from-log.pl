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
my %PUTs_by_IP;
my %IPs_per_minute;
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
	  my $this_ID = $msg_start->{'worker_uuid'}?$msg_start->{'worker_uuid'}:$msg_start->{'IP'};
	  my ($minute) = ( $msg_start->{'timestamp'} =~ /(.+T\d+:\d+)/);
	  $IPs_per_minute{$minute}{$this_ID}++;
	  if ( $fitness_sequence{$this_ID} ) {
	    $last_fitness_by_IP = pop @{$fitness_sequence{$this_ID}};
#	    say "$this_ID, $last_fitness_by_IP, $msg_start->{'fitness'}";
	    if ( $last_fitness_by_IP > ($msg_start->{'fitness'} + 10 ) ) {
	      $rebooters{$this_ID}++;
	      $reboots++;
	    }
	    push @{$fitness_sequence{$this_ID}}, ($last_fitness_by_IP,$msg_start->{'fitness'}); # put it back	
	  } else {
	    $fitness_sequence{$msg_start->{'IP'}} = [$msg_start->{'fitness'}];
	  }
	  $these_IPs{ $this_ID }++;
	  $PUTs_by_IP{ $this_ID }++;
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

my ($root_file) = ($file_name =~ /(.+)\.log/);
open (my $file_by_exp, ">" ,$root_file."_by_exp.csv") || die "Can't open: $!";
say $file_by_exp "IPs,milliseconds,PUTs,actualIPs,actualPUTs,reboots";
say $file_by_exp join("\n", map("$_->[0],$_->[1],$_->[2],$_->[3],$_->[4],$_->[5]",@times));
close $file_by_exp;

open (my $file_by_IP, ">" , $root_file."_by_IP.csv" )|| die "Can't open: $!";
say $file_by_IP "PUTs,reboots";
for my $ip ( sort { $PUTs_by_IP{$b} <=>$ PUTs_by_IP{$a} } keys %PUTs_by_IP) {
    say $file_by_IP "$PUTs_by_IP{$ip},",$rebooters{$ip} || 0;
}
close $file_by_IP;

open (my $file_per_minute, ">" , $root_file."_per_minute.csv" )|| die "Can't open: $!";
say $file_per_minute "time,IPs";
for my $m ( sort { $a cmp $b } keys %IPs_per_minute) {
    say $file_per_minute "$m,", scalar keys %{$IPs_per_minute{$m}} || 0;
}
close $file_by_IP;
