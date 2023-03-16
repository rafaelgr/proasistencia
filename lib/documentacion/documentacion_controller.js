var express = require('express'),
    router = express.Router(),
    documentacionDb = require('./documentacion_db_mysql');


    //devuelve un registro de la table documentoId con su id pasada
router.get('/:documentoId', async (req, res, next) => {
    try {
        documentacionDb.getDocumento(req.params.documentoId)
        .then((docum) => {
            if (!docum) return res.status(404).send("documento no encontrado");
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

//devuelve las carpetas de tipo oferta de un departamento con los documentos de una oferta, si tiene contrato asociado
//también devuelve las carpetas de tipo contrato con los documentos asociados a dicho contrato
router.get('/:ofertaId/:departamentoId/:contratoId', async (req, res, next) => {
    try {
        documentacionDb.getDocumentacionOferta(req.params.ofertaId, req.params.departamentoId, req.params.contratoId)
        .then((docum) => {
            if (!docum) return res.status(404).send("documentación no encontrada");
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});


//devuelve las carpetas de tipo contrato de un departamento con los documentos de un contrato, si tiene oferta asociada
//también devuelve las carpetas de tipo oferta con los documentos asociados a dicha oferta
router.get('/contrato/:ofertaId/:departamentoId/:contratoId', async (req, res, next) => {
    try {
        documentacionDb.getDocumentacionContrato(req.params.ofertaId, req.params.departamentoId, req.params.contratoId)
        .then((docum) => {
            if (!docum) return res.status(404).send("documentación no encontrada");
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

//devuelve las carpetas del departamento de reparaciones con los documentos 
router.get('/solo/reparaciones/:ofertaId/:parteId', async (req, res, next) => {
    try {
        documentacionDb.getDocumentacionReparaciones(req.params.ofertaId, req.params.parteId)
        .then((docum) => {
            if (!docum) return res.status(404).send("documentación no encontrada");
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});


//devuelve un registro de la table documentoId con su id pasada
router.get('/documentos/de/la/carpeta/:carpetaId', async (req, res, next) => {
    try {
        documentacionDb.getDocumentosCarpeta(req.params.carpetaId)
        .then((docums) => {
            //if (!docums) return res.status(404).send("documentos no encontrados");
            res.json(docums)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});


//inserta un registro en la tabla documentacion
router.post('/', async (req, res, next) => {
    try {
        documentacionDb.postDocumentacion(req.body.documentacion)
        .then((docum) => {
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

//Inserta un registro en la tabla carpetas
router.post('/carpeta', async (req, res, next) => {
    try {
        documentacionDb.postDocumentacionCarpeta(req.body.carpeta)
        .then((carpeta) => {
            res.json(carpeta)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});


//Modifica un registro en la tabla documentoId
router.put('/:documentoId', async (req, res, next) => {
    try {
        documentacionDb.putDocumentacion(req.body.documentacion, req.params.documentoId)
        .then((docum) => {
            res.json(docum)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});



//Elimina un registro en la tabla documentoId
router.delete('/elimina-documento/:documentoId', async (req, res, next) => {
    try {
        documentacionDb.deleteDocumentacion(req.params.documentoId)
        .then((result) => {
            res.json(null)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});

//Elimina todos los registros de la tabla documentoId asociados 
//a una carpeta y el registro correspondiente en la tabla carpetas.
router.delete('/elimina-carpeta/:carpetaId', async (req, res, next) => {
    try {
        documentacionDb.deleteCarpeta(req.params.carpetaId)
        .then((result) => {
            res.json(result)
        })
        .catch(err => next(err));
    } catch(error) {
        next(error);
    }
});



// Exports
module.exports = router;