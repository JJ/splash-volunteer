#!/bin/bash


for i in {1..50}; do
    foreman start web >> server.log &
    ( cd client; ./client-ea.js ) && killall node 
done
