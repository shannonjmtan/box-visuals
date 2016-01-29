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

var Box = function() {};

Box.prototype.client_id = function() {
    return client_id;
};

Box.prototype.client_secret = function() {
    return client_secret;
}

Box.prototype.accessToken = function () {
    var token = tokenRef.access_token;
    if (!access_token) {
        return null;
    }
};

Box.prototype.tokensFromCode = function (code) {

    unirest.post("https://api.box.com/oauth2/token")
    .send({
        "grant_type": "authorization_code",
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret
    }).end(function(response) {
        tokenRef.set({
            'access_token' : response.body.access_token,
            'refresh_token': response.body.refresh_token
        });
        return true;
    });

    return false;
};

Box.prototype.root = function() {
    var boxRoot = new boxFolder('0');
    return boxRoot;
}

module.exports = Box;
