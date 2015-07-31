library(ggplot2)

duration.df <- data.frame(population=c(rep("512",length(baseline.duration$V1)),rep("1024",length(duration.1k$V1))),times=c(baseline.duration$V1,duration.1k$V1))
ggplot(duration.df,aes(x=population,y=times))+geom_boxplot(notch=T)
