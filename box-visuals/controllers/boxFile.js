// Dependencies
var express = require('express');
var unirest = require('unirest');
var Firebase = require('firebase');
var BoxItem = require('../controllers/boxItem');

BoxFile = function(file_id) {
    BoxItem.call(this, file_id, 'file');
};
BoxFile.prototype = Object.create(BoxItem.prototype);
BoxFile.prototype.constructor = BoxFile;

// Box API Functions

BoxFile.prototype.info = function(callback) {
    var url = "https://api.box.com/2.0/files/"+this.id;

    var boxRequest = new BoxRequest("GET", url);

    boxRequest.send(function(response) {
        var info = response.body;
        callback(info);
    });
};

BoxFile.prototype.parent = function(callback) {
    var url = "https://api.box.com/2.0/files/"+this.id;

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

module.exports = BoxFile;
