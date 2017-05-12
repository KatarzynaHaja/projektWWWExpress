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
var fileUpload = require('express-fileupload');
app.use(fileUpload());
require('./routers/register.js')(app);
require('./routers/login.js')(app);
require('./routers/product.js')(app);
require('./routers/deleteuser.js')(app);
require('./routers/addrights.js')(app);
require('./routers/showproduct.js')(app);
require('./routers/comment.js')(app);
require('./routers/mark.js')(app);



app.use(express.static(__dirname + '/image'));

app.get('/', function (req, res) {
    res.render('main');
});


app.get('/panel', function (req, res) {
    if (req.session.role == undefined)
    {
        res.render('401');
    }
    else
    {
        if(req.session.role =='user')
        {
            res.render('403');
        }
        else
        {
            res.render('panel');
        }
    }

});
app.get('/user', function (req, res) {
    if (req.session.role == undefined)
    {
        res.status(401).send("Nie jesteś zalogowany")
    }
    else
    {
        var products = function(db,callback) {
            db.collection('products').find().toArray(function (err, results) {
                return callback(results);
            });

        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            products(db,function(array) {
                db.close();
                console.log(array);
                res.render("user", {variable:req.session.role, form: array});
            });
        });

    }

});

app.post('/user',function(req,res)
{
    delete req.session.username;
    delete req.session.role;
    res.redirect('/');
});

app.use(function(req, res) {
    res.status(404).render("404");
});

app.use(function(req, res) {
    res.status(403).render("403");
});

app.use(function(req, res) {
    res.status(401).render("401");
});


http.createServer(app).listen(3000, function() {
    console.log("Dziala");
});