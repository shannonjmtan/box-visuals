var express = require('express');
var router = express.Router();
var unirest = require('unirest');

// Box Specific Information
var client_id = "q6t4xk2n5874oms1ulx1h5xif1duh4bc";
var client_secret = "Skh6YLUAIR9wKhnvIvECBr1fYPeZNujg";
var access_token;
var refresh_token;

/* GET Box OAUTH Leg 1 */
router.get('/', function(req, res, next) {
  res.redirect("https://app.box.com/api/oauth2/authorize?response_type=code&client_id="+client_id+"&state=security_token%3DKnhMJatFipTAnM0nHlZA")
});

/* GET Box Tokens */
router.get('/code', function(req, res, next) {
  var code = req.query.code;

  unirest.post("https://api.box.com/oauth2/token")
    .send({
      "grant_type": "authorization_code",
      "code": code,
      "client_id": client_id,
      "client_secret": client_secret
    }).end(function(response) {
      console.log(response);
      access_token = response.body.access_token;
      refresh_token = response.body.refresh_token;
      res.redirect('/box/root');
    });
});

/* GET Box Folders */
router.get('/root', function(req, res, next) {
    res.render('box');
});

router.get('/rootfolders', function(req, res, next) {
  var folder_items;
  unirest.get("https://api.box.com/2.0/folders/0/items")
    .headers({
      "Authorization": "Bearer " + access_token
    }).end(function(response) {
      folder_items = response.body;
      folder_items = changeEntriesToChildren(folder_items);
      console.log(folder_items);
      res.send(folder_items);
  });
});

router.get('/folder_items', function(req, res, next) {
  var folder_items;
  var url = "https://api.box.com/2.0/folders/"+req.body.folder_id+"/items";

  unirest.get(url)
    .headers({
      "Authorization": "Bearer " + access_token
    }).end(function(response) {
      folder_items = response.body;
    });

});

function changeEntriesToChildren(folder_items) {
  folder_items.children = folder_items.entries;
  delete folder_items.entries;
  delete folder_items.offset;
  delete folder_items.limit;
  delete folder_items.order;
  folder_items.name = "All Files";
  folder_items.id = "0";

  return folder_items;
}

module.exports = router;
