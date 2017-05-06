var express = require('express');
var fs = require('fs');
var http = require('http')
var app = express();
var logger = require("morgan");
var path = require("path");
var router = express.Router();
var session = require('express-session')
app.use(session({secret: 'ssshhhhh', resave: false,
    saveUninitialized: true}));
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
MongoClient.connect('mongodb://localhost:27017/products', function (err, db) {
    if (err) throw err
});
app.set("views", path.resolve(__dirname, "views")); //podkatalog views
app.set("view engine", "pug");
app.use(logger("dev"));   //midlewearstack
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }));  //odkodowuje formularz
require('./routers/register.js')(app);
require('./routers/login.js')(app);


app.get('/', function (req, res) {
    res.render('main');
});
app.get('/user', function (req, res) {
    res.render('user');
});

app.post('/',function(req,res)
{
    res.redirect('register');
});

http.createServer(app).listen(3000, function() {
    console.log("Dziala");
});