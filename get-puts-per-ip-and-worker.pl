#!/usr/bin/env perl

use strict;
use warnings;

use v5.14;

use JSON;
use File::Slurp::Tiny qw(read_lines);
use DateTime::Format::RFC3339;
use Digest::MD5 qw(md5_hex);

my $file_name = shift || "log/nodio-2015-7-24-0.log";

my @file_contents = read_lines($file_name);

die "Nothing in that file $file_name" unless @file_contents;

my @puts = grep( /chromosome/, @file_contents);

my %puts;
my $format = DateTime::Format::RFC3339->new();
for my $put (@puts ) {
  my $contents = decode_json $put;
  my $combo = "$contents->{'IP'}:$contents->{'worker_uuid'}";
  $puts{$combo}++;
}

my @intervals;
say "combo,puts";
for my $IP ( sort { $puts{$b} <=> $puts{$a} } keys %puts ) {
    my $hash = md5_hex( $IP );
    say "$hash, $puts{$IP}";
}

