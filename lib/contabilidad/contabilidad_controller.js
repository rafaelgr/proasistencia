var express = require('express'),
    router = express.Router(),
    contabilidadDb = require('./contabilidad_db_mysql');

router.get('/contas', function(req, res){
    contabilidadDb.getContas(function(err, result){
        if (err) return res.status(500).send(err.message);
        res.json(result);
    })
});

router.get('/numdigitos', function(req, res){
    contabilidadDb.getNumDigitos(function(err, result){
        if (err) return res.status(500).send(err.message);
        res.json(result);
    })
});

router.get('/infcontable', function(req, res){
    contabilidadDb.getInfContable(function(err, result){
        if (err) return res.status(500).send(err.message);
        res.json(result);
    })
});

module.exports = router;