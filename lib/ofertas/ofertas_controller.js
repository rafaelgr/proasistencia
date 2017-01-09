var express = require('express'),
    router = express.Router(),
    ofertasDb = require('./ofertas_db_mysql');

router.get('/', function (req, res) {
    ofertasDb.getOfertas(function (err, ofertas) {
        if (err) return res.status(500).send(err.message);
        res.json(ofertas);
    })
})

router.get('/:ofertaId', function (req, res) {
    var ofertaId = req.params.ofertaId;
    if (!ofertaId) return res.status(400).send('Debe especificar el código de la oferta que desea consultar');
    ofertasDb.getOferta(ofertaId, function (err, ofertas) {
        if (err) return res.status(500).send(err.message);
        if (ofertas.length == 0) return res.status(404).send('Oferta no encontrada');
        var oferta = ofertas[0];
        res.json(oferta);
    })
});

router.post('/', function(req, res){
    var oferta = req.body.oferta;
    if (!oferta) return res.status(400).send('Debe incluir la oferta a dar de alta en el cuerpo del mensaje');
    ofertasDb.postOferta(oferta, function(err, oferta){
        if (err) return res.status(500).send(err.message);
        res.json(oferta);
    });
});

router.put('/', function(req, res){
    var oferta = req.body.oferta;
    if (!oferta) return res.status(400).send('Debe incluir la oferta a modificar en el cuerpo del mensaje');
    ofertasDb.postOferta(oferta, function(err, oferta){
        if (err) return res.status(500).send(err.message);
        res.json(oferta);
    });
});

router.delete('/:ofertaId', function(req, res){
    var ofertaId = req.params.ofertaId;
    if (!ofertaId) return res.status(400).send('Debe indicar el identificador de la oferta a eliminar');
    var oferta = {
        ofertaId: ofertaId
    };
    ofertasDb.deleteOferta(oferta, function(err, oferta){
        if (err) return res.status(500).send(err.message);
        res.json(oferta);
    });
});

// Exports
module.exports = router;