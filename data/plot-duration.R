library(ggplot2)

baseline.duration <- read.table('baseline-duration.dat')
baseline.duration.df <- data.frame(x=seq(1:length(baseline.duration$V1)),seconds=sort(baseline.duration$V1,decreasing=T))
ggplot(baseline.duration.df,aes(x=x,y=seconds))+geom_bar(stat='Identity')
duration.1k.df <- data.frame(x=seq(1:length(duration.1k$V1)),seconds=sort(duration.1k$V1,decreasing=T))
ggplot(duration.1k.df,aes(x=x,y=seconds))+geom_bar(stat='Identity')
