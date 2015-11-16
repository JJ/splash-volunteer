library(ggplot2)

duration.df <- data.frame(population=c(rep("512",length(baseline.duration$V1)),rep("1024",length(duration.1k$V1))),times=c(baseline.duration$V1,duration.1k$V1))

ggplot(duration.df,aes(x=population,y=times))+geom_boxplot(notch=T)+scale_y_log10()+theme(axis.text=element_text(size=16), axis.title=element_text(size=18,face="bold"))
ggsave("baseline-times.png",width=4,height=3)
