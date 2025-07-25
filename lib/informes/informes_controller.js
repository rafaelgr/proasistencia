var express = require('express');
var router = express.Router();
var informesDb = require('./informes_db_mysql');

// GetPrefactura
// Obtiene los datos de un prefactura formateados para que aparezcan en el informe 
router.get('/prefacturas/:prefacturaId', function (req, res) {
    // es necesario que pase el id para la consulta
    var id = req.params.prefacturaId;
    if (!id) {
        return res.status(400).send('Debe enviar un id de referencia');
    }
    informesDb.getPrefactura(id, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!data) {
            return res.status(404).send('Prefactura no encontrada');
        }
        res.json(data);
    })
})


// GetOferta
// Obtiene los datos de un oferta formateados para que aparezcan en el informe 
router.get('/ofertas/:ofertaId', function (req, res) {
    // es necesario que pase el id para la consulta
    var id = req.params.ofertaId;
    if (!id) {
        return res.status(400).send('Debe enviar un id de referencia');
    }
    informesDb.getOferta(id, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!data) {
            return res.status(404).send('Oferta no encontrada');
        }
        res.json(data);
    })
})

// GetFactura
// Obtiene los datos de un factura formateados para que aparezcan en el informe 
router.get('/facturas/:facturaId', function (req, res) {
    // es necesario que pase el id para la consulta
    var id = req.params.facturaId;
    if (!id) {
        return res.status(400).send('Debe enviar un id de referencia');
    }
    informesDb.getFactura(id, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!data) {
            return res.status(404).send('Factura no encontrada');
        }
        res.json(data);
    })
})

router.get('/facturas2/:facturaId', function (req, res) {
    // es necesario que pase el id para la consulta
    var id = req.params.facturaId;
    if (!id) {
        return res.status(400).send('Debe enviar un id de referencia');
    }
    informesDb.getFactura2(id, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!data) {
            return res.status(404).send('Factura no encontrada');
        }
        res.json(data);
    })
})

router.post('/sql', function(req, res){
    if (!req.body || !req.body.sql ){
        return res.status(400).send('Error de formato en la petición');
    }
    var sql = req.body.sql;
    // control de inyección
    if (sql.indexOf('SELECT') != 0){
        return res.status(400).send('Sentencia no permitida');
    }
    //
    informesDb.postSQL(sql, function(err, data){
        if (err) return res.status(500).send(err.message);
        res.json(data.length);
    });
});


router.post('/sql/nuevo', function(req, res){
    if (!req.body || !req.body.sql ){
        return res.status(400).send('Error de formato en la petición');
    }
    var sql = req.body.sql;
    // control de inyección
    if (sql.indexOf('SELECT') != 0){
        return res.status(400).send('Sentencia no permitida');
    }
    //
    informesDb.postSQL(sql, function(err, data){
        if (err) return res.status(500).send(err.message);
        if(data)
        res.json(data);
    });
});

// Exports
module.exports = router;