#!/bin/bash


for i in {1..50}; do
    foreman start web & pid=$! && echo $pid
    ( cd client; ./client-ea.js ) && kill $pid 
done
