# get-my-temperature
Hey there! This is a really simple project to demonstrate how easily a
Raspberry Pi can be used to serve up IoT style data from sensors, using
a basic Express based HTTP server.

## What do you need to know first?
- JavaScript: All the code is written in JavaScript, mostly using ES2015 syntax.
- Electronics - Basic: You should know how to hook your Pi up to a breadboard, and attach basic devices such as LEDs or sensors.
- HTML: You should know how to build a basic web page. Nothing too big!
- CSS: Again, you should know how to select basic elements, and style them. Nothing fancy!

If you don't know JavaScript or HTML, check out codecademy.com from quick, easy tutorials.

## What don't you need to know?
- HTTP: The workhorse of the internet! This is how webpages and data gets sent  around online.
- Node: This is the JavaScript engine that lets you use JavaScript almost anywhere.
- Express: Building your own web server in Node isn't hard, but it is a little tedious. Express will make it quick and easy. It's similar to Flask, with Python.


## What do you need?
- A Raspberry Pi
- A DHT-22 temperature and humidity Sensor
- Optional: a breadboard.
- Optional: a breakout board with a ribbon cable to connect to your GPIO.

Depending on which specific DHT-22 you get, you may need a different set of cables & resistors. Some come mounted on a circuit board with resistors. You'll see this one in photos in this article: https://www.amazon.co.uk/HALJIA-Digital-Temperature-Humidity-Raspberry/dp/B01N6PB489/

# Introduction & Setup

## Setting your Pi
Let's get your Pi setup first. I'm using a breakout board and breadboard to make it easier to quickly plug in sensors. Great when you're prototyping. You can hook all this up with female-to-female connectors, but the breakout board definitely makes things easier in the long run. 

First, slide the DHT-22 sensor into channels X through X. If your DHT-22 doesn't come mounted onto a circuit board with transistors, you should
look at a resistor of X OHM. <!--Find out colours --> 

# What is Node?
Node basically allows you to run JavaScript code that interfaces with your Pi. You can create anything from handy command line tools, to massive
web applications with millions of users. Yes, even robots. It's one of the fastest growing technologies in the world. 

We need to start by installing Node.js. Instructions for this are available on the Node website. Go to https://nodejs.org/en/download/package-manager/, and look for
"Debian and Ubuntu based Linux distributions". 

Run: 

    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs

Time for your first Node.js app. Okay, now create a file called app.js in your project folder. 

On line one, just add `console.log("Hello, Pi!");`

Go to your terminal while in the project folder, and write `node app.js`. Let's make this more interesting, and start interacting with your Pi.

> Exercise: try creating a variable "temperature", and guess what temperature it is. Add a new console.log that logs this to the console.

## Accessing your DHT-22 in Node
Sensors come in all kinds of types. Some might require a little research before you can write code that can access them. When you get a new 
sensor, you should...

- Check for any device drivers needed by your Pi to access a sensor.
- Find and install any libraries that allow Node to talk with the sensor.

So, to use your DHT-22, Node will need to talk to your Raspberry Pi who then talks with the sensor. But how does your Pi know how to speak to it?
For that, you do need to install another library. Just follow these steps, and you should be fine.

- Download bcm2835 to your downloads folder from here: http://www.airspayce.com/mikem/bcm2835/bcm2835-1.52.tar.gz
- Run the following commands

        tar zxvf bcm2835-1.xx.tar.gz
        cd bcm2835-1.xx
        ./configure
        make
        sudo make check
        sudo make install

- Hit any problems? Let me know in the comments

## Packages & NPM
Node doesn't exactly give you much to work with. The standard library is useful, but small. You'll want to work with libraries written by 
programmers like you who wanted to write code that they and everyone else in the Node community could use to save time in building good software. 
Very often, it's worth finding out if someone else has written something similar to what you want to achieve to save time. 

You install these packages using "npm". It's very similar to PIP in the Python world. First, you initialise your project.  npm then creates a file called `package.json` 
which stores information about your app, including code it depends on. Before you install a new module, check out its page on npmjs.com to see if it's the right fit for
your project. Ideally, it should seem to have a nice amount of downloads, and regular updates. For instance, check out React, a web app UI library
on npmjs.com - https://www.npmjs.com/package/react. Over 250,000 downloads today alone!

- Initialise your project. 
    - Type npm init 
    - Hit enter to skip the questions. 
- Install node-dht-sensor.
    - npm install node-dht-sensor --save
- Add it as a dependency in your app file. 
    - Open up app.js.
    - Add a line above your console.log.
    - Add this to line 1 `const sensor = require('node-dht-sensor');`

This tells Node that this code depends on `node-dht-sensor`, which is stored in a folder called `/node_modules`. After that, you can create a quick shortcut to 
`node-dht-sensor`, which we're calling `sensor`. 

We also need to tell node what GPIO pins to access. For that, we can call `sensor.initialize()`, passing in input as our first argument, and the output as our second. 
Note, the ground pin doesn't actually connect to the GPIO, just to the ground line, and we don't need to tell node this.

We're now ready to access data from the sensor. Store the current temperature in a variable on line 2: `let temperature = sensor.read().temperature.toFixed(2);` 

> Note, we're using `let`, not `const` to initialize the variable, because this value will change, and `const` would make it *immutable* (can't be changed). 
> See these articles on the Mozilla Development Network DN for more info on `let` and `const`
> - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
> - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const

Now, we can tell Node to log a string to the console that tells us the temperature in celcius.

- Add a second console.log. `console.log(`The temperature is ${temperature} celcius`);`;
- Save, and run it again.

> Exercise: try taking this code, and reading the humidity from the sensor. Check the documentation for node-dht-sensor if you get stuck.
> Exercise: Maybe you're an American, and celcius doesn't mean much to you? Try converting celcius to farenheit.
> Exercise for fun and profit: open up a new project, initalise it and try out another popular NPM library called figlet (https://www.npmjs.com/package/figlet)

Awesome! Now we can interact with sensors on the Pi. 

# Your first Express based web server, by express. 

Time to get to work on the web server. We'll start by getting "Express.js", the most popular library for building web server applications in the Node community. 

> Exercise: without peaking below, try to install Express by yourself. Find it on npmjs.com, and take a look at the page to learn more.

So, we start by using `npm install express --save`. This installs Express, and saves it as a dependency in your `package.json` file. Next, we need to add Express 
as a dependency to your `app.js` file, and initialise your Express server. 

First, `require()` express to a variable called `express`. Now, you need to initialise express, which you do by calling `express()` and assigning it to a variable.

It's time to serve up your first web page! For that, we need to take a very quick look at *HTTP*.

## HTTP - The workhorse of the web.

You probably use HTTP hundreds, if not thousands of time every day. Every time you type a website in your browser to ask for a web page, you're using HTTP. But what is it?

HTTP, or *Hyper Text Transfer Protocol* is a set of rules for sending documents over the internet. Your browser starts this with a *request*, asking the server for a *resource* in a certain folder, which we call a *route*. That resource could be a file, an image, a webpage or more. On our site, we're going to make three requests:

- '/' - the index of our page.
- '/getStats' - to request temperature & humidity data.
- '/getCats' - or rather, any other page. This doesn't exist! We need to handle that.

A request has two parts, a header, and a body. The header is a whole bunch of information about the resource you want to access, and you want to access it. Particularly importantly, you need tell the server what you want to do. For this tutorial, we just want to `GET` information from the server. 

Your server then decides how to respond. It sends a *response*, also containing a header and a body. Particularly importantly, the header will indicate whether or not the request can be fulfilled. There's a series of numbers that tell your browser whether it was a success. For now, remember that 200 means "OK", and the famous "404" means that you requested a page or resource that is not available. The body could be the file that was requested, the web page, or even information generated on the server.

Here's a high level blueprint for each of these cycles for each of our request routes.

/ or, the index of the site. Sends HTML.
![/](https://i.imgur.com/Vgtz77y.png)
/getStats, Instead of HTML, this will send the client *JSON*, allowing the page to update the information on the page.
![/getStats](https://i.imgur.com/ZW1GwG5.png)
/getCats, aka someone requested a page that doesn't exist!
![/getCats](https://i.imgur.com/ycLtVnH.png)

> HTTP is a super important topic if you want to build lots of apps for the web. As ever, the Mozilla Developer Network has loads of great info: https://developer.mozilla.org/en-US/docs/Web/HTTP

# Your first page
Phew! That's enough HTTP theory. Let's actually do something with it. Remember I said that your browser is basically asking for a folder on your server. When you make a request to just that address, you're asking for the *root* folder, or '/'. Let's tell your server to send some temperature information over to your browser. Remember I said how the request tells the server what it wants the server to do with the request? I also said that for this tutorial, we just want to `GET` information. 

Express makes this all quite quick. We can actually send temperature data to our browser in just two lines of JavaScript on top of what we've already done.

    `app.get('/', (request, response) => response.send(`Hello! The temperature is ${temperature}c!`));`

Let's break this down. 

First, we tell our Express app that we want to give instructions for a `GET` request. We pass two arguments. First, `'/'` -- our index, as a string. Second, we pass a *callback function*. This is telling Express what do to when that request comes in. In this case, it's super simple. We just want our response to be a single string, with the temperature of our sensor. 

We need just one more line before we can serve up the data now. `app.listen(3000);` This tells Express we want specifically to open up port 3000. We're good to go. Open up your terminal and type `node app.js`. 

If everything is working, you shouldn't see an error message appear, and by going to `localhost:3000`, you should hopefully see "Hello! The temperature is *some value here*c!"

Nice. Kind of boring though isn't it? Let's make a web page for it. 



