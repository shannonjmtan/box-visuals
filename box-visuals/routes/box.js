var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var jsonfile = require('jsonfile');
var Box = require('../controllers/box');
var boxFolder = require('../controllers/boxFolder');

var box = new Box();
var boxRoot = box.root();

/* GET Box OAUTH Leg 1 */
router.get('/', function(req, res, next) {
    res.redirect("https://app.box.com/api/oauth2/authorize?response_type=code&client_id="+box.client_id()+"&state=security_token%3DKnhMJatFipTAnM0nHlZA")
});

/* GET Box Tokens */
router.get('/code', function(req, res, next) {
    var code = req.query.code;
    console.log('hello');
    var newTokens = box.tokensFromCode(code);
    res.send('box/root');
});

/* GET Box Folders */
router.get('/rootvisual', function(req, res, next) {
    res.render('box');
});

router.get('/root', function(req, res, next) {
    console.log(boxRoot);
    res.send(boxRoot);
});

router.get('/folder_items', function(req, res, next) {
    boxRoot.children(function(children) {
        console.log(children);
        children.entries.forEach(function(entry) {
            if(entry.type == 'file') {
                entry.parent(function(parent) {
                    console.log(parent);
                });
            }
        });
        res.send(children);
    });
});

module.exports = router;
