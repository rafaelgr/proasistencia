var express = require('express'),
    router = express.Router(),
    expedintesDb = require('./expedientes_db_mysql');


router.get('/estado/:estadoId', function (req, res) {
    expedintesDb.getExpedientesEstado(req.params.estadoId, function (err, expedientes) {
        if (err) return res.status(500).send(err.message);
        res.json(expedientes);
    })
})



router.get('/:expedienteId', function (req, res) {
    var expedienteId = req.params.expedienteId;
    if (!expedienteId) return res.status(400).send('Debe especificar el código de el expedienteId que desea consultar');
    expedintesDb.getExpediente(expedienteId, function (err, expedientes) {
        if (err) return res.status(500).send(err.message);
        if (expedientes.length == 0) return res.status(404).send('Expediente no encontrado');
        var expediente = expedientes[0];
        res.json(expediente);
    })
});

router.get('/concat/referencia/direccion/tipo/:empresaId', function (req, res) {
    var empresaId = req.params.empresaId;
    if (!empresaId) return res.status(400).send('Debe especificar el código de el expediente que desea consultar');
    expedintesDb.getExpedienteConcat(empresaId, function (err, expedientes) {
        if (err) return res.status(500).send(err.message);
        if (expedientes.length == 0) return res.status(404).send('Expedientes no encontrados');
        res.json(expedientes);
    })
});





router.post('/', function (req, res) {
    var expediente = req.body.expediente;
    if (!expediente) return res.status(400).send('Debe incluir el expediente a dar de alta en el cuerpo del mensaje');
    expedintesDb.postExpediente(expediente, function (err, expediente) {
        if (err) return res.status(500).send(err.message);
        res.json(expediente);
    });
});




router.put('/:expedienteId', function (req, res) {
    var expediente = req.body.expediente;
    if (!expediente) return res.status(400).send('Debe incluir el expediente a modificar en el cuerpo del mensaje');
    expedintesDb.putExpediente(expediente, function (err, expediente) {
        if (err) return res.status(500).send(err.message);
        res.json(expediente);
    });
});





router.delete('/:expedienteId', function (req, res) {
    var expedienteId = req.params.expedienteId;
    if (!expedienteId) return res.status(400).send('Debe indicar el identificador de el expediente a eliminar');
    var expediente = {
        expedienteId: expedienteId
    };
    expedintesDb.deleteExpediente(expediente, function (err, expediente) {
        if (err) return res.status(500).send(err.message);
        res.json(expediente);
    });
});




// Exports
module.exports = router;