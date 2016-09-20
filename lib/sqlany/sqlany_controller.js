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

// Clientes
// 
router.get('/clientes', function(req, res) {
    sqlAnyDb.clientes(function(err, clientes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});


// Cliente
// 
router.get('/clientes/:codigo', function(req, res) {
    // hay qie controlar la sustución * --> /
    // porque no se puede enviar '/' directamente en la url
    // se hace como '*'
    var _codigo = req.params.codigo.replace('*','/');
    sqlAnyDb.cliente(_codigo, function(err, clientes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(clientes);
        }
    });
});

// Comerciales
// 
router.get('/comerciales', function(req, res) {
    sqlAnyDb.comerciales(function(err, comerciales) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});


// Comercial
// 
router.get('/comerciales/:codigo', function(req, res) {

    sqlAnyDb.comercial(req.params.codigo, function(err, comerciales) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(comerciales);
        }
    });
});

// Agentes
// 
router.get('/agentes', function(req, res) {
    sqlAnyDb.agentes(function(err, agentes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(agentes);
        }
    });
});


// Agente
// 
router.get('/agentes/:codigo', function(req, res) {

    sqlAnyDb.agente(req.params.codigo, function(err, agentes) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(agentes);
        }
    });
});

// Exports
module.exports = router;
