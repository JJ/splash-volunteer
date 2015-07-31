ggplot(ips, aes(x=reorder(combo,-puts),y=puts)) + geom_point(stat='identity') + scale_y_log10()

