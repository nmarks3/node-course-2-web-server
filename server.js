const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.port || 3000;
var app = express();

// setup partials !! MIDDLEWARE !!
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// how to use a maintenance page!!
app.use((req, res, next) => {
    res.render('maintenance.hbs');
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Welcome Page',
        welcomeMessage: 'Welcome to the website!!'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'unable to handle request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});