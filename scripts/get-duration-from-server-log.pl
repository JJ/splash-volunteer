#!/usr/bin/env perl

use strict;
use warnings;

use v5.14;

use JSON;
use File::Slurp::Tiny qw(read_lines);
use DateTime::Format::Strptime;

my $file_name = shift || "log/50runs-server.log";

my @file_contents = read_lines($file_name);

die "Nothing in that file $file_name" unless @file_contents;

my @marks = grep( /(start=0|solution=)/, @file_contents);

my @intervals;
my $f = DateTime::Format::Strptime->new(pattern   => '%T',
					     locale    => 'es_es',
					     time_zone => 'Europe/Madrid');
while (@marks ) {
  my $start_str = shift @marks;
  my $end_str = shift @marks;
  next if $end_str =~ /start/;

  my ($start) = ($start_str =~ /(\d{2}:\d{2}:\d{2}) /);
  my ($end) = ($end_str =~ /(\d{2}:\d{2}:\d{2}) /);
  my $interval = $f->parse_datetime($end)-$f->parse_datetime($start);
  push @intervals, $interval->seconds;
}
say join("\n", @intervals);
