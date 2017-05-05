var express = require('express');
var fs = require('fs');
var http = require('http')
var app = express();
var logger = require("morgan");
var path = require("path");
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


app.get('/', function (req, res) {
    res.render('main');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.post('/',function(req,res)
{
    res.redirect('register');
});
app.post('/register',function(req,res)
{
   var username = req.body.login;
   var password = req.body.password;
    var insertDocument = function(db, callback) {
        db.collection('users').insertOne({"username": username, "password":password},function(err, result) {
            assert.equal(err, null);
            callback();
        });
    };
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, function() {
            db.close();
        });
    });

    res.redirect('login');

});

app.get('/register', function (req, res) {
    res.render('register');
});

http.createServer(app).listen(3000, function() {
    console.log("Dziala");
});