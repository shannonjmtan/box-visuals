// Dependencies
var express = require('express');
var unirest = require('unirest');
var Firebase = require('firebase');

// Box Specific Information
var client_id = "q6t4xk2n5874oms1ulx1h5xif1duh4bc";
var client_secret = "Skh6YLUAIR9wKhnvIvECBr1fYPeZNujg";

// Firebase
var db = new Firebase('https://scorching-heat-3429.firebaseio.com/');
var boxRef = db.child('box');
var tokenRef = boxRef.child(client_id);

var boxItem = function(id, type) {
    this.id = id;
    this.type = type;
};

module.exports = boxItem;
