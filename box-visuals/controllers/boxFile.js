// Dependencies
var express = require('express');
var unirest = require('unirest');
var Firebase = require('firebase');
var BoxItem = require('../controllers/boxItem');

// Box Specific Information
var client_id = "q6t4xk2n5874oms1ulx1h5xif1duh4bc";
var client_secret = "Skh6YLUAIR9wKhnvIvECBr1fYPeZNujg";

// Firebase
var db = new Firebase('https://scorching-heat-3429.firebaseio.com/');
var boxRef = db.child('box');
var tokenRef = boxRef.child(client_id);

BoxFile = function(file_id) {
    BoxItem.call(this, file_id, 'file');
};

BoxFile.prototype = Object.create(BoxItem.prototype);
BoxFile.prototype.constructor = BoxFile;

BoxFile.prototype.info = function(callback) {
    var url = "https://api.box.com/2.0/files/"+this.id;

    tokenRef.once('value', function(data) {
        unirest.get(url)
        .headers({
            "Authorization": "Bearer " + data.child('access_token').val(),
        }).end(function(response) {
            var info = response.body;
            console.log(response);
            callback(info);
        });
    });
};

BoxFile.prototype.parent = function(callback) {
    var url = "https://api.box.com/2.0/files/"+this.id;

    tokenRef.once('value', function(data) {
        unirest.get(url)
        .headers({
            "Authorization": "Bearer " + data.child('access_token').val(),
        }).end(function(response) {
            var info = response.body;
            var parentId = info.parent.id;
            if(parentId) {
                var parentFolder = new BoxFolder(parentId);
                callback(parentFolder);
            } else {
                callback(null);
            }
        });
    });
};

module.exports = BoxFile;
