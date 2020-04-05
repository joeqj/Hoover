# Hoover

A web based interactive project using pixi.js and tone.js.

## Documentation

Whilst building a sound design portfolio me and Julian joked around about the idea of a fun little interactive web page where you simply hoover things up.

We were mainly confined indoors with the COVID-19 lockdown so had lots of time to work on off grid. With time to kill I actually started to work on this project as a trivial little project to improve my skills and just have a laugh. It is such a refreshing change from the day job.

I started out using [cables](https://cables.gl) however this was not capable of the task in hand. Interactivity in cables is very basic. I decided to therefore give pixi.js a go as it seemed well orientated toward 2d rendering. I was shocked how quick easy it was to learn and start implementing ideas. Compared to past experiences in three.js this was a walk in the park.

I had the idea for it to have an 8 bit aesthetic and started looking into pixel art. I stumbled across a hilarious website:

https://www.vacuumland.org/cgi-bin/TD/TD-VIEWTHREAD.cgi?22023

Which had a perfect 8 bit vacuum cleaner PNG for me to use. The guy who made the post was also called Joe and based in Leeds - very serendipitous.

The sound of the vacuum is completely synthesised using tone.js and is simply a sine wave and white noise ran through a filter. At first i didn't think this would work but it seems to be more flexible than using granular synthesis with a sample of a hoover.
