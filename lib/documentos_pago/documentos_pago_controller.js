var express = require('express');
var router = express.Router();
var documentosPagoDb = require("./documentos_pago_db_mysql");
const mysql2 = require('mysql2/promise') ;

const obtenerConfiguracion = function() {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET
    }
}


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




// PostDocumentoPago
// permite dar de alta un unidad
router.post('/', async (req, res, next) => {
    try{
        var r = 0
        var documentoPago = req.body.documentoPago
		var facproves = documentoPago.facproves;
        let conn = undefined;
        conn = await mysql2.createConnection(obtenerConfiguracion());
        await conn.query(`START TRANSACTION`);
            facproves.reduce(async (accum, curr) => {
                let documento = {
                    documentoPagoId: 0,
                    nombre: documentoPago.nombre,
                    pdf: documentoPago.pdf,
                    facproveId: curr
        
                }
                await accum;
                documentosPagoDb.postDocumentoPago(documento, conn).
                then( async (conn) => {
                    r++
                    if(r == facproves.length) {
                        await conn.query(`COMMIT`);
                        await conn.end();
                        res.json('Hecho');
                    }
                })
                .catch(err => { 
                    if(conn) {
                        conn.end();
                    }
                    //connection.query(`ROLLBACK`);
                    return next(err);
                })
                
                
            }, Promise.resolve()).then( () => {
                () => console.log('done'),
                (e) => console.log(e)
    
            })

		
	} catch(error) {
        if(conn) {
            conn.end()
            next(error);
            return;
        }
        return next(error);
      
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
        documentosPagoDb.deleteDocumentoPago(req.params.documentoPagoId) 
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