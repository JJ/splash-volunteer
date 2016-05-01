# Single page volunteer computing platform

Splash page for PaaS based volunteer computing experiments.

# How to run
```
npm install
node index.js
```

If you want to use a Telegram channel, you need to add two environment variables:
* CHANNELID: your channel ID in "@mycoolchannel" format
* TOKENBOT: your bot token


# How to create a new experiment

If you want to create your own experiment, you have to modify:


* **splash-volunteer/is_solution.js**: in this file you have to write a function to decide if the sent chromosome is a solution.
* **splash-volunteer/public/js/trap.standalone.js**: here you have an example with the "trap function". You will need create a function to decide what is the fitness of a individual. To do this, you will have to sustitute ```[YOUR FUNCTION]``` text with the name of your function (or use an anonymous function instead):
```javascript
var eo = new Classic( { population_size: population_size,
        chromosome_size: chromosome_size,
        fitness_func: [YOUR FUNCTION] } );
```



# Badges

[![Coverage Status](https://coveralls.io/repos/github/JJ/splash-volunteer/badge.svg?branch=master)](https://coveralls.io/github/JJ/splash-volunteer?branch=master) [![Build Status](https://travis-ci.org/JJ/splash-volunteer.svg?branch=master)](https://travis-ci.org/JJ/splash-volunteer)

## Experimental data

Data files are in the
[`data`](https://github.com/JJ/splash-volunteer/tree/data) branch,
divided by experiment sets.
