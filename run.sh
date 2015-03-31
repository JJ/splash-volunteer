#!/bin/bash


for i in {1..3}; do
    foreman start web &
    cd client; ./client-ea.js && killall node 
done
