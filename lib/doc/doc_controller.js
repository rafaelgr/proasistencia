/*
 * doc.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var docDb = require('./doc_db_mysql'); // to access mysql db






router.post('/',  function (req, res) {
    
    var doc = req.body;
    docDb.post(doc, function (err, docs) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(docs);
        }
    });
});

router.delete('/:file', function (req, res) {
    
    var file = req.params.file;
    if (!file) {
        return res.status(404).send('Esta factura no tiene PDF que borrar');
    }
    docDb.delete(file, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});



   
module.exports = router;