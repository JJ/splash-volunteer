#!/usr/bin/env perl

use strict;
use warnings;
use v5.16;

use IP::Anonymous;
use Text::CSV::Slurp;
use File::Slurp::Tiny qw(read_lines);

my $file_name = shift || die "Usage: $0 <filename>";
my $key_file_name = shift || "ip.key";

my @data = read_lines($file_name) ;
my @key = read_lines( $key_file_name );

my $anonymizer = new IP::Anonymous(@key);
my %ips;
for my $row ( @data[1..$#data] ) {
  my ($ip, $count) = split(/[\t]/, $row);
  my $anon_ip;
  if ( $ip =~ /,/ ) {
    my @ips = split(/,/, $ip);
    $anon_ip = $anonymizer->anonymize($ips[0]);
  } else {
    $anon_ip = $anonymizer->anonymize($ip);
  }
  $ips{$anon_ip} += $count;
}

say "AnonIP,count";
for my $ip ( sort { $ips{$b} <=> $ips{$a} } keys %ips ) {
  say "$ip,$ips{$ip}";
}


