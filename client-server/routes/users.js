const express = require('express');
const assert = require('assert');
const restify = require('restify-clients');
const router = express.Router();

/* Configurações Restify */
const serverUrl = 'http://localhost:4000';

// Creates a JSON client
let client = restify.createJsonClient({
  url: serverUrl
});

/* Rotas */
/* GET users listing. */
router.get('/', function(req, res, next) {
  client.get('/users', function(err, request, response, obj) {
    assert.ifError(err);
  
    res.end(JSON.stringify(obj, null, 2));
  });
});

module.exports = router;
