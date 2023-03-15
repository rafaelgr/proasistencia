var express = require('express'),
    router = express.Router(),
    documentacionDb = require('./documentacion_db_mysql');


//devuelve las carpetas de un departamento con los documentos 
router.get('/:ofertaId/:departamentoId/:contratoId', async (req, res, next) => {
    try {
        documentacionDb.getDocumentacion(req.params.ofertaId, req.params.departamentoId, req.params.contratoId)
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