var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async'),
    moment = require('moment');

var empresaDb = require('../empresas/empresas_db_mysql');
var clienteDb = require('../clientes/clientes_db_mysql');

module.exports.getContratos = function (done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratosEmpresaCliente = function(empresaId, clienteId, done){
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE cnt.empresaId = ? AND cnt.clienteId = ?";
        sql = mysql.format(sql, [empresaId, clienteId]);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });    
}

module.exports.getContrato = function (contratoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE cnt.contratoId = ?";
        sql = mysql.format(sql, contratoId);
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
        var sql = "SELECT MAX(referencia) as mxref FROM contratos WHERE referencia LIKE '" + abrv + "-%'";
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
            var nuevaReferencia = abrv + "-" + s.substr(s.length - 6);
            done(null, nuevaReferencia);
        });
    });
}

module.exports.postContrato = function (contrato, done) {
    actualizarEnBaseDatosContrato('POST', contrato, done);
}

module.exports.postGenerarPrefacturas = function (contratoId, prefacturas, done) {
    // Todo el proceso debe estar protegido por transacciones
    cm.getConnectionCallbackTransaction(function (err, con) {
        if (err) return con.rollback(function () { done(err) });
        // Obtener la información del contrato
        module.exports.getContrato(contratoId, function (err, contratos) {
            if (err) return done(err)
            var contrato = contratos[0];
            async.eachSeries(prefacturas, function (prefactura, callback) {
                generarUnaPrefactura(contrato, prefactura, con, function (err) {
                    if (err) return callback(err);
                    callback();
                });
            }, function (err) {
                if (err) return con.rollback(function () { done(err) });
                con.commit(function (err) {
                    if (err) return con.rollback(function () { done(err) });
                    done(null, 'OK');
                });
            });
        });
    });
}

var generarUnaPrefactura = function (contrato, prefactura, con, done) {
    // Generar y dar de alta la cabecera de prefactura
    generarUnaCabeceraPrefactura(contrato, prefactura, con, function (err, prefacturaDb) {
        if (err) return done(err);
        // Obtener las lineas del contrato para generar las lineas de prefactura
        var sql = "SELECT * FROM contratos_lineas WHERE contratoId = ?";
        sql = mysql.format(sql, contrato.contratoId);
        con.query(sql, function (err, lineasContrato) {
            if (err) return done(err);
            // Hay que obtener los divisores de proporcionalidad
            var importeContrato = contrato.importeCliente;
            if (contrato.mantenedorId) importeContrato = contrato.importeMantenedor;
            var divisor = prefactura.importe / importeContrato;
            async.eachSeries(lineasContrato,
                function (lineaContrato, callback) {
                    // Generar la línea de prefactura
                    var lineaPrefacturaDb = obtenerObjetoDbLineaPrefactura(prefacturaDb.prefacturaId, lineaContrato, contrato, prefactura, divisor);
                    var sql = "INSERT INTO prefacturas_lineas SET ?";
                    sql = mysql.format(sql, lineaPrefacturaDb);
                    con.query(sql, function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                }, function (err) {
                    // Generar las bases de prefactura
                    if (err) return done(err);
                    fnActualizarBasesPrefacturas(prefacturaDb.prefacturaId, con, function (err) {
                        if (err) return done(err);
                        done();
                    })
                });
        });
    });
};

var generarUnaCabeceraPrefactura = function (contrato, prefactura, con, done) {
    // Primero hay que obtener los datos de empresa y cliente
    var empresa = null;
    var cliente = null;
    empresaDb.getEmpresa(contrato.empresaId, function (err, data) {
        if (err) return done(err);
        empresa = data;
        clienteDb.getCliente(contrato.clienteId, function (err, data) {
            if (err) return done(err);
            cliente = data;
            var prefacturaDb = obtenerObjetoDbCabeceraPrefactura(empresa, cliente, contrato, prefactura, con, function (err, prefacturaDb) {
                if (err) return done(err);
                var sql = "INSERT INTO prefacturas SET ?";
                sql = mysql.format(sql, prefacturaDb);
                con.query(sql, function (err, data) {
                    if (err) return done(err);
                    prefacturaDb.prefacturaId = data.insertId;
                    done(null, prefacturaDb);
                });
            })
        })
    })
}

var obtenerObjetoDbCabeceraPrefactura = function (empresa, cliente, contrato, prefactura, con, done) {
    var prefacturaDb = {
        prefacturaId: 0,
        tipoProyectoId: contrato.tipoProyectoId,
        fecha: moment(prefactura.fecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
        empresaId: empresa.empresaId,
        clienteId: cliente.clienteId,
        emisorNif: empresa.nif,
        emisorNombre: empresa.nombre,
        emisorCodPostal: empresa.codPostal,
        emisorPoblacion: empresa.poblacion,
        emisorProvincia: empresa.provincia,
        emisorPoblacion: empresa.poblacion,
        emisorProvincia: empresa.provincia,
        receptorNif: cliente.nif,
        receptorNombre: cliente.nombre,
        receptorCodPostal: cliente.codPostal,
        receptorPoblacion: cliente.poblacion,
        receptorProvincia: cliente.provincia,
        receptorPoblacion: cliente.poblacion,
        receptorProvincia: cliente.provincia,
        total: prefactura.importe,
        formaPagoId: contrato.formaPagoId,
        totalAlCliente: prefactura.importeCliente,
        coste: prefactura.importeCoste,
        generada: 1,
        porcentajeBeneficio: prefactura.porcentajeBeneficio,
        porcentajeAgente: prefactura.porcentajeAgente,
        contratoId: contrato.contratoId
    };
    fnGetNumeroPrefactura(prefacturaDb, con, function (err, prefactura) {
        if (err) return done(err);
        done(null, prefactura);
    })
}

var fnGetNumeroPrefactura = function (prefactura, con, done) {
    var sql = "SELECT * FROM empresas where empresaId = ?";
    sql = mysql.format(sql, prefactura.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(prefactura.fecha).year();
        var serie = res[0].seriePre;
        sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM prefacturas";
        sql += " WHERE empresaId = ?";
        sql += " AND ano = ?";
        sql += " AND serie = ?";
        sql = mysql.format(sql, [prefactura.empresaId, ano, serie]);
        con.query(sql, function (err, res) {
            if (err) return done(err);
            // actualizar los campos del objeto prefactura
            prefactura.numero = res[0].n;
            prefactura.ano = ano;
            prefactura.serie = serie;
            done(null, prefactura);
        })
    });
}

var obtenerObjetoDbLineaPrefactura = function (prefacturaId, lineaContrato, contrato, prefactura, divisor) {
    var lineaPrefacturaDb = {
        prefacturaLineaId: 0,
        linea: lineaContrato.linea,
        prefacturaId: prefacturaId,
        unidadId: lineaContrato.unidadId,
        articuloId: lineaContrato.articuloId,
        tipoIvaId: lineaContrato.tipoIvaId,
        porcentaje: lineaContrato.porcentaje,
        descripcion: lineaContrato.descripcion,
        cantidad: lineaContrato.cantidad,
        importe: lineaContrato.importe * divisor,
        totalLinea: lineaContrato.totalLinea * divisor,
        coste: lineaContrato.coste * divisor,
        porcentajeBeneficio: lineaContrato.porcentajeBeneficio,
        porcentajeAgente: lineaContrato.porcentajeAgente,
        capituloLinea: lineaContrato.capituloLinea
    }
    if (contrato.mantenedorId) {
        // es factura a mantenedor y para que cuadren totales hay que tocar los importe
        var totalLineaMantenedor = prefactura.importe * (lineaContrato.totalLinea / contrato.importeCliente);
        var importeLineaMantenedor = totalLineaMantenedor / lineaContrato.cantidad;
        lineaPrefacturaDb.totalLinea = totalLineaMantenedor;
        lineaPrefacturaDb.importe = importeLineaMantenedor;
    }
    return lineaPrefacturaDb;
}

var fnActualizarBasesPrefacturas = function (id, con, callback) {
    sql = "INSERT INTO prefacturas_bases (prefacturaId, tipoIvaId, porcentaje, base, cuota)";
    sql += " SELECT pl.prefacturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
    sql += " FROM";
    sql += " (SELECT prefacturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
    sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
    sql += " FROM prefacturas_lineas";
    sql += " WHERE prefacturaId = ?";
    sql += " GROUP BY tipoIvaId) AS pl";
    sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, result) {
        if (err) return callback(err);
        fnActualizarTotalesPrefacturas(id, con, function (err) {
            if (err) return callback(err);
            callback();
        });
    });
}

var fnActualizarTotalesPrefacturas = function (id, con, callback) {
    sql = "UPDATE prefacturas AS pf,";
    sql += " (SELECT prefacturaId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM prefacturas_bases GROUP BY 1) AS pf2,";
    sql += " (SELECT prefacturaId, SUM(coste) AS sc";
    sql += " FROM prefacturas_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
    sql += " pf.coste = pf3.sc";
    sql += " WHERE pf.prefacturaId = ?";
    sql += " AND pf2.prefacturaId = pf.prefacturaId";
    sql += " AND pf3.prefacturaId = pf.prefacturaId";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, result) {
        if (err) return callback(err);
        callback(null);
    });
}

module.exports.putContrato = function (contrato, done) {
    actualizarEnBaseDatosContrato('PUT', contrato, done);
}

module.exports.deleteContrato = function (contrato, done) {
    // actualizamos previamente las referencias de ese contrato
    // en las ofertas para evitar errores.
    cm.getConnectionCallback(function (err, con) {
        var sql = "UPDATE ofertas SET contratoId = NULL WHERE contratoId = ?";
        sql = mysql.format(sql, contrato.contratoId);
        con.query(sql, function (err) {
            if (err) return done(err);
            // una vez eliminada la referencia podemos borrar.
            actualizarEnBaseDatosContrato('DELETE', contrato, done);
        });
    });
}

/*
|---------------------------------------|
|                                       |
|  LINEAS CONTRATO                      |
|                                       |
|---------------------------------------|
*/


// comprobarContratoLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarContratoLinea(contratoLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof contratoLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && contratoLinea.hasOwnProperty("contratoId"));
    comprobado = (comprobado && contratoLinea.hasOwnProperty("contratoLineaId"));
    comprobado = (comprobado && contratoLinea.hasOwnProperty("linea"));
    comprobado = (comprobado && contratoLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && contratoLinea.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && contratoLinea.hasOwnProperty("porcentaje"));
    comprobado = (comprobado && contratoLinea.hasOwnProperty("descripcion"));
    comprobado = (comprobado && contratoLinea.hasOwnProperty("cantidad"));
    comprobado = (comprobado && contratoLinea.hasOwnProperty("importe"));
    comprobado = (comprobado && contratoLinea.hasOwnProperty("totalLinea"));
    return comprobado;
}

// getNextContratoLine
// busca el siguiente número de línea de la contrato pasada
module.exports.getNextContratoLineas = function (id, callback) {
    var connection = cm.getConnection();
    var contratos = null;
    sql = "SELECT MAX(linea) as maxline FROM contratos_lineas"
    sql += " WHERE contratoId = ?;";
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

// getContratoLineas
// Devuelve todas las líneas de una prefacttura
module.exports.getContratoLineas = function (id, callback) {
    var connection = cm.getConnection();
    var contratos = null;
    sql = "SELECT cntl.*, a.grupoArticuloId, u.abrev as unidades FROM contratos_lineas as cntl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = cntl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = cntl.unidadId"
    sql += " WHERE cntl.contratoId = ?";
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

// getContratoLinea
// Devuelve la línea de contrato solcitada por su id.
module.exports.getContratoLinea = function (id, callback) {
    var connection = cm.getConnection();
    var contratos = null;
    sql = "SELECT cntl.*, a.grupoArticuloId, u.abrev as unidades FROM contratos_lineas as cntl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = cntl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = cntl.unidadId"
    sql += " WHERE cntl.contratoLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// postContratoLinea
// crear en la base de datos la linea de contrato pasada
module.exports.postContratoLinea = function (contratoLinea, callback) {
    if (!comprobarContratoLinea(contratoLinea)) {
        var err = new Error("La linea de contrato pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = cm.getConnection();
    contratoLinea.contratoLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO contratos_lineas SET ?";
    sql = mysql.format(sql, contratoLinea);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        contratoLinea.contratoLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBases(contratoLinea.contratoId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, contratoLinea);
        })
    });
}


// putContratoLinea
// Modifica la linea de contrato según los datos del objeto pasao
module.exports.putContratoLinea = function (id, contratoLinea, callback) {
    if (!comprobarContratoLinea(contratoLinea)) {
        var err = new Error("La linea de contrato pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != contratoLinea.contratoLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = cm.getConnection();
    sql = "UPDATE contratos_lineas SET ? WHERE contratoLineaId = ?";
    sql = mysql.format(sql, [contratoLinea, contratoLinea.contratoLineaId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(contratoLinea.contratoId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, contratoLinea);
        })
    });
}

// deleteContratoLinea
// Elimina la linea de contrato con el id pasado
module.exports.deleteContratoLinea = function (id, contratoLinea, callback) {
    var connection = cm.getConnection();
    sql = "DELETE from contratos_lineas WHERE contratoLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(contratoLinea.contratoId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    });
}


// recalculo de línea de contrato
module.exports.recalculoLineasContrato = function (contratoId, coste, porcentajeBeneficio, porcentajeAgente, done) {
    var con = cm.getConnection();
    // Buscamos la líneas de la contrato
    sql = " SELECT cnt.coste as costeContratoCompleta, cntl.*";
    sql += " FROM contratos as cnt";
    sql += " LEFT JOIN contratos_lineas as cntl ON cntl.contratoId = cnt.contratoId";
    sql += " WHERE cnt.contratoId = ?";
    sql = mysql.format(sql, contratoId);
    con.query(sql, function (err, lineas) {
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
            var porcentajeDelCoste = linea.coste / linea.costeContratoCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste;
            // Recalculamos el total de la línea en base a los nuevos datos
            linea.totalLinea = obtenerImporteAlClienteDesdeCoste(importeDelNuevoCoste, porcentajeBeneficio, porcentajeAgente);
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costeContratoCompleta;
            // Actualizamos la línea lo que actualizará de paso la contrato
            exports.putContratoLinea(linea.contratoLineaId, linea, function (err, result) {
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
// Actuliza la tabla de bases y cuotas de la contrato pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBases = function (id, callback) {
    fnBorraBases(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = cm.getConnection();
        sql = "INSERT INTO contratos_bases (contratoId, tipoIvaId, porcentaje, base, cuota)";
        sql += " SELECT pl.contratoId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
        sql += " FROM";
        sql += " (SELECT contratoId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
        sql += " FROM contratos_lineas";
        sql += " WHERE contratoId = ?";
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
    sql = "UPDATE contratos AS cnt,";
    sql += " (SELECT contratoId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM contratos_bases GROUP BY 1) AS cnt2,";
    sql += " (SELECT contratoId, SUM(coste) AS sc";
    sql += " FROM contratos_lineas GROUP BY 1) AS cnt3";
    sql += " SET cnt.importeCliente = cnt2.b, cnt.total = cnt2.b, cnt.totalConIva = cnt2.b + cnt2.c,";
    sql += " cnt.coste = cnt3.sc";
    sql += " WHERE cnt.contratoId = ?";
    sql += " AND cnt2.contratoId = cnt.contratoId";
    sql += " AND cnt3.contratoId = cnt.contratoId";
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
// elimina las bases y cuotas de una contrato
// antes de actualizarlas
var fnBorraBases = function (id, callback) {
    var connection = cm.getConnection();
    sql = "DELETE FROM contratos_bases";
    sql += " WHERE contratoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// getContratoBases
// devuelve los regitros de bases y cutas de la 
// contrato con el id pasado
module.exports.getContratoBases = function (id, callback) {
    var connection = cm.getConnection();
    var contratos = null;
    sql = "SELECT cntb.*, ti.nombre as tipo";
    sql += " FROM contratos_bases as cntb";
    sql += " LEFT JOIN tipos_iva as ti ON ti.tipoIvaId = cntb.tipoIvaId"
    sql += " WHERE contratoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


/*
|---------------------------------------|
|                                       |
|  COMISIONISTAS                        |
|                                       |
|---------------------------------------|
*/

module.exports.getContratoComisionista = function (contratoComisionistaId, done) {
    cm.getConnectionCallback(function (err, con) {
        var sql = "SELECT cntc.*, com.nombre AS colaborador";
        sql += " FROM contratos_comisionistas AS cntc";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cntc.comercialId";
        sql += " WHERE cntc.contratoComisionistaId = ?";
        sql = mysql.format(sql, contratoComisionistaId);
        con.query(sql, function (err, comisionistas) {
            if (err) return done(err);
            done(null, comisionistas);
        });
    });
}

module.exports.getComisionistasDeUnContrato = function (contratoId, done) {
    cm.getConnectionCallback(function (err, con) {
        var sql = "SELECT cntc.*, com.nombre AS colaborador";
        sql += " FROM contratos_comisionistas AS cntc";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cntc.comercialId";
        sql += " WHERE cntc.contratoId = ?";
        sql = mysql.format(sql, contratoId);
        con.query(sql, function (err, comisionistas) {
            if (err) return done(err);
            done(null, comisionistas);
        });
    });
}


module.exports.postContratoComisionista = function (contratoComisionista, done) {
    actualizarEnBaseDatosContratoComisionista('POST', contratoComisionista, done);
}

module.exports.putContratoComisionista = function (contratoComisionista, done) {
    actualizarEnBaseDatosContratoComisionista('PUT', contratoComisionista, done);
}

module.exports.deleteContratoComisionista = function (contratoComisionista, done) {
    actualizarEnBaseDatosContratoComisionista('DELETE', contratoComisionista, done);
}


// private functions
var actualizarEnBaseDatosContrato = function (comando, contrato, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "";
        switch (comando) {
            case 'POST':
                sql = "INSERT INTO contratos SET ?";
                sql = mysql.format(sql, contrato);
                break;
            case 'PUT':
                sql = "UPDATE contratos SET ? WHERE contratoId = ?";
                sql = mysql.format(sql, [contrato, contrato.contratoId]);
                break;
            case 'DELETE':
                sql = "DELETE FROM contratos WHERE contratoId = ?";
                sql = mysql.format(sql, contrato.contratoId);
                break;
            default:
                return done(new Error('Comado de actualización incorrecto'));
                break;
        }
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            if (comando == 'POST') contrato.contratoId = result.insertId;
            done(null, contrato);
        })
    });
}


var actualizarEnBaseDatosContratoComisionista = function (comando, contratoComisionista, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "";
        switch (comando) {
            case 'POST':
                sql = "INSERT INTO contratos_comisionistas SET ?";
                sql = mysql.format(sql, contratoComisionista);
                break;
            case 'PUT':
                sql = "UPDATE contratos_comisionistas SET ? WHERE contratoComisionistaId = ?";
                sql = mysql.format(sql, [contratoComisionista, contratoComisionista.contratoComisionistaId]);
                break;
            case 'DELETE':
                sql = "DELETE FROM contratos_comisionistas WHERE contratoComisionistaId = ?";
                sql = mysql.format(sql, contratoComisionista.contratoComisionistaId);
                break;
            default:
                return done(new Error('Comando de actualización incorrecto'));
                break;
        }
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            if (comando == 'POST') contratoComisionista.contratoComisionistaId = result.insertId;
            done(null, contratoComisionista);
        })
    });
}

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};
