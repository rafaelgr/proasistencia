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
        documentosPagoDb.getDocumentoPago(req.params.documentoPagoId)
        .then((documentoPago) => {
            if (!documentoPago) return res.status(404).send("documento de pago no encontrado");
            res.json(documentoPago)
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});

router.get('/buscar/registros/:dFecha/:hFecha/:empresaId', async (req, res, next) => {
    try {
        documentosPagoDb.getRegistrosConta(req.params.dFecha, req.params.hFecha, req.params.empresaId )
        .then((registros) => {
            res.json(registros)
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});

router.get('/buscar/registros/anticipos/:dFecha/:hFecha/:empresaId', async (req, res, next) => {
    try {
        documentosPagoDb.getRegistrosContaAnticipos(req.params.dFecha, req.params.hFecha, req.params.empresaId )
        .then((registros) => {
            res.json(registros)
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});

router.get('/buscar/:dFecha/:hFecha/:empresaId/:proveedorId/:formaPagoId', async (req, res, next) => {
    try {
        documentosPagoDb.getFacturasdocpago(req.params.dFecha, req.params.hFecha, req.params.empresaId,  req.params.proveedorId, req.params.formaPagoId)
        .then((registros) => {
            if (!registros) return res.status(404).send("Registros no encontrados");
            res.json(registros)
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});


router.get('/buscar/facturas/:dFecha/:hFecha/:empresaId/:proveedorId', async (req, res, next) => {
    try {
        documentosPagoDb.getDocumentosPago2(req.params.dFecha, req.params.hFecha, req.params.empresaId,  req.params.proveedorId )
        .then((registros) => {
            if (!registros) return res.status(404).send("Registros no encontrados");
            res.json(registros)
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});




// PostDocumentoPago
router.post('/', async (req, res, next) => {
    try{
        var documentoPago = req.body.documentoPago
        documentosPagoDb.postDocumentoPago(documentoPago)
        .then( (result) => {
            res.json(result);
          
        })
        .catch(err => next(err));	
	} catch(error) {
        next(error);  
	}
});

router.post('/exportar/:conDocPago/:dFecha/:hFecha/:empresaId/:proveedorId', async (req, res, next) => {
    try {
        documentosPagoDb.postDocumentosPagoExportar(req.params.conDocPago, req.params.dFecha, req.params.hFecha, req.params.empresaId,  req.params.proveedorId )
        .then((registros) => {
            if (!registros) return res.status(404).send("Registros no encontrados");
            res.json(registros)
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});


router.post('/exportar/facproves/:conDocPago/:dFecha/:hFecha/:empresaId/:proveedorId/:formaPagoId', async (req, res, next) => {
    try {
        documentosPagoDb.postFacprovesDocPagoExportar(req.params.conDocPago, req.params.dFecha, req.params.hFecha, req.params.empresaId,  req.params.proveedorId, req.params.formaPagoId )
        .then((registros) => {
            res.json(registros)
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
router.delete('/:documentoPagoId', async (req, res, next) => {
    try {
        documentosPagoDb.deleteDocumentoPago(req.params.documentoPagoId) 
        .then ( (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });

    } catch (error) {
        next(error);
    }
});


// DeletedocumentospagoFacprove
router.delete('/delete/docpago-facprove', async (req, res, next) => {
    try {
        documentosPagoDb.DeletedocumentospagoFacprove(req.body) 
        .then ( (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });

    } catch (error) {
        next(error);
    }
});



// DeletedocumentospagoFacprove
router.delete('/delete/docpago/antprove', async (req, res, next) => {
    try {
        documentosPagoDb.DeletedocumentospagoAntprove(req.body) 
        .then ( (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });

    } catch (error) {
        next(error);
    }
});

// PostDocumentoPago
router.post('/facturas', async (req, res, next) => {
    try{
        var docfac = req.body.docfac
        documentosPagoDb.postDocumentoPagoFacturas(docfac).
        then( async (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });
	} catch(error) {
        next(error);
      
	}
});


router.post('/registros', async (req, res, next) => {
    try{
        var docfac = req.body.docfac
        documentosPagoDb.postRegistrosContaFacturas(docfac).
        then( async (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });
	} catch(error) {
        next(error);
      
	}
});

router.post('/registros/anticipos', async (req, res, next) => {
    try{
        var docfac = req.body.docfac
        documentosPagoDb.postRegistrosContaAnticipos(docfac).
        then( async (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });
	} catch(error) {
        next(error);
      
	}
});

// PostDocumentoPago
router.post('/asociar/anticipos', async (req, res, next) => {
    try{
        var docant = req.body.docant
        documentosPagoDb.postDocumentoPagoAnticipos(docant).
        then( async (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });
	} catch(error) {
        next(error);
      
	}
});


router.get('/registro/:codigo/:anyo/:empresaId', async (req, res, next) => {
    try{
        var codigo = req.params.codigo;
        var anyo = req.params.anyo;
        var empresaId = req.params.empresaId;
        documentosPagoDb.getRegistroContaFactura(codigo, anyo, empresaId).
        then( async (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });
	} catch(error) {
        next(error);
      
	}
});

router.get('/registro/anticipo/:codigo/:anyo/:empresaId', async (req, res, next) => {
    try{
        var codigo = req.params.codigo;
        var anyo = req.params.anyo;
        var empresaId = req.params.empresaId;
        documentosPagoDb.getRegistroContaAnticipo(codigo, anyo, empresaId).
        then( async (result) => {
            res.json(result);
        })
        .catch( err => { next(err) });
	} catch(error) {
        next(error);
      
	}
});
// Exports
module.exports = router;