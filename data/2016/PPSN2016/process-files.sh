#!/bin/bash


for file in "nodio-2016-3-8-0.log" "nodio-2016-3-3-0.log" "nodio-2016-3-2-cache=32-nooverlap-newgraph.log" "nodio-2016-3-1-cache=32-nooverlap.log" "nodio-2016-3-1-cache=32-nooverlap-newgraph.log"
do
    echo $file
    ../../get-IPs-and-more-from-log.pl $file

done


