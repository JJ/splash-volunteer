#!/bin/bash

foreman start web &
for i in {1..50}; do
    ( cd client; ./client-ea.js )
done
