var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async'),
    moment = require('moment');

var empresaDb = require('../empresas/empresas_db_mysql');
var clienteDb = require('../clientes/clientes_db_mysql');
var prefacturasDb = require('../prefacturas/prefacturas_db_mysql');

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

module.exports.getContratosCerrados = function (done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT contratoId, CONCAT(direccion,' ', referencia) as contasoc FROM contratos";
        sql += " WHERE contratoCerrado = 1";
        sql += " ORDER BY contratoId";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratosPreaviso = function (done) {
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
        sql += " WHERE NOW() >= DATE_SUB(cnt.fechaFinal, INTERVAL COALESCE(cnt.preaviso, 0) DAY) AND contratoCerrado = 0";
        sql += " ORDER BY cnt.referencia";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}
module.exports.getContratosActivos = function (done) {
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
        sql += " WHERE contratoCerrado = 0";
        sql += " ORDER BY cnt.referencia"
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratosBeneficioComercial = function (dFecha, hFecha, departamentoId, empresaId, comercialId, usuarioId, done) {
    var sql = "";
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "UPDATE contratos SET sel = 0";
        con.query(sql, function (err) {
            con.end();
            if (err) return done(err);
            cm.getConnectionCallback(function (err, con) {
                var contratos = null;
                // primero las marcamos por defeto como contabilizables
                sql = "SELECT DISTINCT c.* , fp.nombre as formaPago, emp.nombre as nombreEmpresa, tpm.nombre as tipoProyectoNombre, cli.nombre as nombreCliente";
                sql += " FROM Contratos AS c";
                sql += " LEFT JOIN contratos_comisionistas as cms ON cms.contratoId = c.contratoId";
                sql += " LEFT JOIN clientes as cli ON cli.clienteId = c.clienteId";
                sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = c.formaPagoId";
                sql += " LEFT JOIN empresas as emp ON emp.empresaId = c.empresaId";
                sql += " LEFT JOIN tipos_proyecto as tp ON tp.tipoProyectoId = c.tipoProyectoId";
                sql += " LEFT JOIN tipos_mantenimiento as tpm ON tpm.tipoMantenimientoId = tp.tipoMantenimientoId"
                sql += " WHERE c.fechaInicio >= ? AND c.fechaInicio <= ? AND c.contratoCerrado = 1";
                sql = mysql.format(sql, [dFecha, hFecha]);
                if (departamentoId != 0) {
                    sql += " AND c.tipoContratoId = " + departamentoId;
                } else {
                    sql += " AND c.tipoContratoId IN  (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
                }
                if (empresaId != 0) {
                    sql += " AND c.empresaId = " + empresaId;
                }
                if (comercialId != 0) {
                    sql += " AND  cms.comercialId = " + comercialId;
                }
                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    contratos = res;
                    var inSQl = "0";
                    contratos.forEach(function (f) {
                        inSQl += "," + f.contratoId;
                    });
                    var sql = "UPDATE contratos SET sel = 1";
                    sql += " WHERE contratoId IN (" + inSQl + ")";
                    con.query(sql, function (err, res) {
                        cm.closeConnection(con);
                        if (err) return done(err);
                        contratosMarcados = [];
                        contratos.forEach(function (c) {
                            c.sel = 1;
                            contratosMarcados.push(c);
                        });
                        done(null, contratosMarcados);
                    });
                });
            });
        });
    })

}


module.exports.getContratosEmpresaCliente = function (empresaId, clienteId, done) {
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
        sql += " WHERE cnt.empresaId = ? AND (cnt.clienteId = ? OR cnt.mantenedorId = ?)";
        sql += " AND cnt.fechaFinal >= ?"
        sql = mysql.format(sql, [empresaId, clienteId, clienteId, new Date()]);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

//devuelve los contratos activos de una empresa
module.exports.getContratosEmpresa = function (empresaId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*, CONCAT(cnt.referencia, ' / ', COALESCE(cnt.direccion, ''), ' / ', tpro.nombre) AS contasoc,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " LEFT JOIN tipos_proyecto AS tpro ON tpro.tipoProyectoId = cnt.tipoProyectoId";
        sql += " WHERE cnt.empresaId = ?";
        /*sql += " AND cnt.fechaFinal >= ?"*/
        sql += " AND cnt.fechaFinal >= '" + moment(new Date()).format('YYYY-MM-DD') + "'";
        sql = mysql.format(sql, empresaId /*new Date()]*/);
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
//devuelve todos los contratos de una empresa determinada
module.exports.getContratoConcat = function (empresaId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*, CONCAT(cnt.referencia, ' / ', COALESCE(cnt.direccion, ''), ' / ', tpro.nombre) AS contasoc,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " LEFT JOIN tipos_proyecto AS tpro ON tpro.tipoProyectoId = cnt.tipoProyectoId";
        sql += " WHERE cnt.empresaId = ?";
        sql = mysql.format(sql, empresaId);
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
            cm.closeConnection(con);
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

module.exports.getDireccion = function (done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT contratoId, CONCAT(direccion,' ', referencia) as direccion FROM contratos ORDER BY contratoId";
        con.query(sql, function (err, direcciones) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, direcciones);
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
                    if(prefacturas.length > 1 && !contrato.mantenedorId) {
                        //comprobamos si hay descuadre
                        cm.getConnectionCallback(function (err, con) {
                            if (err) return done(err);
                            var sql = "SELECT SUM(totalConIva) AS totalConIvaPrefacturas FROM prefacturas WHERE contratoId = " + contrato.contratoId;
                            con.query(sql, function (err, data) {
                                cm.closeConnection(con);
                                if (err) return done(err);
                                var descuadre = contrato.totalConIva - data[0].totalConIvaPrefacturas
                                if (descuadre != 0) {
                                    descuadre = descuadre.toFixed(4);
                                    cuadraUltimaPrefacturaContrato(contrato, descuadre,function (err, result) {
                                        if (err) return done(err);
                                        done(null, result);
                                    });
                                } else {
                                    done(null, 'OK');
                                }
                            });
                        });
                        
                    } else {
                        done(null, 'OK');
                    }
                });
            });
        });
    });
}

var cuadraUltimaPrefacturaContrato = function (contrato, descuadre, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return callback(err);
        // Primero hay que obtener laas lineas de la ultima prefactura del contrato
        var sql = "SELECT * FROM prefacturas_lineas WHERE prefacturaId IN ";
        sql += "(SELECT MAX(prefacturaId) FROM prefacturas WHERE contratoId = ? AND contratoPorcenId IS NULL) ORDER BY tipoIvaId ASC";
        sql = mysql.format(sql, contrato.contratoId);
        con.query(sql, function (err, lineas) {
            if (err) return callback(err);
            actualizaLineaDescuedre(lineas[0], descuadre, function(err, result) {
                if(err) return callback(err);
                callback(null, 'OK');
            })
        });
    });
}

var actualizaLineaDescuedre = function(linea, descuadre, callback) {
    descuadre = parseFloat(descuadre);
    var totalConIva =  (1 + (linea.porcentaje/100)) * linea.totalLinea;
    var nuevoCoste = ((totalConIva + descuadre) * linea.coste) / totalConIva;
    var nuevoImporte = ((totalConIva + descuadre) * linea.importe) / totalConIva;
    var nuevoTotal = ((totalConIva + descuadre) * linea.totalLinea) / totalConIva;
    var lin = {
        prefacturaId: linea.prefacturaId,
        prefacturaLineaId: linea.prefacturaLineaId,
        coste: nuevoCoste,
        importe: nuevoImporte,
        linea: linea.linea,
        articuloId: linea.articuloId,
        tipoIvaId: linea.tipoIvaId,
        porcentaje: linea.porcentaje,
        descripcion: linea.descripcion,
        cantidad: linea.cantidad,
        totalLinea: nuevoTotal
    } 
    prefacturasDb.putPrefacturaLinea(linea.prefacturaLineaId, lin, function(err, result) {
        if(err) return callback(err);
        callback(null, 'OK');
    });
}

module.exports.deleteGenerarPrefacturas = function (contratoPorcenId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "DELETE FROM prefacturas WHERE contratoPorcenId = ?";
        sql = mysql.format(sql, contratoPorcenId);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, result);
        })
    });
}

module.exports.deletePrefacturasSinConcepto = function (contratoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "DELETE FROM prefacturas WHERE contratoPorcenId IS NULL AND contratoId = ?";
        sql = mysql.format(sql, contratoId);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, result);
        })
    });
}


module.exports.postRenovarContrato = function (antContratoId, nuevaFechaInicio, nuevaFechaFinal, nuevaFechaContrato, done) {
    var nuevoContratoId = 0;
    // Todo el proceso debe estar protegido por transacciones
    cm.getConnectionCallbackTransaction(function (err, con) {
        if (err) return con.rollback(function () { done(err) });
        // Obtener la información del contrato
        module.exports.getContrato(antContratoId, function (err, contratos) {
            if (err) return done(err)
            var contrato = contratos[0];
            async.series([
                function (callback) {
                    //Actualiza la referencia del nuevo contrato a partir de la anterior
                    contrato.referencia = fnCrearNuevaReferencia(contrato.referencia);
                    // Dar de alta el nuevo contrato con los valores pasados.
                    fnCrearContratoDesdeOtro(con, contrato, antContratoId, nuevaFechaInicio, nuevaFechaFinal, nuevaFechaContrato, function (err, data) {
                        if (err) return callback(err);
                        nuevoContratoId = data.contratoId;
                        callback();
                    })

                }, function (callback) {
                    // Dar de alta las luineas del nuevo contrato
                    fnCrearLineasNuevoContrato(con, antContratoId, nuevoContratoId, function (err, data) {
                        if (err) return callback(err);
                        callback();
                    })

                }, function (callback) {
                    // Dar de alta las bases del nuevo contrato
                    fnCrearBasesNuevoContrato(con, antContratoId, nuevoContratoId, function (err, data) {
                        if (err) return callback(err);
                        callback();
                    })

                }, function (callback) {
                    // Dar de alta comisionistas del nuevo contrato
                    fnCrearComisionistasNuevoContrato(con, antContratoId, nuevoContratoId, function (err, data) {
                        if (err) return callback(err);
                        callback();
                    })

                }, function (callback) {
                    // Actualizar los valores para en el antiguo contrato de su relación con el nuevo
                    fnActualizarContratoAnterior(con, nuevoContratoId, antContratoId, function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                }], function (err) {
                    if (err) return con.rollback(function () { done(err) });
                    con.commit(function (err) {
                        if (err) return con.rollback(function () { done(err) });
                        done(null, nuevoContratoId);
                    });
                });
        });
    });
}

var fnCrearNuevaReferencia = function (ref) {
    var numero, punto;
    var array = [];
    //busca un punto en la referencia del contrato;
    punto = ref.indexOf('.');
    //si ha encontrado un punto recuperamos la parte numérica despues del punto e incrementamos uno
    if (punto == -1) {
        ref = ref + '.1';

    } else {
        array = ref.split('.');
        numero = parseInt(array[1]);
        numero++
        ref = array[0] + '.' + numero;
    }
    return ref;
}

var fnCrearContratoDesdeOtro = function (con, contrato, antContratoId, nuevaFechaInicio, nuevaFechaFinal, nuevaFechaContrato, done) {
    contrato.contratoId = 0;
    contrato.antContratoId = antContratoId;
    contrato.fechaInicio = nuevaFechaInicio;
    contrato.fechaFinal = nuevaFechaFinal;
    contrato.fechaContrato = nuevaFechaContrato;
    delete contrato.empresa;
    delete contrato.cliente;
    delete contrato.agente;
    delete contrato.mantenedor;
    delete contrato.tipo;
    delete contrato.formaPago;
    var sql = "INSERT INTO contratos SET ?";
    sql = mysql.format(sql, contrato);
    con.query(sql, function (err, data) {

        if (err) return done(err);
        contrato.contratoId = data.insertId;
        done(null, contrato);
    });
}

var fnCrearLineasNuevoContrato = function (con, antContratoId, nuevoContratoId, done) {
    var sql = "insert into contratos_lineas (linea, contratoId, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea, coste, porcentajeBeneficio, porcentajeAgente, capituloLinea)";
    sql += " select linea, ?, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea, coste, porcentajeBeneficio, porcentajeAgente, capituloLinea";
    sql += " from contratos_lineas where contratoId = ?";
    sql = mysql.format(sql, [nuevoContratoId, antContratoId]);
    con.query(sql, function (err) {

        if (err) return done(err);
        done();
    })
}

var fnCrearBasesNuevoContrato = function (con, antContratoId, nuevoContratoId, done) {
    var sql = "INSERT INTO contratos_bases (contratoId, tipoIvaId, porcentaje, base, cuota)";
    sql += " SELECT ?, tipoIvaId, porcentaje, base, cuota";
    sql += " FROM contratos_bases WHERE contratoId = ?";
    sql = mysql.format(sql, [nuevoContratoId, antContratoId]);
    con.query(sql, function (err) {

        if (err) return done(err);
        done();
    })
}

var fnCrearComisionistasNuevoContrato = function (con, antContratoId, nuevoContratoId, done) {
    var sql = "insert into contratos_comisionistas (contratoId, comercialId, porcentajeComision)";
    sql += " select ?, comercialId, porcentajeComision";
    sql += " from contratos_comisionistas where contratoId = ?";
    sql = mysql.format(sql, [nuevoContratoId, antContratoId]);
    con.query(sql, function (err) {

        if (err) return done(err);
        done();
    })
}
var fnActualizarContratoAnterior = function (con, nueContratoId, antContratoId, done) {
    var sql = "UPDATE contratos SET antContratoId = ? WHERE contratoId = ?";
    sql = mysql.format(sql, [nueContratoId, antContratoId]);
    con.query(sql, function (err, data) {
        if (err) return done(err);
        done(null, data);
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
        clienteDb.getCliente(prefactura.clienteId, function (err, data) {
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
        departamentoId: contrato.tipoContratoId,
        fecha: moment(prefactura.fecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
        empresaId: empresa.empresaId,
        clienteId: cliente.clienteId,
        emisorNif: empresa.nif,
        emisorNombre: empresa.nombre,
        emisorDireccion: empresa.direccion,
        emisorCodPostal: empresa.codPostal,
        emisorPoblacion: empresa.poblacion,
        emisorProvincia: empresa.provincia,
        receptorNif: cliente.nif,
        receptorNombre: cliente.nombre,
        receptorDireccion: cliente.direccion,
        receptorCodPostal: cliente.codPostal,
        receptorPoblacion: cliente.poblacion,
        receptorProvincia: cliente.provincia,
        total: prefactura.importe,
        formaPagoId: contrato.formaPagoId,
        totalAlCliente: prefactura.importeCliente,
        coste: prefactura.importeCoste,
        generada: 1,
        porcentajeBeneficio: prefactura.porcentajeBeneficio,
        porcentajeAgente: prefactura.porcentajeAgente,
        contratoId: contrato.contratoId,
        observaciones: contrato.obsFactura,
        periodo: prefactura.periodo,
        porcentajeRetencion: contrato.porcentajeRetencion,
        observacionesPago: prefactura.observacionesPago,
        contratoPorcenId: prefactura.contratoPorcenId
    };
    if(prefactura.formaPagoId)  prefacturaDb.formaPagoId = prefactura.formaPagoId
    fnGetNumeroPrefactura(prefacturaDb, con, function (err, prefactura) {
        if (err) return done(err);
        done(null, prefactura);
    })
}

var fnGetNumeroPrefactura = function (prefactura, con, done) {
    var sql = "SELECT * FROM empresas_series";
    sql += " WHERE empresaId = ?";
    sql = mysql.format(sql, prefactura.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(prefactura.fecha).year();
        var serie;
        for(var i=0; i < res.length; i++) {
            if (res[i].tipoProyectoId) {
                if(prefactura.tipoProyectoId == res[i].tipoProyectoId) {
                    if(res[i].serie_prefactura && res[i].serie_prefactura != '') {
                        serie = res[i].serie_prefactura;
                        break;
                    }
                }
            } 
            if(res[i].departamentoId) {
                if(prefactura.departamentoId == res[i].departamentoId) {
                    if(res[i].serie_prefactura && res[i].serie_prefactura != '') {
                        serie = res[i].serie_prefactura;
                        break;
                    }
                }
            }
        }
        if (!serie) return done(new Error('No existe una serie de facturación para esta empresa'));
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
    sql += " SET pf.total = pf2.b, pf.importeRetencion = COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0), "
    sql += " pf.totalConIva = pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0),";
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

module.exports.putContratosCliente = function (contrato, clienteId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "UPDATE contratos SET ? WHERE clienteId = ? AND contratoCerrado = 0";
        sql = mysql.format(sql, [contrato, clienteId]);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contrato);
        });
    });
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
    if (porcentajeAgente != null) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - (porcentajeAgente * 1)) / 100));
        importeAgente = roundToTwo(importeAlCliente - roundToTwo(ventaNeta));
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
            con.end();
            if (err) return done(err);
            done(null, comisionistas);
        });
    });
}

module.exports.getColaborador = function (agenteId, done) {
    cm.getConnectionCallback(function (err, con) {
        var sql = "SELECT  c1.comercialId,c1.ascComercialId, c2.nombre, c2.porcomer ";
        sql += " FROM comerciales AS c1";
        sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = c1.ascComercialId";
        sql += " WHERE c1.comercialId = ?";
        sql = mysql.format(sql, agenteId);
        con.query(sql, function (err, colaborador) {
            con.end();
            if (err) return done(err);
            done(null, colaborador);
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


//--------------------RESULTADO CONTRATO ASOCIADO A FACTURAS PROVEEDORES----------------------


 







//devuelve el resultado del contrato asociado a una factura de proveedor
module.exports.getContratoAsociadoFacprove = function (facproveId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql ="SELECT";
        sql += " ser.facproveServiciadoId, ser.facproveId, con.contratoId, con.referencia, con.contratoCerrado  AS estado,";
        sql += " COALESCE(v.total, 0) AS IMF,";
        sql += " COALESCE(g.gasto,0) AS CR,";
        sql += " COALESCE(r.IAR, 0) AS IAR,";
        sql += " COALESCE(con.total, 0) AS ITC,";
        sql += " con.porcentajeAgente AS pAgente,";
        sql += " con.importeAgente AS IA,"; 
        sql += " con.coste AS CT," 
        sql += " emp.nombre AS empresa,";
        sql += " COALESCE(con.total, 0)-con.importeAgente  AS ent,";
        sql += " ROUND((COALESCE(con.total, 0)-con.importeAgente)-con.coste, 2) AS BT,";
        sql += " COALESCE(ROUND(((COALESCE(con.total, 0)-con.importeAgente)-con.coste)/(COALESCE(con.coste, 0))*100, 2),0) AS pBT,";
        sql += " COALESCE(ROUND(COALESCE(v.total, 0 )-r.IAR, 2), 0)  AS INR,";
        sql += " COALESCE(ROUND((COALESCE(v.total, 0 )-r.IAR)-g.gasto, 2), 0) AS BR,";
        sql += " COALESCE(ROUND((((COALESCE(v.total, 0 )-r.IAR)-g.gasto)/(COALESCE(g.gasto, 0 )))*100, 2),0) AS pBR";
        sql += " FROM contratos AS con";
        sql += " LEFT JOIN facprove_serviciados AS ser ON ser.contratoId = con.contratoId";
        sql += " LEFT JOIN empresas AS emp ON emp.empresaId = ser.empresaId"; 
        sql += " LEFT JOIN";
        sql += " (SELECT"; 
        sql += " contratoId, SUM(total) AS total";
        sql += " FROM facturas GROUP BY contratoId) AS v ON v.contratoId = con.contratoId";

        sql += " LEFT JOIN"; 
        sql += " (SELECT";
        sql += " contratoId, ROUND(SUM(COALESCE((totalAlcliente * porcentajeAgente) / 100, 0)), 2) AS IAR";
        sql += " FROM facturas GROUP BY contratoId) AS r ON r.contratoId = con.contratoId";

        sql += " LEFT JOIN";
        sql += " (SELECT";
        sql += " contratoId, SUM(importe) AS gasto";
        sql += " FROM facprove_serviciados GROUP BY contratoId) AS g ON g.contratoId = con.contratoId";

        sql += " WHERE ser.facproveId = "+facproveId;
        sql += " GROUP BY ser.facproveId, ser.contratoId ";
        sql += " ORDER BY con.referencia ASC";
        
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}


//devuelve el resultado del contrato asociado a un anticipo de proveedor
module.exports.getContratoAsociadoAntprove = function (antproveId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql ="SELECT";
        sql += " ser.antproveServiciadoId, ser.antproveId, con.contratoId, con.referencia, con.contratoCerrado  AS estado,";
        sql += " COALESCE(v.total, 0) AS IMF,";
        sql += " COALESCE(g.gasto,0) AS CR,";
        sql += " COALESCE(r.IAR, 0) AS IAR,";
        sql += " COALESCE(con.total, 0) AS ITC,";
        sql += " con.porcentajeAgente AS pAgente,";
        sql += " con.importeAgente AS IA,"; 
        sql += " con.coste AS CT," 
        sql += " emp.nombre AS empresa,";
        sql += " COALESCE(con.total, 0)-con.importeAgente  AS ent,";
        sql += " ROUND((COALESCE(con.total, 0)-con.importeAgente)-con.coste, 2) AS BT,";
        sql += " COALESCE(ROUND(((COALESCE(con.total, 0)-con.importeAgente)-con.coste)/(COALESCE(con.coste, 0))*100, 2),0) AS pBT,";
        sql += " COALESCE(ROUND(COALESCE(v.total, 0 )-r.IAR, 2), 0)  AS INR,";
        sql += " COALESCE(ROUND((COALESCE(v.total, 0 )-r.IAR)-g.gasto, 2), 0) AS BR,";
        sql += " COALESCE(ROUND((((COALESCE(v.total, 0 )-r.IAR)-g.gasto)/(COALESCE(g.gasto, 0 )))*100, 2),0) AS pBR";
        sql += " FROM contratos AS con";
        sql += " LEFT JOIN antprove_serviciados AS ser ON ser.contratoId = con.contratoId";
        sql += " LEFT JOIN empresas AS emp ON emp.empresaId = ser.empresaId"; 
        sql += " LEFT JOIN";
        sql += " (SELECT"; 
        sql += " contratoId, SUM(total) AS total";
        sql += " FROM facturas GROUP BY contratoId) AS v ON v.contratoId = con.contratoId";

        sql += " LEFT JOIN"; 
        sql += " (SELECT";
        sql += " contratoId, ROUND(SUM(COALESCE((totalAlcliente * porcentajeAgente) / 100, 0)), 2) AS IAR";
        sql += " FROM facturas GROUP BY contratoId) AS r ON r.contratoId = con.contratoId";

        sql += " LEFT JOIN";
        sql += " (SELECT";
        sql += " contratoId, SUM(importe) AS gasto";
        sql += " FROM antprove_serviciados GROUP BY contratoId) AS g ON g.contratoId = con.contratoId";

        sql += " WHERE ser.antproveId = "+antproveId;
        sql += " GROUP BY ser.antproveId, ser.contratoId ";
        sql += " ORDER BY con.referencia ASC";
        
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}


//NUEVAS METODOS CARGA POR DEPARTAMENTO

module.exports.getContratosActivosUsuario = function (usuarioId, dapartamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE contratoCerrado = 0";
        if(dapartamentoId > 0) {
            sql += " AND cnt.tipoContratoId = " + dapartamentoId;
        } else {
            sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        sql += " ORDER BY cnt.referencia";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratosUsuario = function (usuarioId, departamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        if(departamentoId > 0) {
            sql += " WHERE cnt.tipoContratoId = " + departamentoId;
        } else {
            sql += " WHERE cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        sql += " ORDER BY cnt.referencia";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratosUsuarioPreaviso = function (usuarioId, departamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE NOW() >= DATE_SUB(cnt.fechaFinal, INTERVAL COALESCE(cnt.preaviso, 0) DAY) AND contratoCerrado = 0";
        if(departamentoId > 0) {
            sql += " AND cnt.tipoContratoId = " + departamentoId;
        } else {
            sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        sql += " ORDER BY cnt.referencia";
        sql = mysql.format(sql, usuarioId);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratoConDepartamento = function (contratoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
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

module.exports.getContratosEmpresaClienteDepartamento = function (empresaId, clienteId, usuarioId, departamentoId, usaContrato, fecha, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var cadenaSql = '';
        /* fecha = new Date();
        fecha = moment(fecha).format('YYYY-MM-DD'); */
        if(usaContrato == 0) usaContrato = false;
        if(!usaContrato)  cadenaSql = ' OR cnt.clienteId IS NULL';
        if(departamentoId)  cadenaSql += ' AND cnt.tipoContratoId = '+  departamentoId;
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE cnt.empresaId = ? AND ((cnt.clienteId = ? OR cnt.mantenedorId = ? )"+ cadenaSql +")";
        sql += " AND cnt.fechaFinal >= ? AND dp.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = ?) "
        sql = mysql.format(sql, [empresaId, clienteId, clienteId, fecha, usuarioId]);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratosCerradosDepartamento = function (usuarioId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT contratoId, CONCAT(direccion,' ', referencia) as contasoc FROM contratos";
        sql += " WHERE contratoCerrado = 1 AND tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+usuarioId+")";
        sql += " ORDER BY contratoId";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}




// private functions

var fnContratosFromDbToJson = function(contratos) {
    var pdJs = [];
    var cabJs = null;
   
    for (var i = 0; i < contratos.length; i++) {
        var f = contratos[i];
        
        
            if (cabJs) {
                pdJs.push(cabJs);
            }
            cabJs = {
                referencia: f.referencia,
                empresa: f.empresa,
                estado: f.estado,
                ITC: f.ITC,
                pAgente: f.pAgente,
                IA: f.IA,
                INT: f.ITC-f.IA,
                CT: f.CT,
                BT: (f.ITC-f.IA)-f.CT,
                pBT: ((f.ITC-f.IA)-f.CT)/(f.ITC-f.IA)*100,
                IF: f.IMF,
                INR: f.IMF-f.IA,
                CR: f.CR,
                BR: (f.IMF-f.IA)-f.CR,
                pBR: (((f.IMF-f.IA)-f.CR)/(f.IMF-f.IA))*100
            };
        }
        
    
    if (cabJs) {
        pdJs.push(cabJs);
    }
    return pdJs;
}

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

//CONCEPTOS COBROS

// getConceptoCobroLineas
module.exports.getConceptoCobroLineas = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "SELECT cp.*, fp.nombre AS formaPagoNombre, f.prefacturaId FROM contrato_porcentajes AS cp";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cp.formaPagoId";
        sql += " LEFT JOIN prefacturas AS p ON p.contratoPorcenId = cp.contratoPorcenId";
        sql += " LEFT JOIN facturas AS f ON f.prefacturaId = p.prefacturaId";
        sql += "  WHERE cp.contratoId = ? ORDER BY cp.fecha ASC";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err, null);
            }
            if (result.length == 0) {
                return callback(null, null);
            }
            callback(null, result);
        });
    });
}

// getConceptoCobroLineas
module.exports.getConceptoCobroLinea = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "SELECT * FROM contrato_porcentajes ";
        sql += "  WHERE contratoPorcenId = ?";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err, null);
            }
            if (result.length == 0) {
                return callback(null, null);
            }
            callback(null, result);
        });
    });
}

// postConceptoCobro
// crear en la base de datos el ConceptoCobro pasado
module.exports.postConceptoCobroLineas = function (ConceptoCobroLinea, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        ConceptoCobroLinea.contratoPorcenId = 0; // fuerza el uso de autoincremento
        sql = "INSERT INTO contrato_porcentajes SET ?";
        sql = mysql.format(sql, ConceptoCobroLinea);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err);
            }
            ConceptoCobroLinea.contratoPorcenId = result.insertId;
            callback(null, ConceptoCobroLinea);
        });
    });
}

// putConceptoCobro
// Modifica el ConceptoCobro según los datos del objeto pasao
module.exports.putConceptoCobroLinea = function (id, ConceptoCobroLinea, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "UPDATE contrato_porcentajes SET ? WHERE contratoPorcenId = ?";
        sql = mysql.format(sql, [ConceptoCobroLinea, id]);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err);
            }
            callback(null, ConceptoCobroLinea);
        });
    });
}

// deletetarifaClienteLinea
// Elimina la linea de tarifa con el id pasado
module.exports.deleteConceptoCobroLinea = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "DELETE from contrato_porcentajes WHERE contratoPorcenId = ?";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return callback(err);
            callback(null);
        });
    });
}
