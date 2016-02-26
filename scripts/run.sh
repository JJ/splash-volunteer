#!/bin/bash


for i in {1..50}; do
    foreman start web >> server-1k.log &
    ( cd client; ./client-ea.js nodeo-p1k.json ) && killall node 
done
