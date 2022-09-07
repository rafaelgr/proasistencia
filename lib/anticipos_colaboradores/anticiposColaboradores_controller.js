var express = require('express');
var router = express.Router();
var anticiposColaboradoresDb = require("./anticiposColaboradores_db_mysql");
var facturasProveedoresDb = require("../facturas_proveedores/facturasProveedores_db_mysql");

router.get('/:antcolId', async (req, res, next) => {
    try {
        anticiposColaboradoresDb.getAnticipoColaborador(req.params.antcolId)
        .then((anticipo) => {
            if (!anticipo) return res.status(404).send("anticipo no encontrado");
            res.json(anticipo)
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});


// Getanticipo
// devuelve las anticipos de un colaborador completos
router.get('/colaborador/anticipos/solapa/muestra/tabla/datos/anticipo/:colaboradorId', async (req, res, next) => {
    try {
        anticiposColaboradoresDb.getAnticipoColaboradorId(req.params.colaboradorId)
        .then( (anticipos) => {
            res.json(anticipos)
        })
        .catch(( err) => {
            next(err);
        })

    } catch(error) {
        next(error);
    }
});



router.get('/contrato/:contratoId', async (req, res, next) => {
    try {
        var contratoId = req.params.contratoId;
        if (!contratoId) return res.status(400).send("Falta la referencia al contrato en la URL de la solicitud");
        anticiposColaboradoresDb.getAnticiposContrato(contratoId)
        .then( ( anticipos) => {
            res.json(anticipos);
        })
        .catch( (err) => { next(err);})

    } catch(error) {
        next(error)
    }
});




// PostAnticipo
// permite dar de alta una anticipo de colaborador
router.post('/', async (req, res, next) => {
    try {
        var antcol = req.body.antcol;
        anticiposColaboradoresDb.postAnticipo(antcol)
        .then((antcol) => {
            res.json(antcol);
        })
        .catch((err) => {
            next(err)
        });
        

    } catch(error) {
        next(error);
    }
});


// PutAnticipo
// modifica el anticipo con el id pasado
router.put('/:antcolId', async (req, res, next) => {
    // antes de modificar comprobamos que el objeto existe
    try {
        anticiposColaboradoresDb.getAnticipoColaborador(req.params.antcolId)
        .then((anticipo) => {
            if (!anticipo) return res.status(404).send("anticipo no encontrado");
          
                 // ya sabemos que existe y lo intentamos modificar.
                var antcol = req.body.antcol;
                
                anticiposColaboradoresDb.putAnticipo(req.params.antcolId, antcol)
                .then((result) => {
                    res.json(result)
                })
                .catch(err => next(err))
            
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});

// DeleteAnticipo
// elimina un anticipo de la base de datos
router.delete('/:antcolId', async (req, res, next) => {
    try {
        var antcolId = req.params.antcolId;
        anticiposColaboradoresDb.deleteAnticipo(antcolId)
        .then( (anticipo) => {
            res.json(anticipo)
        })
        .catch((err => {
            next(err);
        }))

    }catch(error) {
        next(err);
    }
});





/* ----------------------
    SOLAPA SERVICIADAS
-------------------------*/

//GetServiciadas
//devuelve todas las empresas serviciadas asociadas a una anticipo
router.get('/servicidas/anticipos/colaborador/todas/:antcolId', function (req, res) {
    anticiposColaboradoresDb.getserviciadasAnticipo(req.params.antcolId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

router.get('/servicidas/anticipos/colaborador/una/para/editar/:antcolId', function (req, res) {
    anticiposColaboradoresDb.getserviciadaAnticipo(req.params.antcolId, function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});




//postServiciada
//permite dar de alta una empresa serviciada asociada a una anticipo
router.post('/nueva/serviciada', function (req, res) {
    var serviciada = req.body.antcolServiciada;
    anticiposColaboradoresDb.postServiciada(serviciada, function (err, serviciada) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(serviciada);
        }
    });
});

//putserviciada
//modifica una empresa serviciada con su id pasado
router.put('/serviciada/edita/:antcolserviciadoId', function (req, res) {
    anticiposColaboradoresDb.putServiciada(req.params.antcolserviciadoId, req.body.antcolServiciada, function (err, data) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(data);
        }
    });
});

//deleteServiciadas
//permite borrar una empresa serviciada de una anticipo
router.delete('/serviciada/anticipo/colaborador/:antcolServiciadaId', function(req, res){
    var antcolServiciadaId = req.params.antcolServiciadaId;
    if (!antcolServiciadaId) return res.status(400).send("Falta la referencia a la EMPRESA SERVICIADA en la URL de la solicitud");
    anticiposColaboradoresDb.deleteServiciadas(antcolServiciadaId, function(err){
        if (err) return res.status(500).send(err.message);
        res.json('OK');
    })
});



//LLAMADAS  POR DEPARTAMENTO DE USUARIO

// getFacturasColaboradoresUsuario
// Devuelve las facturas de colaboradores que pertenezcan a los departamentos
//que el usuario tenga asignados
router.get('/usuario/logado/departamento/:usuarioId/:departamentoId', async (req, res, next) => {
    try {
        anticiposColaboradoresDb.getAnticiposColaboradoresUsuario(req.params.usuarioId, req.params.departamentoId)
        .then((anticipos) => {
            res.json(anticipos);
        })
        .catch(err => next(err))
    } catch (error) {
        next(error);
    }
});




router.get('/colaborador/recupera/todos/:colaboradorId', function (req, res) {
    anticiposColaboradoresDb.getAnticiposColaborador(req.params.colaboradorId, function (err, facturas) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(facturas);
        }
    });
});


//tratamiento de los anticipos de la factura

// Getanticipo
// devuelve las anticipos de un proveedor incompletos
router.get('/colaborador/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/completo/:proveedorId/:facproveId/:departamentoId', function (req, res) {
    anticiposColaboradoresDb.getAnticipoColaboradorTodos(req.params.proveedorId,  req.params.facproveId, req.params.departamentoId, function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});

// Getanticipo
// devuelve las anticipos de un proveedor incompletos
router.get('/colaborador/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/:proveedorId/:departamentoId', function (req, res) {
    anticiposColaboradoresDb.getAnticipoColaboradorIncompleto(req.params.proveedorId, req.params.departamentoId,function (err, anticipo) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            
                res.json(anticipo);
        }
    });
});

router.post('/vincula/varios/', function (req, res) {
    var antCol = req.body;
    anticiposColaboradoresDb.vinculaAntCols(antCol, function (err, antCol) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});





// Exports
module.exports = router;