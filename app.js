var express = require('express');
var fs = require('fs');
var http = require('http')
var app = express();
var logger = require("morgan");
var path = require("path");
var session = require('express-session')
app.use(session({secret: 'ssshhhhh'}));
var bodyParser = require("body-parser");
app.set("views", path.resolve(__dirname, "views")); //podkatalog views
app.set("view engine", "pug");
app.use(logger("dev"));   //midlewearstack
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }));  //odkodowuje formularz


app.get('/', function (req, res) {
    res.render('login');
})

app.get('/register', function (req, res) {
    res.render('register');
})

http.createServer(app).listen(3000, function() {
    console.log("Dziala");
});