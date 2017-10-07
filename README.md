# get-my-temperature
Hey there! This is a really simple project to demonstrate how easily a Raspberry Pi can be used to serve up IoT style data from sensors, using a basic Express based HTTP server.

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

# Setting your Pi
Let's get your Pi setup first. I'm using a breakout board and breadboard to make it easier to quickly plug in sensors. You can hook all this up with female-to-female connectors, but the breakout board definitely makes things easier in the long run when you want to extend or modify this project for new sensors.

Join your DHT22 to the following GPIO pins:
- Positive: 22
- Negative: 12
- Ground: Ground. 

> Note, if your DHT22 doesn't come mounted onto a circuit board with transistors, you should look at a resistor of 4.7K - 10K Ω

Here's a quick diagram made in Fritzing(http://fritzing.org/home/):

![](https://i.imgur.com/TQdW54F.png)

# What is Node?
Node basically allows you to run JavaScript code that interfaces with your Pi. You can create anything from handy command line tools, to massive web applications with millions of users. Yes, even robots. It's one of the fastest growing technologies in the world. 

We need to start by installing Node.js. Instructions for this are available on the Node website. Go to https://nodejs.org/en/download/package-manager/, and look for
"Debian and Ubuntu based Linux distributions". 

Run: 

    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs

Time for your first Node.js app. Create a file called app.js in your project folder. 

On line one, just add `console.log("Hello, Pi!");`

Go to your terminal while in the project folder, and write `node app.js`. Let's make this more interesting, and start interacting with your Pi.

## Accessing your DHT22 in Node
Sensors come in all kinds of types. Some might require a little research before you can write code that can access them. When you get a new 
sensor, you should...

- Check for any device drivers needed by your Pi to access a sensor.
- Find and install any libraries that allow Node to talk with the sensor.

So, to use your DHT22, Node will need to talk to your Raspberry Pi who then talks with the sensor. But how does your Pi know how to speak to it? For that, you do need to install another library. Just follow these steps, and you should be fine.

- Download bcm2835 to your downloads folder from here: http://www.airspayce.com/mikem/bcm2835/bcm2835-1.52.tar.gz
- Run the following commands

        tar zxvf bcm2835-1.xx.tar.gz
        cd bcm2835-1.xx
        ./configure
        make
        sudo make check
        sudo make install

- Hit any problems? Let me know in the comments.

## Packages & NPM
Node doesn't exactly give you much to work with. The standard library is useful, but small. You'll want to work with libraries written by programmers like you who wanted to write code that they and everyone else in the Node community could use to save time in building good software. Very often, it's worth finding out if someone else has written something similar to what you want to achieve to save time. 

You install these packages using "npm". It's very similar to PIP in the Python world. First, you initialise your project.  npm then creates a file called `package.json` which stores information about your app, including code it depends on. Before you install a new module, check out its page on npmjs.com to see if it's the right fit for your project. Ideally, it should seem to have a nice amount of downloads, and regular updates. For instance, check out React, a web app UI library on npmjs.com - https://www.npmjs.com/package/react. Over 250,000 downloads today alone!

Initialise your project. 

    > npm init

Hit enter to skip the questions. Next, install node-dht-sensor.

    > npm install node-dht-sensor --save
    
Create a new file, app.jsNow we add the DHT22 as a dependency in your app.js file. Open up app.js. Add this to line 1 `const sensor = require('node-dht-sensor');` I

This tells Node that this script depends on `node-dht-sensor`, which is stored in a folder called `/node_modules`. After that, you can create a quick shortcut to `node-dht-sensor`, which we're calling `sensor`. 

We also need to tell node what GPIO pins to access. For that, we can call `sensor.initialize()`, passing in input as our first argument, and the output as our second. Note, the ground pin doesn't actually connect to the GPIO, just to the ground line, and we don't need to tell node this.

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

Your complete code so far:

    const sensor = require('node-dht-sensor');

    let temperature = sensor.read().temperature.toFixed(2);

    console.log(`The temperature is ${temperature} celcius.`);

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

# Your first server
Phew! That's enough HTTP theory. Let's actually do something with it. Remember I said that your browser is basically asking for a folder on your server. When you make a request to just that address, you're asking for the *root* folder, or '/'. Let's tell your server to send some temperature information over to your browser. Remember I said how the request tells the server what it wants the server to do with the request? I also said that for this tutorial, we just want to `GET` information. 

## Sending the index page
Express makes this all quite quick. We can actually send temperature data to our browser in just two lines of JavaScript on top of what we've already done.

    app.get('/', (request, response) => response.send(`Hello! The temperature is ${temperature}c!`));

Let's break this down. 

First, we tell our Express app that we want to give instructions for a `GET` request. We pass two arguments. First, `'/'` -- our index, as a string. Second, we pass a *callback function*, with `request` and `response` as arguments. This allows you to access both the `request` and `response` information in your function. In this case, it's super simple. We just want our response to be a single string, with the temperature of our sensor. 

We need just one more line before we can serve up the data now. `app.listen(3000, console.log("App running on port 3000!");` This tells Express we want specifically to open up port 3000. We're good to go. Open up your terminal and type `node app.js`. 

If everything is working, you should see "App running on port 3000!", and by going to `localhost:3000` in your browser, you should hopefully see "Hello! The temperature is *##.#*c!"

Nice. Kind of boring though isn't it? Let's serve up a website instead. Our site is going to be fairly simple: You land on the site, where you have a button you can press to get up-to-date sensor data. If you go to the wrong site, you get a 404, not found page. In the project files, you will see a folder called '/public' - make sure that is in your main project folder. I'm not going to explain the HTML & CSS in this tutorial, but if you've done any HTML & CSS before it should be fairly easy to read.

One of the nice things about Express is that it makes it very easy to set up a server that can handle multiple requests by the browser. When you get to a page, you want your browser to be able to download the CSS files and images that a HTML document links to. This means we want to use one of Express' built in functions, called `static`. 

We do this by telling Express to use `static`, and which folder it should look for. Add this line just below your sensor initialization. First, we need to use one of Node's built in modules, `path`. Require that into a variable called `path` at the top of your `app.js` file. We've made a lot of changes so far, so I'm going to show you the current state of your `app.js` file.

    const path = require('path'),
          express = require('express'),
          sensor = require('node-dht-sensor');

    sensor.initialize(22, 12);

    const app = express();

    app.use(express.static(path.resolve(__dirname, "public")));

    app.get('/', (request, response) => response.send(`Hello! The temperature is ${temperature}c!`));
    
    app.listen(3000);

We want our request to the `index` page to send out web page instead. Change `response.send(`Hello! The temperature is ${temperature}c!`)` to `response.sendFile('index')`. Now, if everything is correct, when you start up your server again, when you go to index you should see our web page. Good job!

## Sending temperature data
We want to send JSON instead of a web page when someone requests `/getStats`. It's a very similar process however. Aside from changing the first argument to `getStats/` the first part is exactly the same:

    app.get('/getStats', (req, res) => {
    
    });
    
We've already stored our temperature and humidity data in the app previously, but we should move them into our function body. This allows them to be updated when a new request comes in.

    app.get('/getStats', (req, res) => {

        let temperature = sensor.read().temperature.toFixed(2);
        let humidity = sensor.read().humidity.toFixed(2);
        
    });
    
Now, instead of our `response.send()` method, we use `response.json()`. Into it, we pass an object with the attributes we want to send to the client. It's as easy as just passing in an object with our two variables separated by a comma. With ES6, you don't need to assign a value to an object attribute if you're passing in a variable.

    // Route: getStats
    app.get('/getStats', (req, res) => {

        let temperature = sensor.read().temperature.toFixed(2);
        let humidity = sensor.read().humidity.toFixed(2);

        res.json({
            temperature,
            humidity
        });

    });

You're ready to see if it works. Launch your server as usual, and visit `localhost:3000/getStats`. Instead of a page, you should see
{"temperature" : "##.#", "humidity" : "##.#"}

When you visit your home page. You'll probably notice that clicking on the button doesn't actually do anything yet. That's because we've only created our backend logic. Let's quickly add a route to handle unknown requests, then get back to this.

## Handling requests to pages that don't exist in your server
What if someone tries to visit a page that doesn't exist on your server? This is where the famous "404" code comes in. We've already prepared a 404 page in our public folder, but currently Express doesn't know when to send it. We can fix this with just one line of code.

    app.use((req, res) => res.status(404).sendFile(`${__dirname}/public/404.html`));
    
Here, we're actually using something called *middleware* instead of Express' `.get()` method. Like `express.get()`, we pass `express.use()` a callback function. You pass a request and a response as normal, but also a `next` parameter. This is always the next piece of middleware that will be called after this one. Don't worry too much about it here, we don't need to know anything further about it aside from the fact it is needed for this function declaration.

Our callback function body in this case uses the response.status() method. You pass a standard HTTP response message, in this case 404 indicating what to do if the page isn't found. We chain the `.sendFile()` method, passing in the absolute path of the 404.html file. Unlike when using a `get()` function, in this case we can't use the static path that we used for our index page.

From now on, you should see our 404 page if you visit anywhere but `/` or `/getStats` on `localhost:3000`.

Congratulations! You've actually finished your server. 

# The front-end JavaScript
Remember that our button doesn't do anything? It's time to write a small front-end script.

## Event handling
Start by creating a new file called `main.js` in your `public` folder. 

The first thing you want to do is to make sure that the script doesn't execute until the page has fully loaded. Add these lines:    

    window.onload = () => {
    
    };
    
Everything you write now should come between those curly braces.

What do we want to do? Well, when someone presses the button, the `<h1>` element should tell us the new temperature & humidity information. Let's make a reference to the `<h1>` element so we can quickly access it in future.

    const $h1 = document.querySelector("h1");

JavaScript on the front end is all about *event handling*. The user does *something*, which triggers an event, which is controlled by a callback function. In this case, our event is the user pressing the button that reads "Get Stats!". So, let's add an event listener to it.

     document.querySelector(".pure-form").addEventListener("submit", e => {

     });

We're selecting our `.pure-form` HTML element, and adding an event (`e`) when someone submits the form. Everything between these next curly braces is our event handler function. 

The first thing we want to do is prevent the default event when the event triggers: this is to submit the form to the server. This isn't quite what we want. So, we call `preventDefault()` on `e`. 

Next, with web apps, you always want to give the user some kind of feedback that you've at least triggered what they wanted. In this case, I'm just going to select our `<h1>` element, and set its text to "Loading...";

## Making a promise you'll handle something!

Now, here comes the fun bit. We're going to use a *promise*. A promise is basically a sequence of actions we want the script to take once certain conditions are met. They come in various forms, and in this case we're using the built in browser promise called `fetch()`.

> Read more about it on MDN here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

We want to tell it to fetch data from '/getStats', which if you remember from our diagram earlier is going to send JSON, not a web page. When we get the data back from our server, it gets returned to the promise, where you `then` do something with it. Yup! You chain `.then()` onto the end of your `fetch('/getStats')` function. After that, the `then()` function actually returns *another* promise, where you `then()` do something else. 

Something like this:
![A promise chain](https://i.imgur.com/SsS7tKu.png)

Or:

    Fetch Data > 
    Convert Data to JSON > 
    Change Element based on JSON. 

You'll do a lot of this in front-end JavaScript! In fact, the pseudo-code is very similar to the actual code in this case. 

    fetch('/getStats')
        .then(data => data.json())
        .then(json => $h1.textContent = `
        The temperature is ${json.temperature}c.
        The humidity is ${json.humidity}%.`); 
        
And that's your front-end code! Here's the whole sample again, in case you missed anything.

    window.onload = () => {
        const $h1 = document.querySelector("h1")

        document.querySelector(".pure-form").addEventListener("submit", e => {
            e.preventDefault();
            $h1.innerText = "Loading...";
            fetch('/getStats')
                .then(data => data.json())
                .then(json => $h1.textContent = `
                The temperature is ${json.temperature}c.
                The humidity is ${json.humidity}%.`); 
        });
    };

# Summary
So there you have it! We've built a simple web server that serves up both HTML pages and JSON. It pulls data from our Pi's DHT22 temperature and humidity sensor, allowing you to give instant updates to anyone who visits the page.

The point of this project has been to give you a start in knowing how to serve up your Pi's data to web browsers. There's plenty of directions you could take this in, such as adding new sensors, adding storage of data, as well as expanding the web page to take advantage of additions to your server. Here's just a few ideas for where you could go next:

- Store your data as a record, allowing you to track temperature changes over time.
- Use D3.js to present long term changes in temperature in graphical format.
- Add alternative sensors, such as rain sensors.
- Explore HTTP POST requests, to send information from the client page to your PI - such as turning an LED on and off.
- Explore middleware more, to build more complex servers. To start with, try adding the `morgan` logging library, to learn more about HTTP through seeing requests come in on the server.
- Learn to use templating in Express using Pug or EJS so you can create generated HTML pages, letting you build new pages out of templates and injecting new data instead of hand crafting each page.
