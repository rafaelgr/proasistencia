var express = require('express');
var router = express.Router();
var sqlAnyDb = require("./sqlany_db_mysql");

// Test
// 
router.get('/test', function(req, res) {
    sqlAnyDb.test(function(err, testres) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(testres);
        }
    });
});

// Test2
// 
router.get('/test2', function(req, res) {
    sqlAnyDb.test2(function(err, testres) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(testres);
        }
    });
});

// Empresas
// 
router.get('/empresas', function(req, res) {
    sqlAnyDb.empresas(function(err, empresas) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(empresas);
        }
    });
});


// Empresa
// 
router.get('/empresas/:codigo', function(req, res) {

    sqlAnyDb.empresa(req.params.codigo, function(err, empresas) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(empresas);
        }
    });
});

// Exports
module.exports = router;
