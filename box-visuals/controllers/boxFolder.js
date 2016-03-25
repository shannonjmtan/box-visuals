// Dependencies
var express = require('express');
var unirest = require('unirest');
var Firebase = require('firebase');
var BoxItem = require('../controllers/boxItem');
var BoxFile = require('../controllers/boxFile');
var BoxRequest = require('../controllers/BoxRequest');

BoxFolder = function(folder_id) {
    BoxItem.call(this, folder_id, 'folder');
};
BoxFolder.prototype = Object.create(BoxItem.prototype);
BoxFolder.prototype.constructor = BoxFolder;

// Box API Functions

BoxFolder.prototype.info = function(callback) {
    var url = "https://api.box.com/2.0/folders/"+this.id;

    var boxRequest = new BoxRequest("GET", url);

    boxRequest.send(function(response) {
        var info = response.body;
        callback(info);
    });
};

BoxFolder.prototype.children = function(callback) {
    var folder_items;
    var url = "https://api.box.com/2.0/folders/"+this.id+"/items";

    var boxRequest = new BoxRequest("GET", url);

    boxRequest.send(function(response) {
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
};

BoxFolder.prototype.parent = function(callback) {
    var url = "https://api.box.com/2.0/folders/"+this.id;

    var boxRequest = new BoxRequest("GET", url);

    boxRequest.send(function(response) {
        var info = response.body;
        var parentId = info.parent.id;
        if(parentId) {
            var parentFolder = new BoxFolder(parentId);
            callback(parentFolder);
        } else {
            callback(null);
        }
    });

};

module.exports = BoxFolder;
