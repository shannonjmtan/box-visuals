// Dependencies
var express = require('express');
var unirest = require('unirest');
var Firebase = require('firebase');
var boxFolder = require('../controllers/boxFolder');

// Box Specific Information
var client_id = "q6t4xk2n5874oms1ulx1h5xif1duh4bc";
var client_secret = "Skh6YLUAIR9wKhnvIvECBr1fYPeZNujg";

// Firebase
var db = new Firebase('https://scorching-heat-3429.firebaseio.com/');
var boxRef = db.child('box');
var tokenRef = boxRef.child(client_id);

// Static Variables
var access_token;
var stream_position = 0;
var access_tokenRef = tokenRef.child('access_token').on('value', function(token) { access_token = token.val(); });

BoxRequest = function(verb, url) {
    if (verb == "GET" || verb == "POST" || verb == "DELETE" || verb == "PUT")
        this.verb = verb;
    else {
        console.log("Error: Verb Not Correct");
        return;
    }

    this.url = url;
};

BoxRequest.prototype.fields = function(fields) {
    this.fields = fields;
};

BoxRequest.prototype.send = function(callback) {

    if(this.verb == null) {
        console.log("Error: Verb Not Specified");
        return;
    }

    if(this.url == null) {
        console.log("Error: URL Not Specified");
    }

    var Request;

    switch (this.verb) {
        case "GET":
            Request = unirest.get(this.url);
            break;
        case "POST":
            Request = unirest.post(this.url);
            break;
        case "PUT":
            Request = unirest.put(this.url);
            break;
        case "DELETE":
            Request = unirest.delete(this.url);
            break;
        default:
            console.log("Error: Verb Not Allowed");
            return;
    }

    Request.headers({
        "Authorization": "Bearer " + access_token
    });

    Request.end(function(response) {
        callback(response);
    });

}

module.exports = BoxRequest;
