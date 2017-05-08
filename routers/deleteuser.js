var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
var assert = require('assert');

module.exports =function(app) {
    app.get('/deleteuser', function(req, res){
        var searchUsers = function(db,callback) {
            db.collection('users').find({"role": "user"}).toArray(function (err, results) {
                return callback(results);
            });

        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            searchUsers(db,function(array) {
                db.close();
                res.render("delete_user", {form: array});
            });
        });


    });
    app.post('/deleteuser', function(req, res){
        var deleteUsers = function(db,callback) {
            if(req.body.user){
                if(Array.isArray(req.body.user)){
                    for(var i=0; i< req.body.user.length; i++){
                        db.collection('users').findOneAndDelete({"username": req.body.user[i]});
                    }
                }else{
                    db.collection('users').findOneAndDelete({"username": req.body.user})
                }
            }
            res.redirect("/panel");
        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            deleteUsers(db,function() {
                db.close();
            });
        });
    });
};