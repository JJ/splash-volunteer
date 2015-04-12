#!/usr/bin/env Rscript

library(ggplot2)
ips <- read.csv("ips-per-run.dat",header=FALSE)
ggplot(ips, aes(x=V1)) + geom_histogram( position="identity", binwidth=1)
ggsave("ips-per-run.png")
