// Dependencies
var express = require('express');
var unirest = require('unirest');
var Firebase = require('firebase');
var nodemailer = require('nodemailer');
var boxFolder = require('../controllers/boxFolder');
var boxRequest = require('../controllers/boxRequest');

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


var Box = function() {};

Box.prototype.client_id = function() {
    return client_id;
};

Box.prototype.client_secret = function() {
    return client_secret;
}

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

Box.prototype.tokensFromRefreshToken = function (refresh_token) {

    unirest.post("https://api.box.com/oauth2/token")
    .send({
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
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

Box.prototype.sendUserEmailUponProvisioning = function() {
    setInterval(newUserEventCall, 1000);
}

var newUserEventCall = function() {
    var eventsUrl = "https://api.box.com/2.0/events?stream_type=admin_logs&limit=500&stream_position="+stream_position+"&event_type=NEW_USER";

    var eventsCall = new boxRequest("GET", eventsUrl);

    eventsCall.send(function(response) {
        events = response.body;
        console.log(events);
        stream_position = events.next_stream_position;
        new_users = events.entries;
        for (var i = 0; i < events.chunk_size; i++) {
            var new_user_email = new_users[i].source.login;
            var new_user_name = new_users[i].source.name;
            sendUserEmail(new_user_name, new_user_email);
        }
    });
}

var sendUserEmail = function(userName, userEmail) {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtps://shannon.tan1994%40gmail.com:jtqcrasnsdljasgf@smtp.gmail.com');

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: userName + '<' + userEmail + '>', // sender address
        to: 'shannontan@box.com', // list of receivers
        subject: 'WELCOME TO BOX BITCH', // Subject line
        text: 'WELCOME TO BOX BITCH', // plaintext body
        html: '<b>WELCOME TO BOX BITCH X 2</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports = Box;
