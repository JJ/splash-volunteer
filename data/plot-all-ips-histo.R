#!/usr/bin/env Rscript

library(ggplot2)
ips <- read.csv("cartones-exp-1.csv")
ggplot(ips, aes(x=reorder(IP,-puts),y=puts)) + geom_point()
ggsave("all-ips.png")
