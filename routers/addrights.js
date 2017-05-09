var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
var assert = require('assert');

module.exports =function(app) {
    app.get('/addrights', function(req, res){
        var searchUsers = function(db,callback) {
            db.collection('users').find({"role": "user"}).toArray(function (err, results) {
                return callback(results);
            });

        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            searchUsers(db,function(array) {
                db.close();
                res.render("add_rights", {form: array});
            });
        });

    });
    app.post('/addrights', function(req, res){
        var addRights = function(db,callback) {
            if(req.body.user){
                if(Array.isArray(req.body.user)){
                    for(var i=0; i< req.body.user.length; i++){
                        db.collection('users').update({"username": req.body.user[i]}, {$set: {"role": "admin"}});
                    }
                }else{
                    db.collection('users').update({"username": req.body.user}, {$set: {"role": "admin"}});
                }
            }
            res.redirect("/panel");
        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            addRights(db,function() {
                db.close();
            });
        });
    });
};
