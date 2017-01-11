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

// Exports
module.exports = router;