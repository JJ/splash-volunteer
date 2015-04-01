library(ggplot2)
trap.base.times.no.restart <- read.csv("50runs-norestart.dat",header=FALSE)
trap.base.times.restart <- read.csv("50runs.dat",header=FALSE)

trap.base <- data.frame( restart=c(rep('Y',length(trap.base.times.restart$V1)),rep('N',length(trap.base.times.no.restart$V1))),
                        times=c(trap.base.times.restart$V1,trap.base.times.no.restart$V1) )
ggplot(trap.base, aes(x=times, fill=restart)) + geom_histogram(alpha=0.2, position="identity")
