// Dependencies
var express = require('express');
var unirest = require('unirest');
var Firebase = require('firebase');
var BoxItem = require('../controllers/boxItem');
var BoxFile = require('../controllers/boxFile');

// Box Specific Information
var client_id = "q6t4xk2n5874oms1ulx1h5xif1duh4bc";
var client_secret = "Skh6YLUAIR9wKhnvIvECBr1fYPeZNujg";

// Firebase
var db = new Firebase('https://scorching-heat-3429.firebaseio.com/');
var boxRef = db.child('box');
var tokenRef = boxRef.child(client_id);

BoxFolder = function(folder_id) {

    BoxItem.call(this, folder_id, 'folder');

};

BoxFolder.prototype = Object.create(BoxItem.prototype);
BoxFolder.prototype.constructor = BoxFolder;

// Box API Functions

BoxFolder.prototype.info = function(callback) {
    var url = "https://api.box.com/2.0/folders/"+this.id;

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

BoxFolder.prototype.children = function(callback) {
    var folder_items;
    var url = "https://api.box.com/2.0/folders/"+this.id+"/items";

    tokenRef.once('value', function(data) {
        unirest.get(url)
        .headers({
            "Authorization": "Bearer " + data.child('access_token').val(),
        }).end(function(response) {
            var folder_items = response.body;
            folder_items.entries = folder_items.entries.map(function(entry) {
                if (entry.type == 'folder') {
                    var boxChild = new BoxFolder(entry.id);
                    return boxChild;
                } else {
                    var boxChild = new BoxFile(entry.id);
                    return boxChild;
                }
            });
            if(callback) {
                callback(folder_items);
            } else {
                return folder_items;
            }
        });
    });
};

BoxFolder.prototype.parent = function(callback) {
    var url = "https://api.box.com/2.0/folders/"+this.id;

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

module.exports = BoxFolder;
