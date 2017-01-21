var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async'),
    moment = require('moment'),
    numeral = require('numeral');

var comercialesDb = require('../comerciales/comerciales_db_mysql');
var contratosDb = require('../contratos/contratos_db_mysql');

module.exports.getOfertas = function (done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getOferta = function (ofertaId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        sql += " WHERE of.ofertaId = ?";
        sql = mysql.format(sql, ofertaId);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getSiguienteReferencia = function (abrv, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT MAX(referencia) as mxref FROM ofertas WHERE referencia LIKE '" + abrv + "-%'";
        con.query(sql, function (err, reg) {
            if (err) return done(err);
            var numero = 1;
            if (reg.length > 0) {
                var mxref = reg[0].mxref;
                if (mxref) {
                    var campos = mxref.split('-');
                    numero = parseInt(campos[1]) + 1;
                }
            }
            var s = "000000" + numero;
            var nuevaReferencia = abrv + "-" + s.substr(s.length- 6);
            done(null, nuevaReferencia);
        });
    });
}

module.exports.postOferta = function (oferta, done) {
    actualizarEnBaseDeDatos('POST', oferta, done);
}

module.exports.putOferta = function (oferta, done) {
    actualizarEnBaseDeDatos('PUT', oferta, done);
}

module.exports.deleteOferta = function (oferta, done) {
    actualizarEnBaseDeDatos('DELETE', oferta, done);
}

/*
|---------------------------------------|
|                                       |
|  LINEAS PREFACTURA                    |
|                                       |
|---------------------------------------|
*/


// comprobarOfertaLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarOfertaLinea(ofertaLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof ofertaLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("ofertaId"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("ofertaLineaId"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("linea"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("porcentaje"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("descripcion"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("cantidad"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("importe"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("totalLinea"));
    return comprobado;
}

// getNextOfertaLine
// busca el siguiente número de línea de la oferta pasada
module.exports.getNextOfertaLineas = function (id, callback) {
    var connection = cm.getConnection();
    var ofertas = null;
    sql = "SELECT MAX(linea) as maxline FROM ofertas_lineas"
    sql += " WHERE ofertaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        var maxline = result[0].maxline;
        if (!maxline) {
            return callback(null, 1.1);
        }
        callback(null, roundToTwo(maxline + 0.1));
    });
}

// getOfertaLineas
// Devuelve todas las líneas de una prefacttura
module.exports.getOfertaLineas = function (id, callback) {
    var connection = cm.getConnection();
    var ofertas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM ofertas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.ofertaId = ?";
    sql += " ORDER by linea";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// getOfertaLinea
// Devuelve la línea de oferta solcitada por su id.
module.exports.getOfertaLinea = function (id, callback) {
    var connection = cm.getConnection();
    var ofertas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM ofertas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.ofertaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// postOfertaLinea
// crear en la base de datos la linea de oferta pasada
module.exports.postOfertaLinea = function (ofertaLinea, callback) {
    if (!comprobarOfertaLinea(ofertaLinea)) {
        var err = new Error("La linea de oferta pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = cm.getConnection();
    ofertaLinea.ofertaLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO ofertas_lineas SET ?";
    sql = mysql.format(sql, ofertaLinea);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        ofertaLinea.ofertaLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBases(ofertaLinea.ofertaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, ofertaLinea);
        })
    });
}


// putOfertaLinea
// Modifica la linea de oferta según los datos del objeto pasao
module.exports.putOfertaLinea = function (id, ofertaLinea, callback) {
    if (!comprobarOfertaLinea(ofertaLinea)) {
        var err = new Error("La linea de oferta pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != ofertaLinea.ofertaLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = cm.getConnection();
    sql = "UPDATE ofertas_lineas SET ? WHERE ofertaLineaId = ?";
    sql = mysql.format(sql, [ofertaLinea, ofertaLinea.ofertaLineaId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(ofertaLinea.ofertaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, ofertaLinea);
        })
    });
}

// deleteOfertaLinea
// Elimina la linea de oferta con el id pasado
module.exports.deleteOfertaLinea = function (id, ofertaLinea, callback) {
    var connection = cm.getConnection();
    sql = "DELETE from ofertas_lineas WHERE ofertaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(ofertaLinea.ofertaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    });
}


// recalculo de línea de oferta
module.exports.recalculoLineasOferta = function (ofertaId, coste, porcentajeBeneficio, porcentajeAgente, done) {
    var con = cm.getConnection();
    // Buscamos la líneas de la oferta
    sql = " SELECT pf.coste as costeOfertaCompleta, pfl.*";
    sql += " FROM ofertas as pf";
    sql += " LEFT JOIN ofertas_lineas as pfl ON pfl.ofertaId = pf.ofertaId";
    sql += " WHERE pf.ofertaId = ?";
    sql = mysql.format(sql, ofertaId);
    con.query(sql, function (err, lineas) {
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
            var porcentajeDelCoste = linea.coste / linea.costeOfertaCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste;
            linea.porcentajeBeneficio = porcentajeBeneficio;
            linea.porcentajeAgente = porcentajeAgente;
            // Recalculamos el total de la línea en base a los nuevos datos
            linea.totalLinea = obtenerImporteAlClienteDesdeCoste(importeDelNuevoCoste, porcentajeBeneficio, porcentajeAgente);
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costeOfertaCompleta;
            // Actualizamos la línea lo que actualizará de paso la oferta
            exports.putOfertaLinea(linea.ofertaLineaId, linea, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        }, function (err) {
            if (err) return done(err);
            done(null);
        });
    });

}

var obtenerImporteAlClienteDesdeCoste = function (coste, porcentajeBeneficio, porcentajeAgente) {
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (porcentajeBeneficio) {
            importeBeneficio = roundToTwo(porcentajeBeneficio * coste / 100);
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (porcentajeAgente) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - porcentajeAgente) / 100));
        importeAgente = roundToTwo(importeAlCliente - ventaNeta);
    }
    importeAlCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    return importeAlCliente;
}


// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la oferta pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBases = function (id, callback) {
    fnBorraBases(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = cm.getConnection();
        sql = "INSERT INTO ofertas_bases (ofertaId, tipoIvaId, porcentaje, base, cuota)";
        sql += " SELECT pl.ofertaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
        sql += " FROM";
        sql += " (SELECT ofertaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
        sql += " FROM ofertas_lineas";
        sql += " WHERE ofertaId = ?";
        sql += " GROUP BY tipoIvaId) AS pl";
        sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            cm.closeConnection(connection);
            if (err) {
                return callback(err);
            }
            // Antes de volver actualizamos los totales y así está hecho
            fnActualizarTotales(id, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        });
    })
}

// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de factura
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotales = function (id, callback) {
    var connection = cm.getConnection();
    sql = "UPDATE ofertas AS pf,";
    sql += " (SELECT ofertaId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM ofertas_bases GROUP BY 1) AS pf2,";
    sql += " (SELECT ofertaId, SUM(coste) AS sc";
    sql += " FROM ofertas_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.importeCliente = pf2.b, pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
    sql += " pf.coste = pf3.sc";
    sql += " WHERE pf.ofertaId = ?";
    sql += " AND pf2.ofertaId = pf.ofertaId";
    sql += " AND pf3.ofertaId = pf.ofertaId";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// fnBorraBases
// elimina las bases y cuotas de una oferta
// antes de actualizarlas
var fnBorraBases = function (id, callback) {
    var connection = cm.getConnection();
    sql = "DELETE FROM ofertas_bases";
    sql += " WHERE ofertaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// getOfertaBases
// devuelve los regitros de bases y cutas de la 
// oferta con el id pasado
module.exports.getOfertaBases = function (id, callback) {
    var connection = cm.getConnection();
    var ofertas = null;
    sql = "SELECT pb.*, ti.nombre as tipo";
    sql += " FROM ofertas_bases as pb";
    sql += " LEFT JOIN tipos_iva as ti ON ti.tipoIvaId = pb.tipoIvaId"
    sql += " WHERE ofertaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

module.exports.generarContratoDesdeOferta = function (ofertaId, datosAceptacion, done) {
    var nuevoContrato = null;
    // obtener un conector para transacciones
    cm.getConnectionCallbackTransaction(function (err, con) {
        if (err) return con.rollback(function () { done(err) });
        async.series({
            paso1: function (callback) {
                // insertar la cabecera del nuevo contrato
                insertarCabeceraNuevoContrato(ofertaId, datosAceptacion, con, function (err, contrato) {
                    if (err) return callback(err);
                    nuevoContrato = contrato;
                    callback();
                });
            },
            paso2: function (callback) {
                // insertar las líneas del nuevo contratos
                insertarLineasNuevoContrato(ofertaId, nuevoContrato.contratoId, con, function (err) {
                    if (err) return callback(err);
                    callback();
                });
            },
            paso3: function (callback) {
                // insertar las bases del nuevo contraro
                insertarBasesNuevoContrato(ofertaId, nuevoContrato.contratoId, con, function (err) {
                    if (err) return callback(err);
                    callback();
                });
            },
            paso4: function (callback) {
                // crear como comisionista el colaborador asociado al agente con su comisión
                crearComisionistasNuevoContrato(nuevoContrato, con, function (err) {
                    if (err) return callback(err);
                    callback();
                });

            },
            paso5: function (callback) {
                // actualizar la cabecera de oferta con el identificador de contrato
                actualizarCabeceraOferta(nuevoContrato, datosAceptacion, con, function (err) {
                    if (err) return callback(err);
                    callback();
                });
            }
        }, function (err) {
            if (err) return con.rollback(function () { done(err) });
            con.commit(function (err) {
                if (err) return con.rollback(function () { done(err) });
                done(null, nuevoContrato);
            })
        });
    })
}

var insertarCabeceraNuevoContrato = function (ofertaId, datosAceptacion, con, done) {
    module.exports.getOferta(ofertaId, function (err, ofertas) {
        if (err) return done(err);
        var oferta = ofertas[0];
        var nuevoContrato = obtenerContratoDesdeOfertaYDatosAceptacion(oferta, datosAceptacion);

        sql = "INSERT INTO contratos SET ?";
        sql = mysql.format(sql, nuevoContrato);

        con.query(sql, function (err, res) {
            if (err) return done(err);
            nuevoContrato.contratoId = res.insertId;
            done(null, nuevoContrato);
        })
    });
}

var obtenerContratoDesdeOfertaYDatosAceptacion = function (oferta, datosAceptacion) {
    var nuevoContrato = oferta;
    nuevoContrato.contratoId = 0; // es un alta

    nuevoContrato.tipoContratoId = oferta.tipoOfertaId;
    nuevoContrato.fechaContrato = datosAceptacion.fechaAceptacionOferta;

    delete nuevoContrato.tipoOfertaId;
    delete nuevoContrato.fechaOferta;
    delete nuevoContrato.fechaAceptacionOferta;
    delete nuevoContrato.empresa;
    delete nuevoContrato.cliente;
    delete nuevoContrato.tipo;
    delete nuevoContrato.mantenedor;
    delete nuevoContrato.agente;
    delete nuevoContrato.formaPago;

    nuevoContrato.fechaInicio = datosAceptacion.fechaInicio;
    nuevoContrato.fechaFinal = datosAceptacion.fechaFinal;
    nuevoContrato.fechaOriginal = datosAceptacion.fechaOriginal;
    nuevoContrato.preaviso = datosAceptacion.preaviso;
    nuevoContrato.facturaParcial = datosAceptacion.facturaParcial;
    return nuevoContrato;
}

var insertarLineasNuevoContrato = function (ofertaId, contratoId, con, done) {
    var sql = "INSERT INTO contratos_lineas";
    sql += " SELECT 0 AS contratoLineaId, ofl.linea, ? AS contratoId, ofl.unidadId,";
    sql += " ofl.articuloId, ofl.tipoIvaId, ofl.porcentaje, ofl.descripcion, ofl. cantidad, ofl.importe,";
    sql += " ofl.totalLinea, ofl.coste, ofl.porcentajeBeneficio, ofl.porcentajeAgente, ofl.capituloLinea";
    sql += " FROM ofertas_lineas AS ofl";
    sql += " WHERE ofl.ofertaId = ?";
    sql = mysql.format(sql, [contratoId, ofertaId]);

    con.query(sql, function (err, res) {
        if (err) return done(err);
        done(null);
    });
}

var insertarBasesNuevoContrato = function (ofertaId, contratoId, con, done) {
    var sql = "INSERT INTO contratos_bases";
    sql += " SELECT 0 AS contratoBaseId, ? AS contratoId,";
    sql += " ofb.tipoIvaId, ofb.porcentaje, ofb.base, ofb.cuota";
    sql += " FROM ofertas_bases AS ofb";
    sql += " WHERE ofb.ofertaId = ?"
    sql = mysql.format(sql, [contratoId, ofertaId]);

    con.query(sql, function (err, res) {
        if (err) return done(err);
        done(null);
    });
}

var crearComisionistasNuevoContrato = function (nuevoContrato, con, done) {
    var comision = 0;
    var comisionistaId = null;
    // buscar el comercial asociado al comisionista
    comercialesDb.getComercial(nuevoContrato.agenteId, function (err, comercial) {
        if (err) return done(err);
        if (!comercial) return done(null);
        comisionistaId = comercial.ascComercialId;
        // buscar la comision de ese comercial en base al contrato
        comercialesDb.buscarComision(comisionistaId, nuevoContrato.clienteId, nuevoContrato.empresaId, nuevoContrato.tipoContratoId,
            function (err, res) {
                if (err) return done(err);
                // dar de alta en contratos_comisionistas la línea correspondiente
                comision = res;
                var sql = "INSERT INTO contratos_comisionistas";
                sql += " VALUES(0, ?, ?, ?)";
                sql = mysql.format(sql, [nuevoContrato.contratoId, comisionistaId, comision]);

                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    done(null);
                });
            });
    })
}

var actualizarCabeceraOferta = function (nuevoContrato, datosAceptacion, con, done) {
    var sql = "UPDATE ofertas SET contratoId = ? , fechaAceptacionOferta = ?"
    sql += " WHERE ofertaId = ?";
    sql = mysql.format(sql, [nuevoContrato.contratoId, datosAceptacion.fechaAceptacionOferta, nuevoContrato.ofertaId]);

    con.query(sql, function (err, res) {
        if (err) return done(err);
        done(null);
    });
}

// private functions
var actualizarEnBaseDeDatos = function (comando, oferta, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "";
        switch (comando) {
            case 'POST':
                sql = "INSERT INTO ofertas SET ?";
                sql = mysql.format(sql, oferta);
                break;
            case 'PUT':
                sql = "UPDATE ofertas SET ? WHERE ofertaId = ?";
                sql = mysql.format(sql, [oferta, oferta.ofertaId]);
                break;
            case 'DELETE':
                sql = "DELETE FROM ofertas WHERE ofertaId = ?";
                sql = mysql.format(sql, oferta.ofertaId);
                break;
            default:
                return done(new Error('Comado de actualización incorrecto'));
                break;
        }
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            if (comando == 'POST') oferta.ofertaId = result.insertId;
            done(null, oferta);
        })
    });
}

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};
