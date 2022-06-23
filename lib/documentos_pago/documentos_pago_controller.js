var express = require('express');
var router = express.Router();
var documentosPagoDb = require("./documentos_pago_db_mysql");


router.get('/',  async (req, res, next) =>{
    try {
        var nombre = req.query.nombre;
        if (nombre) {
            documentosPagoDb.getDocumentosPagoBuscar(nombre)
            .then((documentosPago) => {
                if (!documentosPago) return res.status(404).send("documentos de pago no encontrados");
                res.json(documentosPago)
            })
            .catch(err => next(err));
        } else {
            documentosPagoDb.getDocumentosPago() 
            .then( (documentosPago) =>{
                if (!documentosPago) return res.status(404).send("documentos de pago no encontrados");
                res.json(documentosPago)
            }) 
            .catch(err => next(err))
        }

    } catch (error) {
        next(error);
    }
});



router.get('/:documentoPagoId', async (req, res, next) => {
    try {
        documentosPagoDb.getDocuemntoPago(req.params.documentoPagoId)
        .then((documentoPago) => {
            if (!documentoPago) return res.status(404).send("documento de pago no encontrado");
            res.json(documentoPago)
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});




// PostDocumentoPago
// permite dar de alta un unidad
router.post('/', async (req, res, next) => {
    try {
        documentosPagoDb.postDocumentoPago(req.body.documentoPago)
        .then((documentoPago) => {
            if (!documentoPago) return res.status(404).send("documento de pago no encontrado");
            res.json(documentoPago)
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});



// PutDocumentoPago
// modifica el unidad con el id pasado
router.put('/:documentoPagoId', async (req, res, next) => {
    try {
        documentosPagoDb.getDocumentoPago(req.params.documentoPagoId)
        .then( (documentoPago) => {
            if (documentoPago == null) {
                res.status(404).send("Documento de pago no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                documentosPagoDb.putDocumentoPago(req.params.documentoPagoId, req.body.documentoPago)
                .then( (documentoPago) => {
                    res.json(documentoPago);
                })
                .catch( err => { next(err) });
            }

        })
        .catch( err => { next(err) });
    } catch (error) {
        next(error);
    }
});

// DeleteDocumentoPago
router.delete('/:documentoPagoId', async => (req, res, next) => {
    try {
        documentosPagoDb.deleteDocumentoPago(req.params.unidadId) 
        .then ( (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });

    } catch (error) {
        next(error);
    }
});

// Exports
module.exports = router;