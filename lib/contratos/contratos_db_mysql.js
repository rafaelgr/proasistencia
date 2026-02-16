var cm = require('../comun/comun'),
    mysql = require('mysql'),
    mysql2 = require('mysql2/promise'),
    async = require('async'),
    moment = require('moment');
var fs = require("fs");

var empresaDb = require('../empresas/empresas_db_mysql');
var clienteDb = require('../clientes/clientes_db_mysql');
var prefacturasDb = require('../prefacturas/prefacturas_db_mysql');
const { resolve, Resolver } = require('dns');
const { post } = require('request');

const obtenerConfiguracion = function () {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET,
        multipleStatements: true,
        dateStrings: true
    }
}
// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT
    });
    connection.connect(function (err) {
        if (err) throw err;
    });
    return connection;
}
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

module.exports.getContratosCerradosDepartamento2 = function (departamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT contratoId, CONCAT(direccion,' ', referencia) as contasoc FROM contratos";
        sql += " WHERE contratoCerrado = 1 AND tipoContratoId = ?";
        sql += " ORDER BY contratoId";
        sql = mysql.format(sql, departamentoId);
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
    var subSql = "";
    if (departamentoId != 8) subSql = " AND c.fechaFinal >= ? AND c.fechaFinal <= ?"
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "UPDATE contratos_comisionistas SET sel = 0";
        con.query(sql, function (err) {
            cm.closeConnection(con);
            if (err) return done(err);
            cm.getConnectionCallback(function (err, con) {
                var contratos = null;
                // primero las marcamos por defeto como contabilizables
                sql = "SELECT DISTINCT cms.contratoComisionistaId, c.contratoId, c.referencia, c.fechaFinal,";
                sql += " c.importeCliente AS importeContrato, c.certificacionFinal AS certificacionFinal,";
                sql += " fp.nombre as formaPago, emp.nombre as nombreEmpresa, tpm.nombre as tipoProyectoNombre,";
                sql += " cli.nombre as nombreCliente,";
                sql += " co.nombre as comisionista";
                sql += " FROM contratos AS c";
                sql += " LEFT JOIN facturas AS f ON f.contratoId = c.contratoId";
                sql += " LEFT JOIN contratos_comisionistas as cms ON cms.contratoId = c.contratoId";
                sql += " LEFT JOIN comerciales as co ON co.comercialId = cms.comercialId";
                sql += " LEFT JOIN clientes as cli ON cli.clienteId = c.clienteId";
                sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = c.formaPagoId";
                sql += " LEFT JOIN empresas as emp ON emp.empresaId = c.empresaId";
                sql += " LEFT JOIN tipos_proyecto as tp ON tp.tipoProyectoId = c.tipoProyectoId";
                sql += " LEFT JOIN tipos_mantenimiento as tpm ON tpm.tipoMantenimientoId = tp.tipoMantenimientoId"
                sql += " WHERE  cms.liquidado = 0 " + subSql + " AND c.contratoCerrado = 1";
                if (departamentoId != 8) sql = mysql.format(sql, [dFecha, hFecha]);
                if (departamentoId != 0) {
                    sql += " AND c.tipoContratoId = " + departamentoId;
                } else {
                    sql += " AND c.tipoContratoId IN  (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
                }
                if (empresaId != 0) {
                    sql += " AND c.empresaId = " + empresaId;
                }
                if (comercialId != 0) {
                    sql += " AND  cms.comercialId = " + comercialId;
                }
                con.query(sql, function (err, res) {
                    cm.closeConnection(con);
                    if (err) return done(err);
                    contratos = res;
                    done(null, contratos);
                    /*  var inSQl = "0";
                     contratos.forEach(function (f) {
                         inSQl += "," + f.contratoComisionistaId;
                     });
                     cm.getConnectionCallback(function (err, con) { 
                         var sql = "UPDATE contratos_comisionistas SET sel = 1";
                         sql += " WHERE contratoComisionistaId IN (" + inSQl + ")";
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
 
                     }); */
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
        sql += " em.nombre AS empresa, cl.nombre AS cliente,  cl.telefono1, cl.telefono2, cl.email, cl.emailFacturas, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
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
        if (empresaId != '0') {
            sql += " WHERE cnt.empresaId = ?";
            sql = mysql.format(sql, empresaId);
        }
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

//devuelve todos los contratos de una empresa determinada y departamento pasados como parámetros
module.exports.getContratosEmpresaDepartamento = function (dFecha, hFecha, empresaId, departamentoId, done) {
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
        sql += " WHERE true"
        if (dFecha) {
            sql += " AND cnt.fechaInicio >= '" + dFecha + " 00:00:00'";
        }
        if (hFecha) {
            sql += " AND cnt.fechaInicio <= '" + hFecha + " 23:59:59'";
        }
        if (empresaId != '0') {
            sql += " AND cnt.empresaId = ?";
            sql = mysql.format(sql, empresaId);
        }
        if (departamentoId != '0') {
            sql += " AND cnt.tipoContratoId = ?";
            sql = mysql.format(sql, departamentoId);
        }
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getSiguienteReferencia = function (abrv, arquitectura, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT MAX(referencia) as mxref FROM contratos WHERE referencia LIKE '" + abrv + "-%'";
        con.query(sql, function (err, reg) {
            cm.closeConnection(con);
            if (err) return done(err);
            var numero = 1;

            //formato normal
            var digitos = 6;
            var s1 = '000000';
            //formato arquitectura
            if (arquitectura == 'true') {
                digitos = 5;
                s1 = '00000'
            }

            if (reg.length > 0) {
                var mxref = reg[0].mxref;
                if (mxref) {
                    var campos = mxref.split('-');
                    numero = parseInt(campos[1]) + 1;
                }
            }
            var s = s1 + numero;
            var nuevaReferencia = abrv + "-" + s.substr(s.length - digitos);
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

module.exports.postGenerarPrefacturas = function (contratoId, prefacturas, importeFacturar, done) {
    // Todo el proceso debe estar protegido por transacciones
    cm.getConnectionCallbackTransaction(function (err, con) {
        if (err) return con.rollback(function () { done(err) });
        // Obtener la información del contrato
        module.exports.getContrato(contratoId, function (err, contratos) {
            if (err) return done(err)
            var contrato = contratos[0];
            delete contrato.telefono1;
            delete contrato.telefono2;
            delete contrato.email;
            delete contrato.emailFacturas;
            async.eachSeries(prefacturas, function (prefactura, callback) {
                generarUnaPrefactura(contrato, prefactura, con, function (err) {
                    if (err) return callback(err);
                    callback();
                });
            }, function (err) {
                if (err) return con.rollback(function () { done(err) });
                con.commit(function (err) {
                    if (err) return con.rollback(function () { done(err) });
                    if (prefacturas.length > 1 && !contrato.mantenedorId && contrato.tipoContratoId == 8) {
                        //comprobamos si hay descuadre
                        cm.getConnectionCallback(function (err, con) {
                            if (err) return done(err);
                            var sql = "SELECT SUM(totalConIva) AS totalConIvaPrefacturas FROM prefacturas WHERE contratoId = " + contrato.contratoId;
                            con.query(sql, function (err, data) {
                                cm.closeConnection(con);
                                if (err) return done(err);
                                done(null, 'OK');
                                /*  var descuadre = contrato.totalConIva  - data[0].totalConIvaPrefacturas
                                 if (descuadre != 0) {
                                     descuadre = descuadre.toFixed(4);
                                     cuadraUltimaPrefacturaContrato(contrato, descuadre,function (err, result) {
                                         if (err) return done(err);
                                         done(null, result);
                                     });
                                 } else {
                                     done(null, 'OK');
                                 } */
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
        sql += "(SELECT MAX(prefacturaId) FROM prefacturas WHERE contratoId = ? AND contratoPorcenId IS NULL) ORDER BY prefacturaLineaId ASC";
        sql = mysql.format(sql, contrato.contratoId);
        con.query(sql, function (err, lineas) {
            if (err) return callback(err);
            actualizaLineaDescuedre(lineas[0], descuadre, contrato, null, function (err, result) {
                if (err) return callback(err);
                callback(null, 'OK');
            })
        });
    });
}

var actualizaLineaDescuedre = function (linea, descuadre, contrato, nuevaBaseLin, callback) {
    var totalConIva = 0;
    var nuevoCoste = 0;
    var nuevoImporte = 0;
    var nuevoTotal = 0;
    if (descuadre) {
        descuadre = parseFloat(descuadre);
        totalConIva = (1 + (linea.porcentaje / 100)) * linea.totalLinea;
        nuevoCoste = ((totalConIva + descuadre) * linea.coste) / totalConIva;
        nuevoImporte = ((totalConIva + descuadre) * linea.importe) / totalConIva;
        nuevoTotal = ((totalConIva + descuadre) * linea.totalLinea) / totalConIva;
    }
    /*if(nuevaBaseLin) {
         totalConIva =  (1 + (linea.porcentaje/100)) * nuevaBaseLin;
         nuevoCoste = ((totalConIva) * linea.coste) / totalConIva;
         nuevoImporte = (totalConIva * linea.importe) / totalConIva;
         nuevoTotal = (totalConIva * linea.totalLinea) / totalConIva;
    }*/
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
    prefacturasDb.putPrefacturaLinea(linea.prefacturaLineaId, lin, function (err, result) {
        if (err) return callback(err);
        var bucle = false;
        if (nuevaBaseLin) bucle = true;
        compruebaAjuste(linea, contrato, bucle, function (err, result) {
            if (err) return callback(err);
            callback(null, 'OK');
        });
    });
}

var compruebaAjuste = function (linea, contrato, bucle, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT SUM(totalConIva) AS totalConIvaPrefacturas FROM prefacturas WHERE contratoId = " + contrato.contratoId;
        con.query(sql, function (err, data) {
            cm.closeConnection(con);
            if (err) return done(err);
            var descuadre = contrato.totalConIva - data[0].totalConIvaPrefacturas
            if (descuadre != 0) {
                descuadre = descuadre.toFixed(2);
                descuadre = parseFloat(descuadre);
                cuadraCuotaContrato(linea, contrato, descuadre, function (err, result) {
                    if (err) return done(err);
                    done(null);
                });
            } else {
                fnActualizarTotalesAjuste(linea.prefacturaId, function (err, result) {
                    if (err) return callback(err);
                    done(null);

                });
            }
        });
    });
}

var cuadraCuotaContrato = function (linea, contrato, descuadre, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return callback(err);
        var sql = "UPDATE prefacturas_bases";
        sql += " set cuota =";
        sql += " (SELECT tmp.cuota  FROM "
        sql += " (SELECT cuota + " + descuadre + "  AS cuota FROM prefacturas_bases WHERE";
        sql += " tipoIvaId = " + linea.tipoIvaId;
        sql += " AND prefacturaId  = " + linea.prefacturaId;
        sql += ") AS tmp)";
        sql += " WHERE tipoIvaId = " + linea.tipoIvaId;
        sql += " AND prefacturaId = " + linea.prefacturaId;
        con.query(sql, function (err, data) {
            cm.closeConnection(con);
            if (err) return callback(err);
            fnActualizarTotalesAjuste(linea.prefacturaId, function (err, result) {
                if (err) return callback(err);
                callback(null);

            });

            //buscamos las nuevas bases
            /*cm.getConnectionCallback(function (err, con) {
                var sql2 = " SELECT * from prefacturas_bases";
                sql2 += " WHERE prefacturaId = " + linea.prefacturaId;
                con.query(sql2, function (err, bases) {
                    cm.closeConnection(con);
                    if(err) return callback(err);
                    var otrasBasesSum = 0;
                    var nuevaBaseSum;
                    var nuevaBaseLin;
                    for(var i = 0; i < bases.length; i++) {
                        if(bases[i].tipoIvaId != linea.tipoIvaId) {
                            otrasBasesSum = otrasBasesSum + bases[i].base;
                        } else {
                            nuevaBaseSum = bases[i].base;
                        }
                    }
                    nuevaBaseLin = nuevaBaseSum - otrasBasesSum
                    actualizaLineaDescuedre(linea, null, contrato, nuevaBaseLin, function(err, result) {
                        if(err) return callback(err);
                        callback(null, result);
                    });
                });
            });*/
        });
    });
}


var fnActualizarTotalesAjuste = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return callback(err);
        var sql = "UPDATE prefacturas AS pf,";
        sql += " (SELECT prefacturaId, SUM(base) AS b, SUM(cuota) AS c";
        sql += " FROM prefacturas_bases GROUP BY 1) AS pf2,";
        sql += " (SELECT prefacturaId, SUM(coste) AS sc";
        sql += " FROM prefacturas_lineas GROUP BY 1) AS pf3";
        sql += " SET pf.total = pf2.b, totalAlCliente = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
        sql += " pf.coste = pf3.sc";
        sql += " WHERE pf.prefacturaId = ?";
        sql += " AND pf2.prefacturaId = pf.prefacturaId";
        sql += " AND pf3.prefacturaId = pf.prefacturaId";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
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
    var datos = null
    // Todo el proceso debe estar protegido por transacciones
    cm.getConnectionCallbackTransaction(function (err, con) {
        if (err) return con.rollback(function () { done(err) });
        // Obtener la información del contrato
        module.exports.getContrato(antContratoId, function (err, contratos) {
            if (err) return done(err)
            var contrato = contratos[0];
            delete contrato.telefono1;
            delete contrato.telefono2;
            delete contrato.email;
            delete contrato.emailFacturas;
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
                    // Miramos si hay registros en la tabla contratorenovados
                    fnGetContratorenovados(con, antContratoId, function (err, result) {
                        if (err) return callback(err);
                        datos = result;
                        callback();
                    });
                }, function (callback) {
                    // Miramos si hay registros en la tabla contratorenovados
                    fnCreaContratorenovados(con, nuevoContratoId, antContratoId, datos, function (err) {
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
    var sql = "insert into contratos_lineas (linea, contratoId, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad,";
    sql += " importe, totalLinea, costeUnidad, coste, porcentajeBeneficio, importeBeneficioLinea, porcentajeAgente, importeAgenteLinea,";
    sql += " ventaNetaLinea, capituloLinea)";
    sql += " select linea, ?, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea, costeUnidad,";
    sql += " coste, porcentajeBeneficio, importeBeneficioLinea, porcentajeAgente, importeAgenteLinea, ventaNetaLinea, capituloLinea";
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
var fnActualizarContratoAnterior = function (con, nuevoContratoId, antContratoId, done) {
    var sql = "UPDATE contratos SET antContratoId = ? WHERE contratoId = ?";
    sql = mysql.format(sql, [antContratoId, nuevoContratoId]);
    con.query(sql, function (err, data) {
        if (err) return done(err);
        done(null, data);
    });
}

var fnGetContratorenovados = function (con, antContratoId, done) {
    var sql = "SELECT * FROM contratorenovados WHERE renovadoId = ? OR contratoOriginalId = ?";
    sql = mysql.format(sql, [antContratoId, antContratoId]);
    con.query(sql, function (err, data) {
        if (err) return done(err);
        done(null, data);
    });
}

var fnGetContratosrenovados = function (con, originalId, done) {
    var sql = "SELECT * FROM contratorenovados WHERE contratoOriginalId = ?";
    sql = mysql.format(sql, originalId);
    con.query(sql, function (err, data) {
        if (err) return done(err);
        done(null, data);
    });
}

var fnCreaContratorenovados = function (con, nuevoContratoId, antContratoId, data, done) {
    var obj = {
        contratoRenovadoId: 0,
        contratoOriginalId: antContratoId,
        renovadoId: nuevoContratoId,
        fechaRenovacion: new Date()
    }

    if (data.length > 0) {
        obj = {
            contratoRenovadoId: 0,
            contratoOriginalId: data[0].contratoOriginalId,
            renovadoId: nuevoContratoId,
            fechaRenovacion: new Date()
        }
    }
    var sql = "INSERT INTO contratorenovados SET ?";
    sql = mysql.format(sql, obj);
    con.query(sql, function (err, data) {
        if (err) return done(err);
        done();
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
                        if (prefacturaDb.contPlanificacionId) {
                            //si se trata de planificación actulizamos el importe prefacturado en la tabla contrato_planificacion
                            fnActualizarPrefacturadoPlanificacion(prefacturaDb.contPlanificacionId, prefacturaDb.totalAlCliente, con, function (err) {
                                if (err) return done(err);
                                done()
                            });
                        } else {
                            done();
                        }
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
        receptorNombre: cliente.nombreComercial,
        receptorDireccion: cliente.direccion,
        receptorCodPostal: cliente.codPostal,
        receptorPoblacion: cliente.poblacion,
        receptorProvincia: cliente.provincia,
        total: prefactura.importe,
        formaPagoId: contrato.formaPagoId,
        totalAlCliente: prefactura.importeCliente,
        retenGarantias: prefactura.retenGarantias,
        coste: prefactura.importeCoste,
        generada: 1,
        porcentajeBeneficio: prefactura.porcentajeBeneficio,
        porcentajeAgente: prefactura.porcentajeAgente,
        contratoId: contrato.contratoId,
        observaciones: contrato.obsFactura,
        periodo: prefactura.periodo,
        porcentajeRetencion: contrato.porcentajeRetencion,
        observacionesPago: prefactura.observacionesPago,
        contratoPorcenId: prefactura.contratoPorcenId,
        contPlanificacionId: prefactura.contPlanificacionId,
        numLetra: prefactura.numLetra,
        beneficioLineal: contrato.beneficioLineal
    };

    if (prefactura.formaPagoId) prefacturaDb.formaPagoId = prefactura.formaPagoId
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
        for (var i = 0; i < res.length; i++) {
            if (res[i].tipoProyectoId) {
                if (prefactura.tipoProyectoId == res[i].tipoProyectoId) {
                    if (res[i].serie_prefactura && res[i].serie_prefactura != '') {
                        serie = res[i].serie_prefactura;
                        break;
                    }
                }
            }
            if (res[i].departamentoId) {
                if (prefactura.departamentoId == res[i].departamentoId) {
                    if (res[i].serie_prefactura && res[i].serie_prefactura != '') {
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
    var lineaPrefacturaDb = {};
    if (!contrato.beneficioLineal) {
        lineaPrefacturaDb = {
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
    } else {
        lineaPrefacturaDb = {
            prefacturaLineaId: 0,
            linea: lineaContrato.linea,
            prefacturaId: prefacturaId,
            unidadId: lineaContrato.unidadId,
            articuloId: lineaContrato.articuloId,
            tipoIvaId: lineaContrato.tipoIvaId,
            porcentaje: lineaContrato.porcentaje,
            descripcion: lineaContrato.descripcion,
            cantidad: lineaContrato.cantidad,
            importe: lineaContrato.costeUnidad * divisor,
            totalLinea: lineaContrato.totalLinea * divisor,
            coste: lineaContrato.coste * divisor,
            porcentajeBeneficio: lineaContrato.porcentajeBeneficio,
            importeBeneficioLinea: lineaContrato.importeBeneficioLinea * divisor,
            porcentajeAgente: lineaContrato.porcentajeAgente,
            importeAgenteLinea: lineaContrato.importeAgenteLinea * divisor,
            ventaNetaLinea: lineaContrato.ventaNetaLinea * divisor,
            capituloLinea: lineaContrato.capituloLinea
        }
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
    sql += " pf.restoCobrar = (pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0)) - pf.retenGarantias,"
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

var fnActualizarPrefacturadoPlanificacion = function (id, importeCliente, con, callback) {
    var sql = "UPDATE contrato_planificacion";
    sql += " SET importePrefacturado = importePrefacturado + " + importeCliente;
    sql += " WHERE contPlanificacionId = ?"
    sql = mysql.format(sql, id);
    con.query(sql, function (err, result) {
        if (err) return callback(err);
        fnActualizarTotalesPrefacturas(id, con, function (err) {
            if (err) return callback(err);
            callback();
        });
    });
}


module.exports.putContrato = function (contrato, done) {
    actualizarEnBaseDatosContrato('PUT', contrato, done);
}

module.exports.putContratoResumen = function (datos, done) {
    actualizarEnBaseDatosContratoResumen('PUT', datos, done);
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


//DEVUELVE LAS PROFESIONES ASOCIADAS A UN PROVEEDOR
module.exports.getTecnicosAsociados = function (contratoId, callback) {
    var connection = cm.getConnection();
    var sql = "SELECT cc.comercialId, cc.nombre FROM contrato_tecnicos AS c";
    sql += " LEFT JOIN comerciales as cc on cc.comercialId = c.tecnicoId";
    sql += " WHERE c.contratoId = ?"
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) return callback(err, null);
        callback(null, result);
    });
}



module.exports.deleteContrato = function (contrato, done) {
    // actualizamos previamente las referencias de ese contrato
    // en las contratos para evitar errores.
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

// postContratoLinea
// crear en la base de datos la linea de contrato pasada
module.exports.postContratoLineaNew = async function (contratoLinea, connection, callback) {
    try {
        if (!comprobarContratoLinea(contratoLinea)) {
            var err = new Error("La linea de contrato pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
            return callback(err);
        }
        contratoLinea.contratoLineaId = 0; // fuerza el uso de autoincremento
        sql = "INSERT INTO contratos_lineas SET ?";
        sql = mysql2.format(sql, contratoLinea);
        let [result] = await connection.query(sql)
        contratoLinea.contratoLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBasesNew(contratoLinea.contratoId, connection, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, contratoLinea);
        })
    } catch (err) {
        return callback(err);
    }
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
    sql += " INNER JOIN contratos_lineas as cntl ON cntl.contratoId = cnt.contratoId";
    sql += " WHERE cnt.contratoId = ?";
    sql = mysql.format(sql, contratoId);
    con.query(sql, function (err, lineas) {
        con.end();
        if (err) return done(err);
        if (lineas.length > 0) {
            // Tratamos secuencialmente sus líneas
            async.eachSeries(lineas, function (linea, callback) {
                // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
                /* var porcentajeDelCoste = linea.coste / linea.costeContratoCompleta;
                var importeDelNuevoCoste = coste * porcentajeDelCoste;
                linea.coste = importeDelNuevoCoste; */
                // Recalculamos el total de la línea en base a los nuevos datos
                linea.totalLinea = obtenerImporteAlClienteDesdeCoste(linea.coste, porcentajeBeneficio, porcentajeAgente);
                linea.porcentajeBeneficio = porcentajeBeneficio;
                linea.porcentajeAgente = porcentajeAgente;
                // Eliminamos la propiedad que sobra para que la línea coincida con el registro
                delete linea.costeContratoCompleta;
                // Actualizamos la línea lo que actualizará de paso la contrato
                exports.putContratoLinea(linea.contratoLineaId, linea, function (err, result) {
                    if (err) return callback(err);
                    //Actualizamos los nuevos porcentajes en la cabecera
                    ActulizaPorcentajesCalculadora(porcentajeBeneficio, porcentajeAgente, contratoId, function (err, result) {
                        if (err) return callback(err);
                        callback(null);
                    });
                })
            }, function (err) {
                if (err) return done(err);
                done(null);
            });
        } else {
            done(null);
        }
    });

}


// recalculo de línea de contrato
module.exports.recalculoLineasContratoLineal = function (contratoId, porcentajeAgente, done) {
    var con = cm.getConnection();
    // Buscamos la líneas de la contrato
    sql = " SELECT cnt.coste as costeContratoCompleta, cntl.*";
    sql += " FROM contratos as cnt";
    sql += " INNER JOIN contratos_lineas as cntl ON cntl.contratoId = cnt.contratoId";
    sql += " WHERE cnt.contratoId = ?";
    sql = mysql.format(sql, contratoId);
    con.query(sql, function (err, lineas) {
        con.end();
        if (err) return done(err);
        if (lineas.length > 0) {
            // Tratamos secuencialmente sus líneas
            async.eachSeries(lineas, function (linea, callback) {
                // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
                /* var porcentajeDelCoste = linea.coste / linea.costeContratoCompleta;
                var importeDelNuevoCoste = coste * porcentajeDelCoste;
                linea.coste = importeDelNuevoCoste; */
                // Recalculamos el total de la línea en base a los nuevos datos
                var obj = obtenerImporteAlClienteDesdeCosteLineal(linea, porcentajeAgente);
                linea.totalLinea = obj.totalLinea;
                linea.importeAgenteLinea = obj.importeAgenteLinea;
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
        } else {
            done(null);
        }
    });

}

var ActulizaPorcentajesCalculadora = function (porcentajeBeneficio, porcentajeAgente, contratoId, callback) {
    var connection = cm.getConnection();
    sql = "UPDATE contratos SET porcentajeBeneficio = ?, porcentajeAgente = ? WHERE contratoId = ?";
    sql = mysql.format(sql, [porcentajeBeneficio, porcentajeAgente, contratoId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) return callback(err);
        callback(null, 'OK');
    });
}

var obtenerImporteAlClienteDesdeCoste = function (coste, porcentajeBeneficio, porcentajeAgente) {
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (porcentajeBeneficio) {
            importeBeneficio = porcentajeBeneficio * coste / 100;
        }
        ventaNeta = roundToTwo((coste * 1) + (importeBeneficio * 1));
    }
    if (porcentajeAgente != null) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - (porcentajeAgente * 1)) / 100));
        importeAgente = roundToTwo(importeAlCliente - roundToTwo(ventaNeta));
    }
    importeAlCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    return importeAlCliente;
}


var obtenerImporteAlClienteDesdeCosteLineal = function (linea, porcentajeAgente) {
    var totalLinea = 0;
    var importeAgenteLinea = 0;

    if (porcentajeAgente) {
        //vm.importeCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        totalLinea = roundToTwo(linea.ventaNetaLinea / ((100 - porcentajeAgente) / 100));
        //coste = roundToTwo((linea.ventaNetaLinea / ((100 - porcentajeAgente) / 100))/linea.cantidad);
        //importe = roundToTwo((linea.ventaNetaLinea / ((100 - porcentajeAgente) / 100))/linea.cantidad);
        importeAgenteLinea = roundToTwo(totalLinea - linea.ventaNetaLinea);
    }
    var obj = {
        totalLinea: totalLinea,
        importeAgenteLinea: importeAgenteLinea
    }
    return obj;
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

// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la contrato pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBasesNew = async function (id, connection, callback) {
    fnBorraBasesNew(id, connection, async function (err, res) {
        if (err) {
            return callback(err);
        }
        try {
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
            await connection.query(sql);
            // Antes de volver actualizamos los totales y así está hecho
            fnActualizarTotalesNew(id, connection, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        } catch (err) {
            return callback(err);
        }
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

// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de factura
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotalesNew = async function (id, connection, callback) {
    try {
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
        await connection.query(sql);
        callback(null);
    } catch (err) {
        callback(err);
    }
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


// fnBorraBases
// elimina las bases y cuotas de una contrato
// antes de actualizarlas
var fnBorraBasesNew = async function (id, connection, callback) {
    try {
        sql = "DELETE FROM contratos_bases";
        sql += " WHERE contratoId = ?";
        sql = mysql2.format(sql, id);
        await connection.query(sql);
        callback(null);
    } catch (err) {
        callback(err);
    }
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

//metodo POST nuevo
module.exports.postContratoComisionistaComprueba = async (contratoComisionista) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT tipoComercialId FROM comerciales WHERE comercialId = ?";
            sql = mysql2.format(sql, contratoComisionista.comercialId);
            const [result] = await connection.query(sql);
            var tipoComercialId = result[0].tipoComercialId
            //buscamos si existe ese tipo de comercial asociado al contrato en la tabla contratos_comisionistas
            sql = "SELECT * FROM contratos_comisionistas as cc";
            sql += " LEFT JOIN comerciales as c ON c.comercialId = cc.comercialId"
            sql += " WHERE cc.contratoId = ? AND c.tipoComercialId = ?"
            sql = mysql2.format(sql, [contratoComisionista.contratoId, tipoComercialId]);
            const [result2] = await connection.query(sql);
            //si se devuelven registros es que ese tipo de comercial ya está sociado al contrato, lanzamos un error
            if (result2.length > 0) {
                resolve(result2);
            } else {
                //creamos el registro
                sql = "INSERT INTO contratos_comisionistas SET ?";
                sql = mysql2.format(sql, contratoComisionista);
                const [result3] = await connection.query(sql);
                await connection.end();
                resolve(result2);
            }
        } catch (error) {
            if (!connection.connection._closing) {
                await connection.end();
            }
            reject(error);
        }
    });
}


//--------------------RESULTADO CONTRATO ASOCIADO A FACTURAS PROVEEDORES----------------------










//devuelve el resultado del contrato asociado a una factura de proveedor
module.exports.getContratoAsociadoFacprove = function (facproveId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT";
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

        sql += " WHERE ser.facproveId = " + facproveId;
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
        var sql = "SELECT";
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

        sql += " WHERE ser.antproveId = " + antproveId;
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
        sql += " em.nombre AS empresa, cl.nombre AS cliente,  cl.telefono1, cl.telefono2, cl.email, cl.emailFacturas, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE contratoCerrado = 0";
        if (dapartamentoId > 0) {
            sql += " AND cnt.tipoContratoId = " + dapartamentoId;
        } else {
            sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        sql += " ORDER BY cnt.fechaInicio DESC";
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
        sql += " em.nombre AS empresa, cl.nombre AS cliente,  cl.telefono1, cl.telefono2, cl.email, cl.emailFacturas, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        if (departamentoId > 0) {
            sql += " WHERE cnt.tipoContratoId = " + departamentoId;
        } else {
            sql += " WHERE cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        sql += " ORDER BY cnt.fechaInicio DESC";
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
        sql += " em.nombre AS empresa, cl.nombre AS cliente, cl.telefono1, cl.telefono2, cl.email, cl.emailFacturas, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE NOW() >= DATE_SUB(cnt.fechaFinal, INTERVAL COALESCE(cnt.preaviso, 0) DAY) AND contratoCerrado = 0";
        if (departamentoId > 0) {
            sql += " AND cnt.tipoContratoId = " + departamentoId;
        } else {
            sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        sql += " ORDER BY cnt.fechaInicio DESC";
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

module.exports.getContratosEmpresaClienteDepartamento = function (empresaId, clienteId, usuarioId, departamentoId, usaContrato, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var cadenaSql = '';
        if (usaContrato == 0) usaContrato = false;
        if (!usaContrato) cadenaSql = ' OR cnt.clienteId IS NULL';
        if (departamentoId) cadenaSql += ' AND cnt.tipoContratoId = ' + departamentoId;
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE cnt.empresaId = ? AND ((cnt.clienteId = ? OR cnt.mantenedorId = ? )" + cadenaSql + ")";
        sql += " AND cnt.contratoCerrado = 0 AND dp.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = ?) "
        sql = mysql.format(sql, [empresaId, clienteId, clienteId, usuarioId]);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}


module.exports.getContratosEmpresaClienteDepartamentoTodos = function (empresaId, clienteId, usuarioId, departamentoId, usaContrato, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var cadenaSql = '';
        if (usaContrato == 0) usaContrato = false;
        if (!usaContrato) cadenaSql = ' OR cnt.clienteId IS NULL';
        if (departamentoId) cadenaSql += ' AND cnt.tipoContratoId = ' + departamentoId;
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE cnt.empresaId = ? AND ((cnt.clienteId = ? OR cnt.mantenedorId = ? )" + cadenaSql + ")";
        sql += " AND dp.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = ?) "
        sql = mysql.format(sql, [empresaId, clienteId, clienteId, usuarioId]);
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
        sql += " WHERE contratoCerrado = 1 AND tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")";
        sql += " ORDER BY contratoId";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}




// private functions

var fnContratosFromDbToJson = function (contratos) {
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
            INT: f.ITC - f.IA,
            CT: f.CT,
            BT: (f.ITC - f.IA) - f.CT,
            pBT: ((f.ITC - f.IA) - f.CT) / (f.ITC - f.IA) * 100,
            IF: f.IMF,
            INR: f.IMF - f.IA,
            CR: f.CR,
            BR: (f.IMF - f.IA) - f.CR,
            pBR: (((f.IMF - f.IA) - f.CR) / (f.IMF - f.IA)) * 100
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
                return done(new Error('Comando de actualización incorrecto'));
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


var actualizarEnBaseDatosContratoResumen = function (comando, datos, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "";
        var contrato = datos.contrato;
        var tecnicos = datos.tecnicos[0];
        switch (comando) {
            case 'PUT':
                sql = "UPDATE contratos SET ? WHERE contratoId = ?";
                sql = mysql.format(sql, [contrato, contrato.contratoId]);
                break;
            default:
                return done(new Error('Comando de actualización incorrecto'));
                break;
        }
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            if (comando == 'PUT') {
                ///Ahora creamos los registros en contratos_tecnicos
                updateTecnicosAsociados(tecnicos, contrato.contratoId, function (err) {
                    if (err) return done(err);
                    done(null, contrato);
                });
            } else {
                done(null, datos);
            }
        })
    });
}

var updateTecnicosAsociados = function (tecnicos, contratoId, done) {
    //primero borramos todos las profesiones asociadas al proveedor
    var connection = cm.getConnection();

    sql = "DELETE FROM contrato_tecnicos  WHERE contratoId = ?";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) return done(err);

        async.forEachSeries(tecnicos, function (tecnico, callback) {
            var contrato_tecnico = {
                contratoTecnicoId: 0,
                tecnicoId: tecnico,
                contratoId: contratoId
            }
            var connection2 = cm.getConnection();
            var sql2 = "INSERT INTO contrato_tecnicos SET ?";
            sql2 = mysql.format(sql2, contrato_tecnico);
            connection2.query(sql2, function (err) {
                cm.closeConnection(connection2);
                if (err) return callback(err);
                callback();
            })
        }, function (err) {
            if (err) return done(err);
            done();
        });

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
        if (err) return callback(err);
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

// getConceptoCobroLinea
module.exports.getConceptoCobroLinea = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return callback(err);
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
        if (err) return callback(err);
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
        if (err) return callback(err);
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
        if (err) return callback(err);
        sql = "DELETE from contrato_porcentajes WHERE contratoPorcenId = ?";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return callback(err);
            callback(null);
        });
    });
}

// getConceptoCobroLineas
module.exports.getcontratosVinculados = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return callback(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += "  WHERE cnt.ascContratoId = ?";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return callback(err, null);
            if (result.length == 0) return callback(null, null);
            callback(null, result);
        });
    });
}


// postContratoAsociado
// crear en la base de datos el contrato asociado
module.exports.postContratoAsociado = function (contratoId, callback) {
    //primero obtenemos la referencia del contrato asociado
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var id;
        var sql = "SELECT COALESCE(SUBSTRING_INDEX(MAX(SUBSTRING_INDEX(referencia, '-',-1)), 'ASC' , -1), 0) +1 AS mxref ";
        sql += " FROM contratos";
        sql += " WHERE ascContratoId = ?";
        sql = mysql.format(sql, contratoId);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return callback(err);
            var subref = "-ASC" + result[0].mxref;
            cm.getConnectionCallback(function (err, con) {
                if (err) return done(err);
                var id;
                sql = "INSERT INTO contratos";
                sql += " (SELECT 0 AS contratoId, tipoContratoId, CONCAT(referencia, '" + subref + "') AS referencia, tipoProyectoId, empresaId, clienteId, mantenedorId, agenteId, fechaContrato";
                sql += " ,0 AS coste, porcentajeBeneficio ,0 AS importeBeneficio, 0 AS ventaNeta, porcentajeAgente, 0 AS importeAgente, 0 AS  importeCliente";
                sql += " , 0 AS importeMantenedor, observaciones, formaPagoId, 0 AS total, 0 AS totalConIva, fechaInicio, fechaFinal"
                sql += " ,fechaPrimeraFactura, ofertaId, fechaOriginal, facturaParcial, preaviso, NULL AS antContratoId , " + contratoId + " AS ascContratoId, obsFactura, direccion";
                sql += " ,codPostal, poblacion, provincia, tipoViaId, porcentajeRetencion, fechaSiguientesFacturas, 0 AS contratoCerrado";
                sql += "  ,0  AS liquidarBasePrefactura, 0 AS  sel, NULL AS servicioId, 0 AS intereses,";
                sql += " COALESCE(certificacionFinal, 0) AS certificacionFinal,";
                sql += " COALESCE(firmaActa, 0) AS firmaActa,";
                sql += " fechaFirmaActa,";
                sql += " fechaCertFinal,";
                sql += " 0 AS contratoIntereses,";
                sql += " 0 AS externo";
                sql += " FROM contratos WHERE contratoId = ?)";
                sql = mysql.format(sql, contratoId);
                con.query(sql, function (err, result2) {
                    cm.closeConnection(con);
                    if (err) return callback(err);
                    id = result2.insertId;
                    cm.getConnectionCallback(function (err, con) {
                        if (err) return done(err);
                        sql = "INSERT INTO contratos_comisionistas";
                        sql += " (SELECT 0 AS contratoComisionistaId, " + id + " AS contratoId, comercialId, porcentajeComision, 0 AS liquidado, 0 AS sel";
                        sql += " FROM contratos_comisionistas WHERE contratoId = ?)";
                        sql = mysql.format(sql, contratoId);
                        con.query(sql, function (err, result3) {
                            cm.closeConnection(con);
                            if (err) return callback(err);
                            callback(null, result2);
                        });
                    });
                });
            });

        });
    });
}

// putConceptoCobro
// Modifica el ConceptoCobro según los datos del objeto pasao
module.exports.putcontratosVinculados = function (contratoId, contrato, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return callback(err);
        sql = "UPDATE contratos SET ? WHERE ascContratoId = ?";
        sql = mysql.format(sql, [contrato, contratoId]);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    });
}


//PLANIFICACION

//getPlanificacionLineas
module.exports.getPlanificacionLineas = async (id, numCobros) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT cp.*,";
            sql += " fp.nombre AS formaPagoNombre,";
            sql += " fp.tipoFormaPagoId,";
            sql += " fp.esLetra,";
            sql += " COUNT(p.prefacturaId) AS numPrefacturas,";
            sql += " COUNT(f.facturaId) AS numFacturas,";
            sql += " 0 AS numCobros";
            sql += " FROM contrato_planificacion AS cp";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cp.formaPagoId";
            sql += " LEFT JOIN prefacturas AS p ON p.contPlanificacionId = cp.contPlanificacionId";
            sql += " LEFT JOIN facturas AS f ON f.facturaId = p.facturaId";
            sql += " WHERE cp.contratoId = ?";
            sql += " GROUP BY cp.contPlanificacionId"
            sql = mysql.format(sql, id);
            const [result] = await connection.query(sql);
            if (result && numCobros) {
                if (result.length > 0 && numCobros.length > 0) {
                    result.forEach(function (c) {
                        numCobros.forEach(function (n) {
                            if (c.contPlanificacionId == n.contPlanificacionId) {
                                c.numCobros = n.numCobros;
                            }
                        });
                    })
                }
            }
            await connection.end();
            resolve(result);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) await connection.end();
            }
            reject(error);

        }
    });
}

//getPlanificacionLineas
module.exports.getPlanificacionLinea = async (id) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT cp.*, fp.nombre AS formaPagoNombre, fp.esLetra, f.prefacturaId"
            sql += " FROM contrato_planificacion AS cp";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cp.formaPagoId";
            sql += " LEFT JOIN prefacturas AS p ON p.contPlanificacionId = cp.contPlanificacionId";
            sql += " LEFT JOIN facturas AS f ON f.prefacturaId = p.prefacturaId";
            sql += "  WHERE cp.contPlanificacionId = ?";
            sql = mysql.format(sql, id);
            const [result] = await connection.query(sql);
            await connection.end();
            resolve(result);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) await connection.end();
            }
            reject(error);

        }
    });
}

//postPlanificacionLineas
module.exports.postPlanificacionLineas = async (planificacion) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "INSERT INTO contrato_planificacion SET ?";
            sql = mysql.format(sql, planificacion);
            const [result] = await connection.query(sql);
            await connection.end();
            planificacion.contPlanificacionId = result.insertId;
            resolve(planificacion);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) await connection.end();
            }
            reject(error);
        }
    });
}

//postPlanificacionLineas
module.exports.postPlanificacionLineasTemp = async (planificacion) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "INSERT INTO contrato_planificacion_temporal SET ?";
            sql = mysql.format(sql, planificacion);
            const [result] = await connection.query(sql);
            await connection.end();
            planificacion.contPlanificacionTempId = result.insertId;
            resolve(planificacion);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) await connection.end();
            }
            reject(error);
        }
    });
}


//postPlanificacionLineas
module.exports.postPlanificacionLineasTempExterno = async (planificacion) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            connection.beginTransaction();
            //PRIMERO SI NO EXISTE EL PORCENTAJE LO CALCULAMOS
            for (let p of planificacion) {
                if (p.porcentaje == 0 || !p.porcentaje) {
                    let sql = "SELECT SUM(importeCliente) AS totalContrato FROM contratos WHERE contratoId = ? ";;
                    sql = mysql2.format(sql, p.contratoId);
                    const [datos] = await connection.query(sql);
                    p.porcentaje = (datos[0].totalContrato > 0) ? (p.importe * 100) / datos[0].totalContrato : 0;
                }
                sql = "INSERT INTO contrato_planificacion_temporal SET ?";
                sql = mysql2.format(sql, p);
                const [result] = await connection.query(sql);
                p.contPlanificacionTempId = result.insertId;
            }
            await connection.commit();
            await connection.end();
            resolve(planificacion);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) {
                    await connection.rollback();
                    await connection.end();
                }
            }
            reject(error);
        }
    });
}

//putPlanificacionLinea
module.exports.putPlanificacionLinea = async (planificacion, id) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "UPDATE contrato_planificacion SET ? WHERE contPlanificacionId = ? ";
            sql = mysql.format(sql, [planificacion, id]);
            const [result] = await connection.query(sql);
            await connection.end();
            resolve(planificacion);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) await connection.end();
            }
            reject(error);
        }
    });
}

//putPlanificacionLinea
module.exports.deletePlanificacionLinea = async (id) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            await connection.beginTransaction();
            sql = "DELETE FROM contrato_planificacion WHERE contPlanificacionId = ? ";
            sql = mysql.format(sql, id);
            const [result] = await connection.query(sql);
            sql = "DELETE FROM prefacturas WHERE contPlanificacionId = ? ";
            sql = mysql.format(sql, id);
            await connection.commit();
            await connection.end();
            resolve(result);

        } catch (error) {
            if (!connection.connection._closing) {
                await connection.rollback();
                await connection.end();
            }
            reject(error);
        }
    });
}

// PLANIFICACION TEMPORAL

//getPlanificacionLineasTemp
module.exports.getPlanificacionLineasTemp = async (id) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT cp.*,";
            sql += " fp.nombre AS formaPagoNombre,";
            sql += " fp.tipoFormaPagoId,";
            sql += " fp.esLetra,";
            sql += " COUNT(p.prefacturaTempId) AS numPrefacturas";
            sql += " FROM contrato_planificacion_temporal AS cp";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cp.formaPagoId";
            sql += " LEFT JOIN prefacturas_temporal AS p ON p.contPlanificacionTempId = cp.contPlanificacionTempId";
            sql += " WHERE cp.contratoId = ?";
            sql += " GROUP BY cp.contPlanificacionTempId"
            sql = mysql.format(sql, id);
            const [result] = await connection.query(sql);
            await connection.end();
            resolve(result);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) await connection.end();
            }
            reject(error);

        }
    });
}

//getPlanificacionLineaTemp
module.exports.getPlanificacionLineaTemp = async (id) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT cp.*, fp.nombre AS formaPagoNombre, fp.esLetra"
            sql += " FROM contrato_planificacion_temporal AS cp";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cp.formaPagoId";
            sql += "  WHERE cp.contPlanificacionTempId = ?";
            sql = mysql.format(sql, id);
            const [result] = await connection.query(sql);
            await connection.end();
            resolve(result);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) await connection.end();
            }
            reject(error);

        }
    });
}

//putPlanificacionLineaTemp
module.exports.putPlanificacionLineaTemp = async (planificacion, id) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "UPDATE contrato_planificacion_temporal SET ? WHERE contPlanificacionTempId = ? ";
            sql = mysql.format(sql, [planificacion, id]);
            const [result] = await connection.query(sql);
            await connection.end();
            resolve(planificacion);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) await connection.end();
            }
            reject(error);
        }
    });
}

//deletePlanificacionLineaTemp
module.exports.deletePlanificacionLineaTemp = async (id) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            await connection.beginTransaction();
            sql = "DELETE FROM contrato_planificacion_temporal WHERE contPlanificacionTempId = ? ";
            sql = mysql.format(sql, id);
            const [result] = await connection.query(sql);
            sql = "DELETE FROM prefacturas_temporal WHERE contPlanificacionTempId = ? ";
            sql = mysql.format(sql, id);
            const [result2] = await connection.query(sql);
            await connection.commit();
            await connection.end();
            resolve(result);

        } catch (error) {
            if (connection) {
                if (!connection.connection._closing) {
                    await connection.rollback();
                    await connection.end();
                }
            }
            reject(error);
        }
    });
}

//DOCUMENTACION
module.exports.getContratoDocumentacion = async (contratoId, departamentoId, ofertaId) => {
    let con = null;
    var documentos = null;
    var carpetas = null
    var ids = [];
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT carpetaId, nombre As carpetaNombre, tipo";
            sql += " FROM carpetas";
            sql += " WHERE (tipo = 'contrato' AND departamentoId = " + departamentoId + ")";
            if (ofertaId > 0) {
                sql += " OR  (tipo = 'oferta' AND departamentoId = " + departamentoId + ")";
            }
            sql += " ORDER BY tipo"
            const [carpe] = await con.query(sql);
            carpetas = carpe;
            sql = "SELECT of.contratoDocumentoId,";
            sql += " of.contratoId,";
            sql += " of.carpetaId,";
            sql += " of.location,";
            sql += " of.key";
            sql += " FROM contratodocumentacion AS of";
            sql += " WHERE of.contratoId = " + contratoId;
            const [docum] = await con.query(sql);
            await con.end();
            if (docum.length > 0) {
                documentos = docum;
                documentos = ProcesaDocumObj(documentos, carpetas);
            } else {
                resolve(carpetas)
            }
            resolve(documentos)

        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}


module.exports.getContratoDocumento = async (contratoDocumentoId) => {
    let con = null;
    var documento = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT *";
            sql += " FROM contratodocumentacion";
            sql += " WHERE contratoDocumentoId = " + contratoDocumentoId;
            const [docum] = await con.query(sql);
            await con.end();
            if (docum.length > 0) {
                documento = docum[0];
            }
            resolve(documento)

        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}


module.exports.getDocumentosCarpeta = async (carpetaId) => {
    let con = null;
    var documentos = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT *";
            sql += " FROM contratodocumentacion";
            sql += " WHERE carpetaId = " + carpetaId;
            const [docums] = await con.query(sql);
            await con.end();
            if (docums.length > 0) {
                documentos = docums;
            }
            resolve(documentos)

        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

module.exports.postContratoDocumentacion = async (contratoDocumentacion, ofertaId) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "INSERT INTO contratodocumentacion SET ?";
            sql = mysql2.format(sql, contratoDocumentacion);
            const [result] = await con.query(sql);
            if (ofertaId > 0) {
                var ofertaDocumentacion =
                {
                    ofertaDocumentoId: 0,
                    ofertaId: ofertaId,
                    carpetaId: contratoDocumentacion.carpetaId,
                    location: contratoDocumentacion.location,
                    key: contratoDocumentacion.key
                }
                con = await mysql2.createConnection(obtenerConfiguracion());
                sql = "INSERT INTO ofertadocumentacion SET ?";
                sql = mysql2.format(sql, ofertaDocumentacion);
                const [result2] = await con.query(sql);
                await con.end();
                resolve(result);
            } else {
                await con.end();
                resolve(result);
            }


        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

module.exports.putContratoDocumentacion = async (contratoDocumentacion, id) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "UPDATE contratodocumentacion SET ? WHERE contratoDocumentoId = ?";
            sql = mysql2.format(sql, [contratoDocumentacion, id]);
            const [result] = await con.query(sql);
            await con.end();
            resolve(result);

        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}



module.exports.postContratoDocumentacionCarpeta = async (carpeta) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "INSERT INTO carpetas SET ?";
            sql = mysql2.format(sql, carpeta);
            const [result] = await con.query(sql);
            await con.end();
            resolve(result);

        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            if (e.errno == 1062) {
                e.message = 'NO SE PUEDE CREAR, CARPETA DUPLICADA';
                reject(e.message);
            } else {
                reject(e);
            }
        }
    });
}

module.exports.deleteContratoDocumentacion = async (id) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "DELETE from contratodocumentacion WHERE contratoDocumentoId = ?";
            sql = mysql2.format(sql, id);
            const [result] = await con.query(sql);
            await con.end();
            resolve(result);

        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}


module.exports.deleteContratoCarpeta = async (id) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            await con.beginTransaction();
            //primero recuperamos la carpeta que vamos a borrar
            sql = "SELECT * FROM carpetas WHERE carpetaId = ?";
            sql = mysql2.format(sql, id);
            const [result] = await con.query(sql);
            //borramos los docuemntos de la carpeta
            sql = "DELETE from contratodocumentacion WHERE carpetaId = ?";
            sql = mysql2.format(sql, id);
            const [result2] = await con.query(sql);

            //borramos la carpeta
            sql = "DELETE from carpetas WHERE carpetaId = ?";
            sql = mysql2.format(sql, id);
            const [result3] = await con.query(sql);
            await con.commit();
            await con.end();
            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null)
            }


        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.rollback();
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

module.exports.getRenovado = function (contratoId, callback) {
    var con = cm.getConnection();
    fnGetContratorenovados(con, contratoId, function (err, result) {
        cm.closeConnection(con);
        if (err) return callback(err);
        callback(null, result);
    });
}

module.exports.getRenovados = function (contratoOriginalId, callback) {
    var con = cm.getConnection();
    fnGetContratosrenovados(con, contratoOriginalId, function (err, result) {
        cm.closeConnection(con);
        if (err) return callback(err);
        callback(null, result);
    });
}

var ProcesaDocumObj = function (doc, carpeta) {
    //if((doc.length == 1 && !doc[0].facproveId) || (doc.length == 1 && !doc[0].antproveId)) return doc;
    var antdir = null;
    var cont = 1;
    var regs = [];
    var docObj = {

    };
    var dirObj = {

    };

    carpeta.forEach(d => {
        doc.forEach(e => {
            if (antdir) {
                if (antdir == d.carpetaId) {
                    if (e.contratoDocumentoId) {//procesamos las facturas
                        docObj = {
                            contratoDocumentoId: e.contratoDocumentoId,
                            location: e.location,
                            key: e.key

                        };
                        if (d.carpetaId == e.carpetaId) {
                            dirObj.documentos.push(docObj);
                        }
                        docObj = {}; //una vez incluida la factura en el documento se limpian los datos
                    }
                    antdir = d.carpetaId;

                } else {
                    //si es otro documento de pago guardamos el anterior y creamos otro
                    regs.push(dirObj);
                    dirObj = {
                        carpetaNombre: d.carpetaNombre,
                        carpetaId: d.carpetaId,
                        tipo: d.tipo,
                        documentos: [],
                    };
                    if (e.contratoDocumentoId) {//procesamos las facturas
                        docObj = {
                            contratoDocumentoId: e.contratoDocumentoId,
                            location: e.location,
                            key: e.key

                        };

                        if (d.carpetaId == e.carpetaId) {
                            dirObj.documentos.push(docObj);
                        }
                        docObj = {}; //una vez incluida la factura en el documento se limpian los datos
                    }


                    antdir = d.carpetaId;
                }

            }
            if (!antdir) {
                dirObj = {
                    carpetaNombre: d.carpetaNombre,
                    carpetaId: d.carpetaId,
                    tipo: d.tipo,
                    documentos: [],
                };
                if (e.contratoDocumentoId) {
                    docObj = {
                        contratoDocumentoId: e.contratoDocumentoId,
                        location: e.location,
                        key: e.key

                    };

                    if (d.carpetaId == e.carpetaId) {
                        dirObj.documentos.push(docObj);
                    }
                    docObj = {};
                }
                antdir = d.carpetaId;
            }
        });
        //si se trata del ultimo registro lo guardamos
        if (cont == carpeta.length) {
            regs.push(dirObj);
        }
        cont++;

    });


    return regs;
}


//INFORME CONTRATOS

//-------------------------------
module.exports.getContratosObj = async (dFecha, hFecha, empresaId, clienteId, departamentoId, tipoComercialId, comercialId, contratoId, usuarioId) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = " DELETE FROM tmp_contratos WHERE usuarioId = " + usuarioId + ";";
            sql += " INSERT INTO tmp_contratos"
            sql += " SELECT";
            sql += " c.contratoId,";
            sql += " c.referencia,";
            sql += " CAST(DATE_FORMAT(c.fechaInicio, '%d/%m/%Y') AS CHAR) AS fechaInicio,";
            sql += " CAST(DATE_FORMAT(c.fechaFinal, '%d/%m/%Y') AS CHAR) AS fechaFinal,";
            sql += " CAST(DATE_FORMAT(c.fechaFirmaActa, '%d/%m/%Y') AS CHAR) AS fechaFirmaActa,";
            sql += " COALESCE(c.certificacionFinal, 0) AS certificacionFinal,";
            sql += " IF(COALESCE(c.certificacionFinal, 0) <> 0, CAST((COALESCE(c.certificacionFinal, 0) * COALESCE(c.totalConIva, 0))/ COALESCE(c.importeCliente, 0) AS DECIMAL (12,2)), 0) AS certificacionFinalIva,";
            sql += " IF(COALESCE(c.certificacionFinal, 0) <> 0, c.certificacionFinal, COALESCE(c.importeCliente, 0)) AS total,";
            sql += " COALESCE(c.totalConIva, 0) AS totalConIva,";
            sql += " COALESCE(cl.coste, 0) AS coste,";
            sql += " IF(COALESCE(c.certificacionFinal, 0) <> 0, COALESCE(COALESCE(c.certificacionFinal, 0) - COALESCE(cl.coste, 0), 0), COALESCE(COALESCE(c.importeCliente, 0) - COALESCE(cl.coste, 0))) AS BI, ";
            sql += " IF(COALESCE(cl.coste, 0) <> 0, IF(COALESCE(c.certificacionFinal, 0) <> 0, COALESCE(((c.certificacionFinal - cl.coste)/cl.coste) * 100, 0) , COALESCE(((c.importeCliente - cl.coste)/cl.coste) * 100, 0)), 100) AS porBI, ";
            sql += " COALESCE((IF(COALESCE(c.certificacionFinal, 0) <> 0 , c.certificacionFinal, c.importeCliente) - COALESCE(cl.coste, 0)), 0) - COALESCE(c.importeAgente, 0) - COALESCE(co.importeComercial, 0) - COALESCE(jg.importejefeGrupo, 0) - COALESCE(jo.importejefeObras, 0) - COALESCE(a.importeArquitecto, 0) AS BINeto,";
            sql += " COALESCE(l.totLetras, 0) AS totLetras,"
            sql += " e.empresaId,";
            sql += " e.nombre AS nombreEmpresa,";
            sql += " cli.clienteId,";
            sql += " cli.nombre AS clienteNombre,";
            sql += " com2.comercialId AS agenteId, ";
            sql += " com2.nombre AS agenteNombre,";
            sql += " IF(COALESCE(c.certificacionFinal, 0) <> 0, COALESCE(c.certificacionFinal, 0) * COALESCE(c.porcentajeAgente/100, 0), COALESCE(c.importeAgente, 0)) AS importeAgente,";
            sql += " co.comercialId AS comercialId,";
            sql += " co.nombre AS comercialNombre,";
            sql += " COALESCE(co.importeComercial, 0) AS importeComercial ,  jg.comercialId AS jGrupoId, jg.nombre AS jGrupoNombre,";
            sql += " COALESCE(jg.importejefeGrupo, 0) AS importejefeGrupo,  jo.comercialId AS jObrasId, jo.nombre AS jObrasNombre,";
            sql += " COALESCE(jo.importejefeObras, 0) AS importejefeObras,  a.comercialId AS arquitectoId, a.nombre AS arquitectoNombre,";
            sql += " COALESCE(a.importeArquitecto, 0) AS importeArquitecto,";
            sql += " IF(c.fechaFirmaActa IS NULL, 'NO', 'SI') AS recepcionActa,";
            sql += " IF(c.certificacionFinal > 0, 'SI', 'NO') AS tieneCertFinal,";
            sql += " IF(c.contratoCerrado = 1, 'SI', 'NO') AS contratoCerrado,";
            sql += usuarioId + " AS usuarioId";
            sql += " FROM contratos AS c ";

            sql += " LEFT JOIN ";
            sql += " ( ";
            sql += "     SELECT co.contratoId, cc.comercialId, c.nombre, COALESCE(l.comision + COALESCE(l.anticipo, 0), 0) AS importeComercial  ";
            sql += "     FROM contratos AS co ";
            sql += "     LEFT JOIN contratos_comisionistas AS cc ON cc.contratoId = co.contratoId";
            sql += "     LEFT JOIN comerciales AS c ON c.comercialId = cc.comercialId ";
            sql += "     LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId ";
            sql += "     LEFT JOIN liquidacion_comercial AS l ON l.contratoId = co.contratoId AND l.comercialId = cc.comercialId ";
            sql += "     WHERE tc.tipoComercialId = 2 ";
            sql += "     AND l.facturaId IS NULL";
            sql += " ) AS co ON co.contratoId = c.contratoId ";
            sql += " LEFT JOIN ";
            sql += " ( ";
            sql += "     SELECT co.contratoId, cc.comercialId, c.nombre, COALESCE(l.comision + COALESCE(l.anticipo, 0), 0) AS importejefeGrupo  ";
            sql += "     FROM contratos AS co ";
            sql += "     LEFT JOIN contratos_comisionistas AS cc ON cc.contratoId = co.contratoId";
            sql += "     LEFT JOIN comerciales AS c ON c.comercialId = cc.comercialId ";
            sql += "     LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId ";
            sql += "     LEFT JOIN liquidacion_comercial AS l ON l.contratoId = co.contratoId AND l.comercialId = cc.comercialId";
            sql += "     WHERE tc.tipoComercialId = 3";
            sql += "     AND l.facturaId IS NULL";
            sql += " ) AS jg ON jg.contratoId = c.contratoId ";
            sql += " LEFT JOIN ";
            sql += " ( ";
            sql += "     SELECT co.contratoId, cc.comercialId, c.nombre, COALESCE(l.comision + COALESCE(l.anticipo, 0), 0) AS importejefeObras   ";
            sql += "     FROM contratos AS co ";
            sql += "     LEFT JOIN contratos_comisionistas AS cc ON cc.contratoId = co.contratoId";
            sql += "     LEFT JOIN comerciales AS c ON c.comercialId = cc.comercialId ";
            sql += "     LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId ";
            sql += "     LEFT JOIN liquidacion_comercial AS l ON l.contratoId = co.contratoId AND l.comercialId = cc.comercialId";
            sql += "     WHERE tc.tipoComercialId = 5";
            sql += "     AND l.facturaId IS NULL";
            sql += " ) AS jo ON jo.contratoId = c.contratoId ";
            sql += " LEFT JOIN ";
            sql += " ( ";
            sql += "     SELECT co.contratoId, cc.comercialId, c.nombre, COALESCE(l.comision + COALESCE(l.anticipo, 0), 0) AS importeArquitecto    ";
            sql += "     FROM contratos AS co ";
            sql += "     LEFT JOIN contratos_comisionistas AS cc ON cc.contratoId = co.contratoId";
            sql += "     LEFT JOIN comerciales AS c ON c.comercialId = cc.comercialId ";
            sql += "     LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId ";
            sql += "     LEFT JOIN liquidacion_comercial AS l ON l.contratoId = co.contratoId AND l.comercialId = cc.comercialId";
            sql += "     WHERE tc.tipoComercialId = 7";
            sql += "     AND l.facturaId IS NULL";
            sql += " ) AS a ON a.contratoId = c.contratoId ";
            sql += " LEFT JOIN";
            sql += " (";
            sql += "     SELECT fs.contratoId, SUM(fs.importe) AS coste FROM facprove AS f";
            sql += "     LEFT JOIN facprove_serviciados AS fs ON fs.facproveId = f.facproveId";
            sql += "     WHERE  f.esColaborador = 0";
            sql += "     GROUP BY fs.contratoId";
            sql += " ) AS cl ON cl.contratoId = c.contratoId";
            sql += " LEFT JOIN";
            sql += " (";
            sql += "      SELECT contratoId, COALESCE(SUM(totalConIva), 0) AS totletras";
            sql += "      FROM prefacturas AS pf WHERE NOT fechaRecibida IS NULL AND formaPagoId = 23";
            sql += "      GROUP BY contratoId ";
            sql += " ) AS l ON l.contratoId = c.contratoId";

            sql += " LEFT JOIN comerciales AS com2 ON com2.comercialId = c.agenteId ";

            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = c.clienteId ";
            sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = c.tipoContratoId ";

            sql += " LEFT JOIN empresas AS e ON e.empresaId = c.empresaId ";
            sql += " WHERE true";
            if (dFecha) {
                sql += " AND c.fechaInicio >= '" + dFecha + " 00:00:00'";
            }
            if (hFecha) {
                sql += " AND c.fechaInicio <= '" + hFecha + " 23:59:59'";
            }
            if (contratoId) {
                sql += " AND c.contratoId = " + contratoId;
            }
            if (empresaId) {
                sql += " AND c.empresaId = " + empresaId;
            }
            if (clienteId) {
                sql += " AND c.clienteId = " + clienteId;
            }
            if (tipoComercialId) {
                if (tipoComercialId == 1) {
                    sql += " AND NOT c.agenteId IS NULL";
                } else if (tipoComercialId == 2) {
                    sql += " AND NOT co.comercialId IS NULL";
                } else if (tipoComercialId == 3) {
                    sql += " AND NOT jg.comercialId IS NULL";
                } else if (tipoComercialId == 5) {
                    sql += " AND NOT jo.comercialId IS NULL";
                } else if (tipoComercialId == 7) {
                    sql += " AND NOT a.comercialId IS NULL";
                }
            }
            if (comercialId) {
                if (tipoComercialId) {
                    if (tipoComercialId == 1) {
                        sql += " AND c.agenteId = " + comercialId;
                    } else if (tipoComercialId == 2) {
                        sql += " AND co.comercialId = " + comercialId;
                    } else if (tipoComercialId == 3) {
                        sql += " AND jg.comercialId = " + comercialId;
                    } else if (tipoComercialId == 5) {
                        sql += " AND jo.comercialId  = " + comercialId;
                    } else if (tipoComercialId == 7) {
                        sql += " AND a.comercialId  = " + comercialId;
                    }
                }
            }
            if (departamentoId && departamentoId > 0) {
                sql += " AND c.tipoContratoId =" + departamentoId;
            } else {
                sql += " AND c.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
            }
            sql += " ORDER BY c.fechaInicio, c.contratoId";
            const [result] = await con.query(sql);
            if (result.length > 0) {

                resolve(result);

            } else {
                resolve(null)
            }
        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

module.exports.getCobrosObj = async (usuarioId) => {
    let con = null;
    var sql;
    var obj =
    {
        contratos: ""
    }
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            //Seleccionamos primero las ids de los registros qua acabamos de crear en la tabla temporal
            sql = " SELECT contratoId FROM tmp_contratos WHERE usuarioId = " + usuarioId;
            const [result] = await con.query(sql);
            sql = "DELETE FROM tmp_cobros WHERE usuarioId = " + usuarioId;
            const [borrado] = await con.query(sql);
            if (result.length > 0) {
                //buscamos los cobros relacionados con los contratos
                for (let s of result) {
                    sql = "SELECT * FROM facturas WHERE contratoId = ?";
                    sql = mysql2.format(sql, s.contratoId);
                    const [result2] = await con.query(sql);
                    if (result2.length > 0) {
                        //recuperampos los cobros de cada una de las facturas del contrato e insertamos los registros en la tabla temporal
                        for (let f of result2) {
                            sql = "SELECT f.facturaId, fp.formaPagoId, ano, numero, CAST(CONCAT(ano, LPAD(f.numero, 6, '0')) AS CHAR) AS numfac, serie, fecha, f.empresaId, e.nombre, e.contabilidad, f.total, f.totalConIva";
                            sql += " FROM facturas AS f";
                            sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId"
                            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId"
                            sql += " WHERE f.facturaId = ?";
                            sql = mysql2.format(sql, f.facturaId);
                            const [result3] = await con.query(sql);

                            var r = result3[0];
                            var numserie = r.serie;
                            var numfactu = r.numfac;
                            var b = numfactu.buffer;
                            var fecfactu = moment(r.fecha).format('YYYY-MM-DD');
                            var conta = r.contabilidad;
                            var facturaId = r.facturaId;
                            var formaPagoId = r.formaPagoId;
                            //
                            var hoy = moment(new Date()).format('YYYY-MM-DD');

                            sql = " INSERT INTO tmp_cobros"
                            sql += " SELECT ";
                            sql += s.contratoId + " AS contratoId,";
                            sql += formaPagoId + " AS formaPagoId,"
                            sql += " c.*, fp.nomforpa,";
                            sql += " IF(DATEDIFF( '" + hoy + "', c.fecultco) > 65, 1, 0) AS esSeguro, ";
                            sql += usuarioId + " AS usuarioId";
                            sql += " FROM " + conta + ".cobros AS c";
                            sql += " LEFT JOIN " + conta + ".formapago AS fp ON fp.codforpa = c.codforpa";
                            sql += " WHERE ";
                            sql += "(numserie =  ?";
                            sql += " AND numfactu = ?)";
                            sql += " AND fecfactu = ?";
                            sql = mysql.format(sql, [numserie, numfactu, fecfactu]);
                            sql += " OR";
                            sql += " (numserie = 'ANT'";
                            sql += " AND (numfactu, fecfactu) IN (SELECT CAST(CONCAT(ano,LPAD(numero, 6, 0)) AS CHAR) AS numfactu, a.fecha AS fecfactu";
                            sql += " FROM factura_antcliens AS fa";
                            sql += " LEFT JOIN antClien AS a ON a.antclienId = fa.antclienId";
                            sql += " WHERE fa.facturaId =  ?))";
                            sql = mysql.format(sql, facturaId);

                            sql += " ORDER BY c.fecvenci DESC";

                            let [result4] = await con.query(sql);
                        }

                    }

                }
                //una vez montadas las dos tablas temporales montamos el objeto del informe combinando las dos
                sql = " SELECT";
                sql += " c.*,";
                sql += " IF(COALESCE(c.certificacionFinal, 0) <> 0, CAST(COALESCE(((COALESCE(g.gestionado, 0) + COALESCE(c.totletras, 0)) / c.certificacionFinalIva) * 100, 0) AS DECIMAL(12,2)), CAST(COALESCE(((COALESCE(g.gestionado, 0) + COALESCE(c.totletras, 0)) / c.totalConIva) * 100, 0) AS DECIMAL(12,2))) AS gestionado,";
                sql += " IF(COALESCE(c.certificacionFinal, 0) <> 0, CAST(COALESCE((COALESCE(r.repercutido, 0) / c.certificacionFinalIva) * 100, 0) AS DECIMAL(12,2)), CAST(COALESCE((COALESCE(r.repercutido, 0) / c.totalConIva) * 100, 0) AS DECIMAL(12,2))) AS repercutido,";
                sql += " IF(NOT c.fechaFirmaActa IS NULL, c.fechaFirmaActa, c.fechaFinal) As fecFin"
                sql += " FROM tmp_contratos AS c";
                sql += " LEFT JOIN ";
                sql += " (";
                sql += "     SELECT contratoId, COALESCE(SUM(impcobro), 0) AS gestionado FROM tmp_cobros AS cc WHERE codforpa <> 12 AND usuarioId = " + usuarioId;
                sql += "     GROUP BY contratoId";
                sql += " ) AS g ON g.contratoId = c.contratoId";
                sql += " LEFT JOIN";
                sql += " (";
                sql += "     SELECT contratoId, COALESCE(SUM(impcobro), 0) AS repercutido FROM tmp_cobros AS cc WHERE esSeguro = 1  AND usuarioId = " + usuarioId;
                sql += "     GROUP BY contratoId";
                sql += " ) AS r ON r.contratoId = c.contratoId";
                sql += " WHERE c.usuarioId = " + usuarioId
                sql += " ORDER BY c.fechaInicio, c.contratoId"
                const [result5] = await con.query(sql);
                await con.end()
                obj.contratos = result5
                var resultado = JSON.stringify(obj);
                /* fs.writeFile(process.env.REPORTS_DIR + "\\inf_contratos.json", resultado, function(err) {
                    if(err) throw new Error(err);
                    resolve(obj)
                }); */
                resolve(obj)
            } else {
                await con.end()
                resolve(null)
            }
        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}


var crearObjJsonVisor = function (f, callback) {
    var connection = getConnection();
    var id = f.facturaId
    var subSql = "cnt.direccion AS direccion2, cnt.codPostal AS codPostal2, cnt.poblacion AS poblacion2, cnt.provincia AS provincia2,";
    if (f.departamentoId == 7) subSql = " cl.direccion2 AS direccion2, cl.codPostal2 AS codPostal2, cl.poblacion AS poblacion2, cl.provincia AS provincia2,"
    var obj =
    {
        cabecera: "",
        bases: "",
        lineas: ""
    }
    var sql = "SELECT pf.facturaId, pf.ano, pf.numero, pf.serie,  DATE_FORMAT(pf.fecha,'%d-%m-%Y') AS fecha, pf.empresaId, pf.clienteId, ";
    sql += "  pf.contratoClienteMantenimientoId,pf.importeAnticipo, pf.restoCobrar, pf.emisorNif, pf.emisorNombre, pf.emisorDireccion, pf.emisorCodPostal,";
    sql += " pf.emisorPoblacion, pf.emisorProvincia, tpv1.nombre AS receptorTipoVia,pf.receptorNif, pf.receptorNombre, pf.receptorDireccion, pf.receptorCodPostal, pf.receptorPoblacion,";
    sql += " pf.receptorProvincia,pf.total, pf.totalConIva, fp.nombre AS formaPago, pf.observaciones, pf.periodo, pf.porcentajeRetencion, pf.importeRetencion,";
    sql += " fp.numeroVencimientos, fp.primerVencimiento, fp.restoVencimiento, cl.proId, tpv.nombre AS postalTipoVia, cl.direccion3 AS postalDireccion,";
    sql += " cl.codPostal3 AS postalCodPostal, cl.poblacion3 AS postalPoblacion, cl.provincia3 AS postalProvincia,cl.iban,"
    sql += " DATE_FORMAT(DATE_ADD(pf.fecha,INTERVAL fp.primerVencimiento DAY), '%d-%m-%Y') AS vencimiento, pf.formaPagoId,";
    sql += " CONCAT(SUBSTR(cl.iban,1,20), '****')  AS cuenta,";
    sql += subSql;
    sql += " com.direccion AS direccionAgente, com.poblacion AS poblacionAgente, com.provincia AS provinciaAgente, com.codPostal AS codPostalAgente,"
    sql += " com.nif AS nifAgente, com.nombre AS nombreAgente, tpv2.nombre AS agenteTipoVia,  cnt.referencia AS refOferta";
    sql += " FROM facturas AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formapagoId";
    sql += " LEFT JOIN clientes AS cl ON cl.clienteId = pf.clienteId";
    sql += " LEFT JOIN tipos_via AS tpv ON tpv.tipoViaId = cl.tipoViaId3";
    sql += " LEFT JOIN tipos_via AS tpv1 ON tpv1.tipoViaId = cl.tipoViaId";
    sql += " LEFT JOIN comerciales AS com ON com.comercialId = cl.comercialId";
    sql += " LEFT JOIN tipos_via AS tpv2 ON tpv2.tipoViaId = com.tipoViaId";
    sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = pf.contratoId";
    sql += " LEFT JOIN ofertas AS of ON of.ofertaId = cnt.ofertaId";
    sql += " WHERE pf.facturaId =" + id;
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err, null);
        result[0].fecha = result[0].fecha.toString();
        result[0].vencimiento = result[0].vencimiento.toString();
        obj.cabecera = result[0];
        connection = getConnection();
        sql = "SELECT pfl.*, t.nombre AS tipoIva, ga.nombre AS grupo, par.numparte, ser.numservicio, u.abrev, pl.codigoArticulo, ser.direccionTrabajo,  par.refPresupuesto";
        sql += "  FROM facturas_lineas AS pfl";
        sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId";
        sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
        sql += " LEFT JOIN partes_lineas AS pl ON pl.facturaLineaId = pfl.facturaLineaId"
        sql += " LEFT JOIN partes AS par ON par.parteId = pl.parteId";
        sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId";
        sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
        sql += " WHERE pfl.facturaId =" + id;
        connection.query(sql, function (err, result2) {
            connection.end();
            if (err) return callback(err, null);
            obj.lineas = result2;
            connection = getConnection();
            sql = "SELECT pfb.*, t.nombre AS tipoIva, pfb.base AS baseImp ";
            sql += " FROM facturas_bases AS pfb";
            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfb.tipoIvaId";
            sql += " WHERE pfb.facturaId =" + id;
            connection.query(sql, function (err, result3) {
                connection.end();
                if (err) return callback(err, null);
                obj.bases = result3;
                closeConnectionCallback(connection, callback);
                return callback(null, obj);
            });
        });
    });
}


module.exports.getAnticiposNoVinculados = async (id) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            //await con.beginTransaction();
            var sql = "SELECT a.*, f.facproveAntproveId FROM contratos AS c ";
            sql += " LEFT JOIN `antprove_serviciados` AS s ON s.contratoId = c.contratoId";
            sql += " LEFT JOIN `antprove` AS a ON a.antproveId = s.antproveId";
            sql += " LEFT JOIN `facprove_antproves` AS f ON f.antproveId = s.antproveId";
            sql += " WHERE c.contratoId = ? AND f.facproveAntproveId IS NULL AND a.completo = 0";
            sql += " UNION";
            sql += " SELECT a.*, NULL AS facproveAntproveId FROM contratos AS c ";
            sql += " LEFT JOIN `antprove_serviciados` AS s ON s.contratoId = c.contratoId";
            sql += " LEFT JOIN `antprove` AS a ON a.antproveId = s.antproveId";
            sql += " WHERE c.contratoId = ? AND  a.completo = 1 AND a.facproveId IS NULL";
            sql = mysql2.format(sql, [id, id]);
            const [result] = await con.query(sql);
            await con.end();
            resolve(result);

        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

module.exports.getImplicadosContrato = async (id) => {
    let con = null;
    var sql = "";
    var implicadosInactivos = [];
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            //primero recuperamos los implicados de la tabla contratos
            sql = "SELECT";
            sql += " c.contratoId,";
            sql += " c.clienteId,";
            sql += " cl.nombre AS clienteNombre,";
            sql += " COALESCE(cl.activa, 0) AS clienteActivo,";
            sql += " c.mantenedorId,";
            sql += " cl2.nombre AS mantenedorNombre,";
            sql += " COALESCE(cl2.activa, 0) AS mantenedorActivo,";
            sql += " c.agenteId,";
            sql += " co.nombre AS agenteNombre,";
            sql += " COALESCE(co.activa, 0) AS agenteActivo";
            sql += " FROM contratos AS c";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = c.clienteId";
            sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = c.mantenedorId";
            sql += " LEFT JOIN comerciales AS co ON co.comercialId = c.agenteId";
            sql += " WHERE contratoId = ?";
            sql = mysql2.format(sql, id);
            const [result] = await con.query(sql);
            //ahora recuperamos los colaboredores del contrato para ver si estan activos
            sql = " SELECT";
            sql += " cc.comercialId AS colaboradorId,";
            sql += " c.nombre AS colaboradorNombre,";
            sql += " COALESCE(c.activa, 0) AS colaboradorActivo";
            sql += " FROM contratos_comisionistas AS cc";
            sql += " LEFT JOIN comerciales AS c ON c.comercialId = cc.comercialId";
            sql += " WHERE cc.contratoId = ?";
            sql = mysql2.format(sql, id);
            const [result2] = await con.query(sql);
            await con.end();
            //procesamos los resultados
            implicadosInactivos = compruebaInactivos(result, result2);
            resolve(implicadosInactivos);
        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

var compruebaInactivos = function (r1, r2) {
    var arr = [];
    //comprobamos los resultados
    for (r of r1) {
        if (r.clienteActivo == 0) {
            var obj = {
                cliente: r.clienteNombre
            }
            arr.push(obj);
        }
        if (r.mantenedorActivo == 0) {
            var obj = {
                mantenedor: r.mantenedorNombre
            }
            arr.push(obj);
        }
        if (r.agenteActivo == 0) {
            var obj = {
                agente: r.agenteNombre
            }
            arr.push(obj);
        }
    }

    for (s of r2) {
        if (s.colaboradorActivo == 0) {
            var obj = {
                colaborador: s.colaboradorNombre
            }
            arr.push(obj);
        }
    }

    return arr;
}



//RENOVACIÓN DE CONTRATOS MASIVA

module.exports.getContratosRenovar = async (dFecha, hFecha, departamentoId, preaviso) => {
    let con = null;
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            //primero actulizamos los contratos que se van a recuperar como no seleccionables.
            sql = "UPDATE contratos AS c";
            sql += " LEFT JOIN";
            sql += "(";
            sql += "   SELECT antContratoId FROM contratos WHERE antContratoId IS NOT NULL";
            sql += " ) AS tmp ON tmp.antContratoId = c.contratoId"
            sql += " SET c.sel = 0"
            sql += " WHERE c.contratoCerrado = 0 AND c.fechaInicio >= ? AND c.fechaInicio <= ? AND tmp.antContratoId IS NULL AND c.renovar = 1";
            sql = mysql2.format(sql, [dFecha, hFecha]);
            if (departamentoId > 0) {
                sql += " AND c.tipoContratoId = ?";
                sql = mysql2.format(sql, departamentoId);
            }
            if (preaviso == 'true') {
                sql += " AND NOW() >= DATE_SUB(c.fechaFinal, INTERVAL COALESCE(preaviso, 0) DAY)";
            }
            const [result] = await con.query(sql);
            sql = "SELECT DISTINCT cnt.*,";
            sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
            sql += " FROM contratos AS cnt";
            sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
            sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
            sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
            sql += " LEFT JOIN";
            sql += "(";
            sql += "   SELECT antContratoId FROM contratos WHERE antContratoId IS NOT NULL";
            sql += " ) AS tmp ON tmp.antContratoId = cnt.contratoId"
            sql += " WHERE cnt.sel = 0 AND cnt.contratoCerrado = 0 AND cnt.fechaInicio >= ? AND cnt.fechaInicio <= ?";
            sql += " AND tmp.antContratoId IS NULL AND cnt.renovar = 1";
            sql = mysql2.format(sql, [dFecha, hFecha]);
            if (departamentoId > 0) {
                sql += " AND cnt.tipoContratoId = ?";
                sql = mysql2.format(sql, departamentoId);
            }
            if (preaviso == 'true') {
                sql += " AND NOW() >= DATE_SUB(fechaFinal, INTERVAL COALESCE(preaviso, 0) DAY)";
            }
            const [contratos] = await con.query(sql);
            await con.end();
            resolve(contratos);
        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

module.exports.postRenovarContratos = async (dFecha, hFecha, departamentoId, preaviso) => {
    let con = null;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            let nuevoContratoId = 0;
            let antContratoId = 0
            let datos = null;
            let nuevasReferencias = []
            let nuevaFechaInicio;
            let nuevaFechaFinal;
            let nuevaFechaPrimeraFactuna
            let nuevaFechaContrato;
            let nuevoContrato;
            let prefacturas = [];
            let prefacturaDb = {};
            let lineasContrato = [];


            // Todo el proceso debe estar protegido por transacciones
            con = await mysql2.createConnection(obtenerConfiguracion());
            await con.beginTransaction();
            // Obtener la información del contrato
            let result = await getContrato2(dFecha, hFecha, departamentoId, preaviso, con);
            if (!result) throw new Error("No se encuentran los contratos");
            let contratos = result;
            for (let contrato of contratos) {
                let nuevoPrecio = contrato.importeAnualRenovacion;
                antContratoId = contrato.contratoId;

                nuevaFechaInicio = moment(contrato.fechaFinal).add(1, 'days').format('YYYY-MM-DD');
                nuevaFechaContrato = nuevaFechaInicio;
                nuevaFechaFinal = moment(contrato.fechaFinal).add(1, 'years').format('YYYY-MM-DD');
                nuevaFechaPrimeraFactuna = moment(contrato.fechaPrimeraFactura).add(1, 'years').format('YYYY-MM-DD');

                // Calculamos la diferencia en meses para saber cuantas prefacturas vamos a tener en el nuevo contrato
                let mesesDiferencia = moment(nuevaFechaFinal).diff(moment(nuevaFechaInicio), 'months', true);
                mesesDiferencia = Math.round(mesesDiferencia);  // Redondea al entero mas cercano

                if (mesesDiferencia == 0) numMeses = 1; // por lo menos un pago
                //COMPROBAMOS SI LA FECHA INICIO Y LA FINAL ESTÁN EN EL MISMO AÑO

                // Definir las dos fechas
                const fecha1 = moment(contrato.fechaInicio);
                const fecha2 = moment(contrato.fechaFinal);

                // Comprobar si los años son diferentes
                if (fecha1.year() !== fecha2.year()) {
                    console.log('Las fechas son de años diferentes');
                    //establecemos el nuevo precio para la renovacion
                    let p = await buscaPrefacturasRenovadas(con, contrato.contratoId, contrato.fechaRenovacionIpc);
                    if (!p) throw new Error("Fallo al recuperar las prefacturas del contrato " + contrato.referencia + ", el proceso se ha detenido");
                    nuevoPrecio = parseFloat(p.total) * mesesDiferencia;
                } else {
                    console.log('Las fechas son del mismo año');
                }



                //Actualiza la referencia del nuevo contrato a partir de la anterior
                contrato.referencia = fnCrearNuevaReferencia(contrato.referencia);
                // Dar de alta el nuevo contrato con los valores pasados.
                let result2 = await fnCrearContratoDesdeOtro2(con, contrato, antContratoId, nuevaFechaInicio, nuevaFechaFinal, nuevaFechaContrato, nuevaFechaPrimeraFactuna, nuevoPrecio);
                if (!result2) throw new Error("Fallo al crear el contrato " + contrato.referencia + ", el proceso se ha detenido");
                nuevoContratoId = result2.contratoId;
                nuevoContrato = result2
                // Dar de alta las luineas del nuevo contrato
                let result3 = await fnCrearLineasNuevoContrato2(con, antContratoId, nuevoContratoId, nuevoPrecio);
                if (!result3) throw new Error("Fallo al crear las lineas  del contrato " + contrato.referencia + ", el proceso se ha detenido");
                // Dar de alta las bases del nuevo contrato
                let result4 = await fnCrearBasesNuevoContrato2(con, antContratoId, nuevoContratoId);
                if (!result4) throw new Error("Fallo al crear las bases del contrato " + contrato.referencia + ", el proceso se ha detenido");
                // Dar de alta comisionistas del nuevo contrato
                let result5 = await fnCrearComisionistasNuevoContrato2(con, antContratoId, nuevoContratoId);
                if (!result5) throw new Error("Fallo al crear los comisionistas del contrato " + contrato.referencia + ", el proceso se ha detenido");
                // Actualizar los valores para en el antiguo contrato de su relación con el nuevo
                /* let result6 = await fnActualizarContratoAnterior2(con, nuevoContratoId, antContratoId);
                if(!result6) throw new Error("Fallo al asociar el contrato " + contrato.referencia + ", el proceso se ha detenido"); */
                // Miramos si hay registros en la tabla contratorenovados
                let result7 = await fnGetContratorenovados2(con, antContratoId)
                datos = result7;
                // Creamos un nuevo registro en la tabla contratos renovados
                let result8 = await fnCreaContratorenovados2(con, nuevoContratoId, antContratoId, datos);
                if (!result8) throw new Error("Fallo al crear el registro en la tabla contratosrenovados del contrato " + contrato.referencia + ", el proceso se ha detenido");
                //finalmente actualizamos los totales de la cabecera
                let result9 = await fnActualizarTotales2(con, nuevoContratoId);
                if (!result9) throw new Error("Fallo al actualizar los importes de la cabecera del contrato " + contrato.referencia + ", el proceso se ha detenido");

                //CREACIÓN DE PREFACTURAS
                prefacturas = [] //vaciamos el array de prefacturas eliminando las del contrato enterior

                prefacturas = creaPrefacturasDb(nuevaFechaInicio, nuevaFechaFinal, mesesDiferencia, nuevoPrecio, nuevoContrato);



                //obtenenmos el cliente y la empresa del contrato
                let cliente = await obtenClienteContrato(con, nuevoContrato.clienteId);
                if (!cliente) throw new Error("Fallo al obtener el cliente del contrato " + contrato.referencia + ", el proceso se ha detenido");

                let empresa = await obtenEmpresaContrato(con, nuevoContrato.empresaId);
                if (!empresa) throw new Error("Fallo al obtener la empresa del contrato " + contrato.referencia + ", el proceso se ha detenido");

                for (let p of prefacturas) {
                    prefacturaDb = obtenerObjetoDbCabeceraPrefactura2(empresa, cliente, nuevoContrato, p);
                    prefacturaDb = await fnGetNumeroPrefactura2(prefacturaDb, con);
                    if (!prefacturaDb) throw new Error("Fallo al crear la cabecera de la prefactura del contrato " + contrato.referencia + ", el proceso se ha detenido");

                    prefacturaDb = await generarUnaCabeceraPrefactura2(prefacturaDb, con);

                    //obtenemos las lineas del contrato para generar las lineas de prefactura

                    lineasContrato = await obtenerLineasContrato(nuevoContratoId, con);
                    // Hay que obtener los divisores de proporcionalidad

                    var divisor = prefacturaDb.total / nuevoPrecio;

                    var r = await crearLineasPrefactura(prefacturaDb.prefacturaId, lineasContrato, contrato, divisor, con);
                }


                nuevasReferencias.push(contrato.referencia);

            }
            await con.commit();
            await con.end();
            resolve(nuevasReferencias);
        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.rollback();
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

let buscaPrefacturasRenovadas = async (con, contratoId, fechaRenovacionIpc) => {
    return new Promise(async (resolve, reject) => {
        try {
            sql = "SELECT * FROM prefacturas AS pr";
            sql += " WHERE pr.contratoId = ? AND pr.fecha >= ? ORDER BY pr.fecha ASC";
            sql = mysql2.format(sql, [contratoId, fechaRenovacionIpc]);
            let [result] = await con.query(sql);
            if (result.length == 0) result = null;
            resolve(result[0]);
        } catch (e) {
            resolve(null);
        }

    });
}





/////


let getContrato2 = async (dFecha, hFecha, departamentoId, preaviso, con) => {
    return new Promise(async (resolve, reject) => {
        try {
            var sql = "SELECT DISTINCT cnt.*,";
            sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
            sql += " FROM contratos AS cnt";
            sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
            sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
            sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
            sql += " LEFT JOIN";
            sql += "(";
            sql += "   SELECT antContratoId FROM contratos WHERE antContratoId IS NOT NULL";
            sql += " ) AS tmp ON tmp.antContratoId = cnt.contratoId"
            sql += " WHERE cnt.sel = 1 AND cnt.contratoCerrado = 0 AND cnt.fechaInicio >= ? AND cnt.fechaInicio <= ?";
            sql += " AND tmp.antContratoId IS NULL AND cnt.renovar = 1";
            sql = mysql2.format(sql, [dFecha, hFecha]);
            if (departamentoId > 0) {
                sql += " AND cnt.tipoContratoId = ?";
                sql = mysql2.format(sql, departamentoId);
            }
            if (preaviso == 'true') {
                sql += " AND NOW() >= DATE_SUB(fechaFinal, INTERVAL COALESCE(preaviso, 0) DAY)";
            }
            let [result] = await con.query(sql);
            if (result.length == 0) result = null;
            resolve(result);
        } catch (e) {
            resolve(null);
        }

    });
}

let fnCrearContratoDesdeOtro2 = async (con, contrato, antContratoId, nuevaFechaInicio, nuevaFechaFinal, nuevaFechaContrato, nuevaFechaPrimeraFactuna, nuevoPrecio) => {
    return new Promise(async (resolve, reject) => {
        try {
            //let importeAnualRenovacion = contrato.importeAnualRenovacion;
            let nFechaActulizacionIpc = moment(contrato.fechaRenovacionIpc).add(1, 'years').format('YYYY-MM-DD');
            contrato.contratoId = 0;
            contrato.antContratoId = antContratoId;
            contrato.fechaInicio = nuevaFechaInicio;
            contrato.fechaFinal = nuevaFechaFinal;
            contrato.fechaContrato = nuevaFechaContrato;
            contrato.fechaPrimeraFactura = nuevaFechaPrimeraFactuna;
            contrato.ipc = 0;
            contrato.fechaRenovacionIpc = nFechaActulizacionIpc;
            contrato.precioActualizado = 0;
            //contrato.renovar = 0
            contrato.importeCliente = nuevoPrecio;
            contrato.importeAnualRenovacion = nuevoPrecio;
            delete contrato.empresa;
            delete contrato.cliente;
            delete contrato.agente;
            delete contrato.mantenedor;
            delete contrato.tipo;
            delete contrato.formaPago;
            var sql = "INSERT INTO contratos SET ?";
            sql = mysql2.format(sql, contrato);
            let [result] = await con.query(sql);
            contrato.contratoId = result.insertId;
            resolve(contrato);

        } catch (e) {
            resolve(null);
        }

    });
}

let fnCrearLineasNuevoContrato2 = async (con, antContratoId, nuevoContratoId, nuevoPrecio) => {
    return new Promise(async (resolve, reject) => {
        try {
            let nuevoCoste = parseFloat(nuevoPrecio);
            let nPrecio = parseFloat(nuevoPrecio);
            var sql = "insert into contratos_lineas (linea, contratoId, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad,";
            sql += " importe,";
            sql += " totalLinea,";
            sql += " costeUnidad,";
            sql += " coste,";
            sql += " porcentajeBeneficio, importeBeneficioLinea, porcentajeAgente, importeAgenteLinea,";
            sql += " ventaNetaLinea, capituloLinea)";

            sql += " select linea, ?, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad,";
            sql += " ROUND((" + nuevoCoste + " / cantidad), 2) AS importe,";
            sql += nPrecio + " AS totalLinea,";
            sql += " costeUnidad,";
            sql += nuevoCoste + " AS coste,";
            sql += " porcentajeBeneficio, importeBeneficioLinea, porcentajeAgente, importeAgenteLinea, ventaNetaLinea, capituloLinea";
            sql += " from contratos_lineas where contratoId = ?";
            sql = mysql2.format(sql, [nuevoContratoId, antContratoId]);
            let result = await con.query(sql);
            resolve(result);
        } catch (e) {
            resolve(null);
        }
    });
}


let fnCrearBasesNuevoContrato2 = async (con, antContratoId, nuevoContratoId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "INSERT INTO contratos_bases (contratoId, tipoIvaId, porcentaje, base, cuota)";
            sql += " SELECT pl.contratoId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
            sql += " FROM";
            sql += " (SELECT contratoId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
            sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
            sql += " FROM contratos_lineas";
            sql += " WHERE contratoId = ?";
            sql += " GROUP BY tipoIvaId) AS pl";
            sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
            sql = mysql2.format(sql, [nuevoContratoId]);
            sql = mysql2.format(sql, [nuevoContratoId, antContratoId]);
            let result = await con.query(sql);
            resolve(result);

        } catch (e) {
            resolve(null);
        }
    });
}

let fnCrearComisionistasNuevoContrato2 = async (con, antContratoId, nuevoContratoId) => {
    return new Promise(async (resolve, reject) => {
        try {
            var sql = "insert into contratos_comisionistas (contratoId, comercialId, porcentajeComision)";
            sql += " select ?, comercialId, porcentajeComision";
            sql += " from contratos_comisionistas where contratoId = ?";
            sql = mysql2.format(sql, [nuevoContratoId, antContratoId]);
            let result = await con.query(sql);
            resolve(result);
        } catch (e) {
            resolve(null);
        }
    });
}

let fnActualizarContratoAnterior2 = async (con, antContratoId, nuevoContratoId) => {
    return new Promise(async (resolve, reject) => {
        try {
            var sql = "UPDATE contratos SET antContratoId = ? WHERE contratoId = ?";
            sql = mysql.format(sql, [antContratoId, nuevoContratoId]);
            let result = await con.query(sql);
            resolve(result);
        } catch (e) {
            resolve(null);
        }
    });
}

let fnGetContratorenovados2 = async (con, antContratoId) => {
    return new Promise(async (resolve, reject) => {
        try {
            var sql = "SELECT * FROM contratorenovados WHERE renovadoId = ? OR contratoOriginalId = ?";
            sql = mysql.format(sql, [antContratoId, antContratoId]);
            let [result] = await con.query(sql);
            resolve(result);
        } catch (e) {
            resolve(null);
        }
    });
}

let fnCreaContratorenovados2 = async (con, nuevoContratoId, antContratoId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            var obj = {
                contratoRenovadoId: 0,
                contratoOriginalId: antContratoId,
                renovadoId: nuevoContratoId,
                fechaRenovacion: new Date()
            }

            if (data.length > 0) {
                obj = {
                    contratoRenovadoId: 0,
                    contratoOriginalId: data[0].contratoOriginalId,
                    renovadoId: nuevoContratoId,
                    fechaRenovacion: new Date()
                }
            }
            var sql = "INSERT INTO contratorenovados SET ?";
            sql = mysql2.format(sql, obj);
            let result = await con.query(sql);
            resolve(result);
        } catch (e) {
            resolve(null);
        }
    });
}

// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de contrato
// basándose en los tipos y porcentajes de las líneas
let fnActualizarTotales2 = async (con, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "UPDATE contratos AS cnt,";
            sql += " (SELECT contratoId, SUM(base) AS b, SUM(cuota) AS c";
            sql += " FROM contratos_bases GROUP BY 1) AS cnt2,";
            sql += " (SELECT contratoId, SUM(coste) AS sc";
            sql += " FROM contratos_lineas GROUP BY 1) AS cnt3";
            sql += " SET cnt.importeCliente = cnt2.b, cnt.total = cnt2.b, cnt.totalConIva = cnt2.b + cnt2.c,";
            sql += " cnt.coste = cnt3.sc";
            sql += " WHERE cnt.contratoId = ?";
            sql += " AND cnt2.contratoId = cnt.contratoId";
            sql += " AND cnt3.contratoId = cnt.contratoId";
            sql = mysql2.format(sql, id);
            let result = await con.query(sql);
            resolve(result);

        } catch (e) {
            resolve(null);
        }
    });
}


//actualización del IPC

module.exports.getContratosActualizar = async (dFecha, hFecha, departamentoId, preaviso) => {
    let con = null;
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            //primero actulizamos los contratos que se van a recuperar como no seleccionables.
            sql = "UPDATE contratos AS c";
            sql += " SET c.sel = 0"
            sql += " WHERE c.contratoCerrado = 0 AND c.fechaRenovacionIpc >= ?";
            sql = mysql2.format(sql, dFecha);
            if (hFecha) {
                sql += " AND c.fechaRenovacionIpc <= ?";
                sql = mysql2.format(sql, hFecha);
            }
            sql += " AND c.precioActualizado = 0"
            if (departamentoId > 0) {
                sql += " AND c.tipoContratoId = ?";
                sql = mysql2.format(sql, departamentoId);
            }
            if (preaviso == 'true') {
                sql += " AND NOW() >= DATE_SUB(c.fechaFinal, INTERVAL COALESCE(preaviso, 0) DAY)";
            }
            const [result] = await con.query(sql);
            sql = "SELECT DISTINCT cnt.*,";
            sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
            sql += " FROM contratos AS cnt";
            sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
            sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
            sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
            sql += " WHERE cnt.sel = 0 AND cnt.contratoCerrado = 0 AND cnt.fechaRenovacionIpc >= ?";
            sql = mysql2.format(sql, dFecha);
            if (hFecha) {
                sql += " AND cnt.fechaRenovacionIpc <= ?";
                sql = mysql2.format(sql, hFecha);
            }
            sql += " AND cnt.precioActualizado = 0"
            if (departamentoId > 0) {
                sql += " AND cnt.tipoContratoId = ?";
                sql = mysql2.format(sql, departamentoId);
            }
            if (preaviso == 'true') {
                sql += " AND NOW() >= DATE_SUB(fechaFinal, INTERVAL COALESCE(preaviso, 0) DAY)";
            }
            const [contratos] = await con.query(sql);
            await con.end();
            resolve(contratos);
        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

module.exports.putActualizarContratos = async (dFecha, hFecha, ipc, departamentoId, preaviso) => {
    let con = null;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            let contratoId = 0;
            let referencias = [];
            let antTotalCliente = 0;
            let fechaRenovacionIpc = null;

            // Todo el proceso debe estar protegido por transacciones
            con = await mysql2.createConnection(obtenerConfiguracion());
            await con.beginTransaction();
            // Obtener la información del contrato
            let result = await getContratosIpc(dFecha, hFecha, departamentoId, preaviso, con);
            if (!result) throw new Error("No se encuentran los contratos");
            let contratos = result;
            for (let c of contratos) {
                contratoId = c.contratoId;
                antTotalCliente = c.importeCliente;
                fechaRenovacionIpc = moment(c.fechaRenovacionIpc).format('YYYY-MM-DD');
                //ACTULIZACIÓN DE PREFACTURAS DEL CONTRATO

                // Actualizar las lineas de las prefacturas
                let result2 = await fnActualizarLineasPrefacturas(con, contratoId, ipc, fechaRenovacionIpc);
                if (!result2) throw new Error("Fallo al actualizar las lineas de las prefacturas del contrato " + c.referencia + ", el proceso se ha detenido");
                if (result2.length > 0) {
                    //si hay lineas actualizadas continuamos con el proceso
                    //
                    //Actulizar las bases de las prefacturas afectadas
                    let result3 = await fnActualizarBasesPrefacturas2(con, result2);
                    if (!result3) throw new Error("Fallo al actualizar las bases del contrato " + c.referencia + ", el proceso se ha detenido");

                    //ACTUALIZACIÓN DEL CONTRATO

                    //buscamos las lineas del contrato
                    let result4 = await getContratoLineas2(con, contratoId);
                    if (!result4) throw new Error("Fallo al recuperar las lineas del contrato " + c.referencia + ", el proceso se ha detenido");
                    //calculamos la proporcionalidad de cada linea
                    let result5 = calculaProporcion(result4, c.importeCliente);
                    //recuperamos la suma de todas las prefacturas
                    let result6 = await getTotalesLineasPrefacturas(con, contratoId);
                    if (!result6) throw new Error("Fallo  al recuperar los totales del contrato " + c.referencia + ", el proceso se ha detenido");
                    //actualizamos las lineas del contrato
                    let result7 = await fnActualizarLineasContrato(con, contratoId, result6, result5);
                    if (!result7) throw new Error("Fallo al actualizar las lineas del contrato " + c.referencia + ", el proceso se ha detenido");
                    //actualizamos las bases y los totales
                    let result9 = await fnActualizarBasesContrato(con, contratoId, antTotalCliente, ipc);
                    if (!result9) throw new Error("Fallo al actualizar los importes de la cabecera del contrato " + c.referencia + ", el proceso se ha detenido");
                    referencias.push(c.referencia);
                } else {
                    let result10 = await fnActualizarBasesContrato(con, contratoId, antTotalCliente, ipc);
                    if (!result10) throw new Error("Fallo al actualizar los importes de la cabecera del contrato " + c.referencia + ", el proceso se ha detenido");
                    referencias.push(c.referencia);
                }
            }
            await con.commit();
            await con.end();
            resolve(referencias);
        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.rollback();
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

let getContratosIpc = async (dFecha, hFecha, departamentoId, preaviso, con) => {
    return new Promise(async (resolve, reject) => {
        try {
            var sql = "SELECT DISTINCT cnt.*,";
            sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
            sql += " FROM contratos AS cnt";
            sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
            sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
            sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
            sql += " WHERE cnt.sel = 1 AND cnt.contratoCerrado = 0 AND cnt.fechaRenovacionIpc >= ?";
            sql = mysql2.format(sql, dFecha);
            if (hFecha) {
                sql += " AND cnt.fechaRenovacionIpc <= ?";
                sql = mysql2.format(sql, hFecha);
            }
            sql += " AND cnt.precioActualizado = 0"
            if (departamentoId > 0) {
                sql += " AND cnt.tipoContratoId = ?";
                sql = mysql2.format(sql, departamentoId);
            }
            if (preaviso == 'true') {
                sql += " AND NOW() >= DATE_SUB(fechaFinal, INTERVAL COALESCE(preaviso, 0) DAY)";
            }
            let [result] = await con.query(sql);
            if (result.length == 0) result = null;
            resolve(result);
        } catch (e) {
            resolve(null);
        }

    });
}


let getContratosRevertir = async (ids, con) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (ids.length == 0) resolve(null);
            var sql = "SELECT DISTINCT cnt.*,";
            sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
            sql += " FROM contratos AS cnt";
            sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
            sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
            sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
            sql += " WHERE cnt.contratoId IN (?)";
            sql = mysql2.format(sql, [ids])
            let [result] = await con.query(sql);
            if (result.length == 0) result = null;
            resolve(result);
        } catch (e) {
            resolve(null);
        }

    });
}

let fnActualizarLineasPrefacturas = async (con, contratoId, ipc, fechaRenovacionIpc) => {
    return new Promise(async (resolve, reject) => {
        try {
            var antPrefacturaId = null;
            ipc = parseFloat(ipc);
            let obj = {};
            let obj2 = [];
            //primero recuperamos la Id de las prefacturas que van a resultar afectadas
            let sql = "SELECT ";
            sql += " pl.*, p.porcentajeRetencion";
            sql += " FROM prefacturas_lineas AS pl";
            sql += " LEFT JOIN prefacturas AS p ON p.prefacturaId = pl.prefacturaId";
            sql += " LEFT JOIN contratos AS c ON c.contratoId = p.contratoId";
            sql += " WHERE c.contratoId = ? AND p.fecha >= ?";
            sql = mysql2.format(sql, [contratoId, fechaRenovacionIpc]);
            let [result] = await con.query(sql);
            if (result.length > 0) {
                for (i = 0; i < result.length; i++) {
                    if (!antPrefacturaId) {
                        obj2.push({ prefacturaId: result[i].prefacturaId, porcentajeRetencion: result[i].porcentajeRetencion });
                    } else if (antPrefacturaId && antPrefacturaId != result[i].prefacturaId) {
                        obj2.push({ prefacturaId: result[i].prefacturaId, porcentajeRetencion: result[i].porcentajeRetencion });
                    }
                    obj = {
                        prefacturaPrecioId: 0,
                        contratoId: contratoId,
                        prefacturaId: result[i].prefacturaId,
                        prefacturaLineaId: result[i].prefacturaLineaId,
                        importe: result[i].importe,
                        totalLinea: result[i].totalLinea,
                        coste: result[i].coste

                    }
                    //guardamos los importes originales de cada prefactura entes de actualizar
                    sql = " INSERT INTO prefacturas_lineas_actualizadas SET ? ";
                    sql = mysql2.format(sql, obj);
                    let r = await con.query(sql);

                    antPrefacturaId = result[i].prefacturaId;
                }
            }

            sql = " UPDATE prefacturas_lineas AS pl";
            sql += " LEFT JOIN prefacturas AS p ON p.prefacturaId = pl.prefacturaId";
            sql += " LEFT JOIN contratos AS c ON c.contratoId = p.contratoId";
            sql += " SET";
            sql += "     pl.importe =   ROUND(ROUND(pl.importe, 2) + ( ROUND(pl.importe, 2) * ( " + ipc + "  / 100) * IF(DATEDIFF(c.fechaRenovacionIPC, c.fechaOriginal) < 365, DATEDIFF(c.fechaRenovacionIPC, c.fechaOriginal) , 365) / 365), 2),";
            sql += "     pl.totalLinea = pl.totalLinea + (pl.totalLinea * ( " + ipc + "  / 100) * IF(DATEDIFF(c.fechaRenovacionIPC, c.fechaOriginal) < 365, DATEDIFF(c.fechaRenovacionIPC, c.fechaOriginal) , 365) / 365),";
            sql += "     pl.coste =   ROUND(ROUND(pl.coste, 2) + ( ROUND(pl.coste, 2) * ( " + ipc + "  / 100) * IF(DATEDIFF(c.fechaRenovacionIPC, c.fechaOriginal) < 365, DATEDIFF(c.fechaRenovacionIPC, c.fechaOriginal) , 365) / 365), 2)";
            sql += " WHERE p.contratoId = ? AND p.fecha >= ?";
            sql = mysql2.format(sql, [contratoId, fechaRenovacionIpc]);
            let result2 = await con.query(sql);
            resolve(obj2);
        } catch (e) {
            resolve(null);
        }
    });
}

// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la prefactura pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBasesPrefacturas2 = async (con, datos) => {
    return new Promise(async (resolve, reject) => {
        try {
            let porReten = 0;
            for (let p of datos) {
                if (p && p.porcentajeRetencion) {
                    porReten = parseFloat(p.porcentajeRetencion) / 100;
                }
                //BORRAMOS LAS BASES
                let sql = "DELETE FROM prefacturas_bases";
                sql += " WHERE prefacturaId = ?";
                sql = mysql2.format(sql, p.prefacturaId);
                let result = await con.query(sql);

                //CREAMOS LAS NUEVAS BASES
                sql = "INSERT INTO prefacturas_bases (prefacturaId, tipoIvaId, porcentaje, base, cuota)";
                sql += " SELECT pl.prefacturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
                sql += " FROM";
                sql += " (SELECT prefacturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
                sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
                sql += " FROM prefacturas_lineas";
                sql += " WHERE prefacturaId = ?";
                sql += " GROUP BY tipoIvaId) AS pl";
                sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
                sql = mysql2.format(sql, p.prefacturaId);
                let result2 = await con.query(sql);

                //ACTULIZAMOS LOS TOTALES EN LA CABECERA
                sql = "UPDATE prefacturas AS pf,";
                sql += " (SELECT prefacturaId, SUM(base) AS b, SUM(cuota) AS c";
                sql += " FROM prefacturas_bases GROUP BY 1) AS pf2,";
                sql += " (SELECT prefacturaId, SUM(coste) AS sc";
                sql += " FROM prefacturas_lineas GROUP BY 1) AS pf3";
                sql += " SET pf.total = pf2.b, pf.totalAlCliente = pf2.b,";
                sql += " pf.restoCobrar = pf2.b - ( pf2.b  * " + porReten + ") + pf2.c,"
                sql += " pf.totalConIva = pf2.b - ( pf2.b  * " + porReten + ") + pf2.c,";
                sql += " pf.coste = pf3.sc, pf.importeretencion = ( pf2.b  * " + porReten + ")";
                sql += " WHERE pf.prefacturaId = ?";
                sql += " AND pf2.prefacturaId = pf.prefacturaId";
                sql += " AND pf3.prefacturaId = pf.prefacturaId";
                sql = mysql2.format(sql, p.prefacturaId);
                let result3 = await con.query(sql);
                //resolve(result3)
            }
            resolve('OK');
        } catch (e) {
            resolve(null);
        }

    });
}

// getContratoLineas
// Devuelve todas las líneas de una prefacttura
var getContratoLineas2 = async (con, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "SELECT cntl.*, a.grupoArticuloId, u.abrev as unidades FROM contratos_lineas as cntl";
            sql += " LEFT JOIN articulos AS a ON a.articuloId = cntl.articuloId";
            sql += " LEFT JOIN unidades AS u ON u.unidadId = cntl.unidadId"
            sql += " WHERE cntl.contratoId = ?";
            sql += " ORDER by linea";
            sql = mysql2.format(sql, id);
            let [result] = await con.query(sql);
            resolve(result)

        } catch (e) {
            resolve(null);
        }
    });
}

var calculaProporcion = function (lineas, importeContrato) {
    for (let l of lineas) {
        let proporcion = (l.totalLinea * 100) / importeContrato
        l.proporcion = proporcion;
    }
    return lineas;
}

var getTotalesLineasPrefacturas = async (con, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "SELECT SUM(pl.importe) AS nuevoImporte, SUM(pl.totalLinea) AS nuevoTotal, SUM(pl.coste) AS nuevoCoste";
            sql += " FROM prefacturas_lineas as pl";
            sql += " LEFT JOIN prefacturas as p ON p.prefacturaId = pl.prefacturaId";
            sql += " LEFT JOIN contratos as c ON c.contratoId = p.contratoId";
            sql += " WHERE c.contratoId = ?";
            sql += " GROUP BY c.contratoId";
            sql = mysql2.format(sql, id);
            let [result] = await con.query(sql);
            resolve(result[0])

        } catch (e) {
            resolve(null);
        }
    });
}

let fnActualizarLineasContrato = async (con, contratoId, totales, antlineas) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "";
            let nuevoImporte = parseFloat(totales.nuevoImporte);
            let nuevoTotal = parseFloat(totales.nuevoTotal);
            let nuevoCoste = parseFloat(totales.nuevoCoste);
            if (antlineas.length > 0) {
                for (let l of antlineas) {
                    let nImporte = nuevoImporte * (parseFloat(l.proporcion) / 100);
                    let nTotal = nuevoTotal * (parseFloat(l.proporcion) / 100);
                    let nCoste = nuevoCoste * (parseFloat(l.proporcion) / 100);
                    sql = " UPDATE contratos_lineas AS pl";
                    sql += " SET";
                    sql += "     pl.importe = " + nImporte;
                    sql += "     , pl.totalLinea = " + nTotal;
                    sql += "     , pl.coste = " + nCoste;
                    sql += " WHERE pl.contratoId = ? AND pl.contratoLineaId = ?;";
                    sql = mysql2.format(sql, [contratoId, l.contratoLineaId]);
                    let result2 = await con.query(sql);
                }
                resolve('OK');
            } else { resolve(null); }
        } catch (e) {
            resolve(null);
        }
    });
}

var fnActualizarBasesContrato = async (con, id, antTotalCliente, ipc) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fActualizacion = moment(new Date).format('YYYY-MM-DD');
            //let importeAnualRenovacion = (parseFloat(antTotalCliente) + (parseFloat(antTotalCliente) * ( parseFloat(ipc) / 100 )))
            //BORRAMOS LAS BASES
            let sql = "DELETE FROM contratos_bases";
            sql += " WHERE contratoId = ?";
            sql = mysql2.format(sql, id);
            let result = await con.query(sql);

            //CREAMOS LAS NUEVAS BASES
            sql = "INSERT INTO contratos_bases (contratoId, tipoIvaId, porcentaje, base, cuota)";
            sql += " SELECT pl.contratoId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
            sql += " FROM";
            sql += " (SELECT contratoId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
            sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
            sql += " FROM contratos_lineas";
            sql += " WHERE contratoId = ?";
            sql += " GROUP BY tipoIvaId) AS pl";
            sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
            sql = mysql2.format(sql, id);
            let result2 = await con.query(sql);

            //ACTULIZAMOS LOS TOTALES EN LA CABECERA
            sql = "UPDATE contratos AS cnt,";
            sql += " (SELECT contratoId, SUM(base) AS b, SUM(cuota) AS c";
            sql += " FROM contratos_bases GROUP BY 1) AS cnt2,";
            sql += " (SELECT contratoId, SUM(coste) AS sc";
            sql += " FROM contratos_lineas GROUP BY 1) AS cnt3";
            sql += " SET cnt.importeCliente = cnt2.b,  cnt.total = cnt2.b, cnt.totalConIva = cnt2.b + cnt2.c,";
            sql += " cnt.coste = cnt3.sc,";
            sql += " cnt.ventaNeta =  cnt3.sc,";

            sql += " importeAnualRenovacion =   ROUND(ROUND(" + antTotalCliente + ", 2) + ( ROUND(" + antTotalCliente + ", 2) *"
                + " ( " + ipc + "  / 100) * IF(DATEDIFF(cnt.fechaRenovacionIPC, cnt.fechaOriginal) <"
                + " 365, DATEDIFF(cnt.fechaRenovacionIPC, cnt.fechaOriginal) , 365) / 365), 2),";

            sql += " ipc = " + ipc + ",";
            sql += " fechaActulizacionContrato = '" + fActualizacion + "',";
            sql += " antTotalCliente = " + antTotalCliente + ",";
            sql += " precioActualizado = 1"
            sql += " WHERE cnt.contratoId = ?";
            sql += " AND cnt2.contratoId = cnt.contratoId";
            sql += " AND cnt3.contratoId = cnt.contratoId";
            sql = mysql2.format(sql, id);
            let result3 = await con.query(sql);
            resolve(result3);
        } catch (e) {
            resolve(null);
        }

    });
}

//GENERACION DE PREFACTURAS DE ALQUILERES

//GENERACION DE PREFACTURAS



let creaPrefacturasDb = function (fechaInicio, fechaFinal, numPagos, nuevoPrecio, nuevoContrato) {
    /*  var inicioContrato = new Date(fechaInicio));
     var finContrato = new Date(spanishDbDate(fechaFinal)); */
    //
    let facturacionParcial = nuevoContrato.facturaParcial;
    let iniContrato = moment(fechaInicio).format('YYYY-MM-DD');
    let fContrato = moment(fechaFinal).format('YYYY-MM-DD');
    //
    let finMesInicioContrato = moment(fechaInicio).endOf('month');
    let aux = iniContrato.split('-');
    let inicioMesInicioContrato = aux[0] + "-" + aux[1] + "-01";
    let diffDias = finMesInicioContrato.diff(fechaInicio, 'days');
    let fnIni = moment(finMesInicioContrato).format('YYYY-MM-DD');

    //numero de dias del més de inicio
    //var daysInMonth = moment(aux[0] + "-" + aux[1], "YYYY-MM").daysInMonth(); 
    //if(daysInMonth != (diffDias + 1)) facturacionParcial = true;

    let importePago = roundToTwo(nuevoPrecio / numPagos);
    let importePagoCliente = roundToTwo(nuevoPrecio / numPagos);
    let importeCoste = roundToTwo(nuevoPrecio / numPagos);

    // como la división puede no dar las cifras hay que calcular los restos.
    let restoImportePago = nuevoPrecio - (importePago * numPagos);
    let restoImportePagoCliente = nuevoPrecio - (importePagoCliente * numPagos);
    let restoImporteCoste = nuevoPrecio - (importeCoste * numPagos);

    let import1 = (importePago / 30) * (diffDias);
    let import11 = (importePagoCliente / 30) * (diffDias);
    let import12 = (importeCoste / 30) * (diffDias);
    let import2 = importePago - import1;
    let import21 = importePagoCliente - import11;
    let import22 = importeCoste - import12;

    let pagos = [];
    let nPagos = numPagos;
    if (facturacionParcial) {
        nPagos++
    }

    let numLetra = '';
    let divisor = 1

    for (var i = 0; i < nPagos; i++) {
        let n = i + 1
        numLetra = n + "/" + nPagos
        // sucesivas fechas de factura

        let f = moment(fechaInicio).add(i * divisor, 'month').format('DD/MM/YYYY');
        // inicio de periodo
        let f0 = moment(fechaInicio).add(i * divisor, 'month').format('DD/MM/YYYY');
        // fin de periodo
        let f2 = moment(fechaInicio).add((i + 1) * divisor, 'month').add(-1, 'days').format('DD/MM/YYYY');
        if (facturacionParcial) {
            if (i > 0) {
                f0 = moment(inicioMesInicioContrato).add(i * divisor, 'month').format('DD/MM/YYYY');
            }
            f2 = moment(inicioMesInicioContrato).add((i + 1) * divisor, 'month').add(-1, 'days').format('DD/MM/YYYY');
        }
        if (i == (nPagos - 1)) {
            f2 = moment(fContrato).format('DD/MM/YYYY');
        }
        /* if (vm.facturaParcial()) {
            if (i > 0) {
                f0 = moment(inicioMesInicioContrato).add(i * divisor, 'month').format('DD/MM/YYYY');
            }
            f2 = moment(inicioMesInicioContrato).add((i + 1) * divisor, 'month').add(-1, 'days').format('DD/MM/YYYY');
        }
        if (i == (nPagos - 1)) {
            f2 = moment(fContrato).format('DD/MM/YYYY');
        } */
        /* let p = {
            fecha: f,
            importe: importePago,
            importeCliente: importePagoCliente,
            importeCoste: importeCoste,
            empresaId: empresaId,
            retenGarantias: 0,
            clienteId: clienteId,
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            empresa: empresa,
            cliente: cliente,
            periodo: f0 + "-" + f2,
            numLetra: numLetra
        }; */
        let p = {
            fecha: f,
            importe: importePago,
            importeCliente: importePagoCliente,
            importeCoste: importeCoste,
            empresaId: nuevoContrato.empresaId,
            retenGarantias: 0,
            clienteId: nuevoContrato.clienteId,
            porcentajeBeneficio: nuevoContrato.porcentajeBeneficio,
            porcentajeAgente: nuevoContrato.porcentajeAgente,
            numLetra: numLetra,
            periodo: f0 + "-" + f2,
            //empresa: nuevoContrato.emisorNombre,
            //cliente: nuevoContrato.receptorNombre
        };

        if (facturacionParcial && i == 0) {
            p.importe = import1;
            p.importeCliente = import11;
            p.importeCoste = import12;
        }
        if (facturacionParcial && i == (nPagos - 1)) {
            p.importe = import2;
            p.importeCliente = import21;
            p.importeCoste = import22;
        }
        pagos.push(p);
    }
    if (pagos.length > 1) {
        // en la última factura ponemos los restos
        pagos[pagos.length - 1].importe = pagos[pagos.length - 1].importe + restoImportePago;
        pagos[pagos.length - 1].importeCliente = pagos[pagos.length - 1].importeCliente + restoImportePagoCliente;
        pagos[pagos.length - 1].importeCoste = pagos[pagos.length - 1].importeCoste + restoImporteCoste;
    }
    return pagos;

}

let obtenClienteContrato = async (con, clienteId) => {
    return new Promise(async (resolve, reject) => {
        try {
            sql = "SELECT c.*,";
            sql += " tc.nombre as tipo,";
            sql += " cc.proId as codigoComercial,";
            sql += " cc.nombre as nombreAgente,";
            sql += " fp.nombre AS nomForpa,";
            sql += " cc2.nombre AS colaboradorNombre,";
            sql += " c.nombreComercial as nomcom,";
            sql += " tf.nombre AS tarifaNombre,";
            sql += " COALESCE(tv1.nombre, '') AS tipoViaFiscal,";
            sql += " COALESCE(tv2.nombre, '')  AS tipoViaTrabajo,";
            sql += " COALESCE(tv3.nombre, '') AS tipoViaPostal,";
            sql += " mb.nombre AS motivoBaja";
            sql += " FROM clientes as c ";
            sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
            sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
            sql += " LEFT JOIN comerciales as cc2 ON cc2.comercialId = c.colaboradorId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = c.formaPagoId";
            sql += " LEFT JOIN tarifas_cliente AS tf ON tf.tarifaClienteId = c.tarifaId";
            sql += " LEFT JOIN tipos_via AS tv1 ON tv1.tipoViaId = c.tipoViaId";
            sql += " LEFT JOIN tipos_via AS tv2 ON tv2.tipoViaId = c.tipoViaId2";
            sql += " LEFT JOIN tipos_via AS tv3 ON tv3.tipoViaId = c.tipoViaId3";
            sql += " LEFT JOIN motivos_baja AS mb ON mb.motivoBajaId = c.motivoBajaId";
            sql += " WHERE c.clienteId = ?";
            sql = mysql2.format(sql, clienteId);
            let [result] = await con.query(sql);
            if (result.length == 0) result = null;
            resolve(result[0]);
        } catch (e) {
            resolve(null);
        }

    });
}


let obtenEmpresaContrato = async (con, empresaId) => {
    return new Promise(async (resolve, reject) => {
        try {
            sql = "SELECT * FROM empresas WHERE empresaId = ?";
            sql = mysql2.format(sql, empresaId);
            let [result] = await con.query(sql);
            if (result.length == 0) result = null;
            resolve(result[0]);
        } catch (e) {
            resolve(null);
        }

    });
}

var obtenerObjetoDbCabeceraPrefactura2 = function (empresa, cliente, contrato, prefactura) {
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
        receptorNombre: cliente.nombreComercial,
        receptorDireccion: cliente.direccion,
        receptorCodPostal: cliente.codPostal,
        receptorPoblacion: cliente.poblacion,
        receptorProvincia: cliente.provincia,
        total: prefactura.importe,
        formaPagoId: contrato.formaPagoId,
        totalAlCliente: prefactura.importeCliente,
        retenGarantias: prefactura.retenGarantias,
        coste: prefactura.importeCoste,
        generada: 1,
        porcentajeBeneficio: prefactura.porcentajeBeneficio,
        porcentajeAgente: prefactura.porcentajeAgente,
        contratoId: contrato.contratoId,
        observaciones: contrato.obsFactura,
        periodo: prefactura.periodo,
        porcentajeRetencion: contrato.porcentajeRetencion,
        observacionesPago: prefactura.observacionesPago,
        contratoPorcenId: prefactura.contratoPorcenId,
        contPlanificacionId: prefactura.contPlanificacionId,
        numLetra: prefactura.numLetra,
        beneficioLineal: contrato.beneficioLineal
    };

    return prefacturaDb;
}

var fnGetNumeroPrefactura2 = async (prefactura, con) => {
    return new Promise(async (resolve, reject) => {
        try {
            var sql = "SELECT * FROM empresas_series";
            sql += " WHERE empresaId = ?";
            sql = mysql2.format(sql, prefactura.empresaId);
            let [res] = await con.query(sql);
            if (res.length == 0) throw new Error();

            // con el año y la serie hay que obtener el número
            var ano = moment(prefactura.fecha).year();
            var serie;
            for (var i = 0; i < res.length; i++) {
                if (res[i].tipoProyectoId) {
                    if (prefactura.tipoProyectoId == res[i].tipoProyectoId) {
                        if (res[i].serie_prefactura && res[i].serie_prefactura != '') {
                            serie = res[i].serie_prefactura;
                            break;
                        }
                    }
                }
                if (res[i].departamentoId) {
                    if (prefactura.departamentoId == res[i].departamentoId) {
                        if (res[i].serie_prefactura && res[i].serie_prefactura != '') {
                            serie = res[i].serie_prefactura;
                            break;
                        }
                    }
                }
            }
            if (!serie) throw new Error();
            sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM prefacturas";
            sql += " WHERE empresaId = ?";
            sql += " AND ano = ?";
            sql += " AND serie = ?";
            sql = mysql2.format(sql, [prefactura.empresaId, ano, serie]);
            let [result2] = await con.query(sql);
            // actualizar los campos del objeto prefactura
            prefactura.numero = result2[0].n;
            prefactura.ano = ano;
            prefactura.serie = serie;
            resolve(prefactura);

        } catch (e) {
            resolve(null);
        }

    });
}

var generarUnaCabeceraPrefactura2 = async (prefacturaDb, con) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "INSERT INTO prefacturas SET ?";
            sql = mysql2.format(sql, prefacturaDb);
            let [result] = await con.query(sql);
            prefacturaDb.prefacturaId = result.insertId;
            resolve(prefacturaDb);
        } catch (e) {
            resolve(null);
        }
    });
}

var obtenerLineasContrato = async (contratoId, con) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "SELECT * FROM contratos_lineas WHERE contratoId = ?";
            sql = mysql2.format(sql, contratoId);
            let [lineasContrato] = await con.query(sql);
            resolve(lineasContrato);
        } catch (e) {
            resolve(null);
        }
    });
}

var crearLineasPrefactura = function (prefacturaId, lineasContrato, contrato, divisor, con) {
    var lineaPrefacturaDb = {};
    var data = [];
    return new Promise(async (resolve, reject) => {
        try {
            for (let lineaContrato of lineasContrato) {
                if (!contrato.beneficioLineal) {
                    lineaPrefacturaDb = {
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
                } else {
                    lineaPrefacturaDb = {
                        prefacturaLineaId: 0,
                        linea: lineaContrato.linea,
                        prefacturaId: prefacturaId,
                        unidadId: lineaContrato.unidadId,
                        articuloId: lineaContrato.articuloId,
                        tipoIvaId: lineaContrato.tipoIvaId,
                        porcentaje: lineaContrato.porcentaje,
                        descripcion: lineaContrato.descripcion,
                        cantidad: lineaContrato.cantidad,
                        importe: lineaContrato.costeUnidad * divisor,
                        totalLinea: lineaContrato.totalLinea * divisor,
                        coste: lineaContrato.coste * divisor,
                        porcentajeBeneficio: lineaContrato.porcentajeBeneficio,
                        importeBeneficioLinea: lineaContrato.importeBeneficioLinea * divisor,
                        porcentajeAgente: lineaContrato.porcentajeAgente,
                        importeAgenteLinea: lineaContrato.importeAgenteLinea * divisor,
                        ventaNetaLinea: lineaContrato.ventaNetaLinea * divisor,
                        capituloLinea: lineaContrato.capituloLinea
                    }
                }
                var sql = "INSERT INTO prefacturas_lineas SET ?";
                sql = mysql2.format(sql, lineaPrefacturaDb);
                let [result] = await con.query(sql);
            }
            data.push({ prefacturaId: prefacturaId, porcentajeRetencion: contrato.porcentajeRetencion });
            let result3 = await fnActualizarBasesPrefacturas2(con, data);
            resolve(result3);
        } catch (e) {
            resolve(null);
        }
    });
}

//RESTAURACIÓN PRECIO DE CONTRATOS ACTUALIZADOS CON EL IPC.


module.exports.getContratosActualizados = async (ids) => {
    let con = null;
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            //obtenemos promero la fecha de la última actualización
            sql = " SELECT max(fechaActulizacionContrato) AS fechaActulizacionContrato FROM contratos WHERE tipoContratoId = 3";
            let [fecha] = await con.query(sql);
            let f = moment(fecha[0].fechaActulizacionContrato).format('YYYY-MM-DD');


            //RECUPERAMOS LOS CONTRATOS QUE TENGAN PREFACTURAS ACTUALIZADAS QUE NO HAYAN SIDO FACTURADAS
            sql = "  SELECT DISTINCT cnt.contratoId, cnt.referencia, cnt.antTotalCliente,";
            sql += " cnt.importeCliente, cnt.importeAnualRenovacion, 'siPrefacturas'  AS prefacturas";
            sql += " FROM prefacturas AS p";
            sql += " LEFT JOIN facturas AS f ON f.facturaId = p.facturaId";
            sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = p.contratoId";
            sql += " INNER JOIN prefacturas_lineas_actualizadas AS pl ON pl.contratoId = cnt.contratoId";
            sql += " WHERE NOT cnt.fechaRenovacionIpc IS NULL ";
            sql += "   AND NOT cnt.fechaActulizacionContrato IS NULL ";
            sql += "   AND cnt.precioActualizado <> 0 ";
            sql += "   AND cnt.antTotalCliente <> 0 ";
            sql += "   AND cnt.antTotalCliente <> cnt.importeCliente";
            sql += "   AND cnt.contratoId NOT IN ";
            sql += " ("
            sql += "        SELECT DISTINCT cnt.contratoId";
            sql += "            FROM prefacturas_lineas_actualizadas  AS pl";
            sql += "             INNER JOIN contratos AS cnt ON cnt.contratoId = pl.contratoId";
            sql += "             INNER JOIN prefacturas AS p ON p.prefacturaId = pl.prefacturaId";
            sql += "             INNER JOIN facturas AS f ON f.facturaId = p.facturaId";
            sql += "             WHERE NOT cnt.fechaRenovacionIpc IS NULL AND NOT cnt.fechaActulizacionContrato IS NULL ";
            sql += "             AND cnt.precioActualizado <> 0 AND cnt.antTotalCliente <> 0 AND cnt.antTotalCliente <> cnt.importeCliente";
            sql += "             AND NOT p.facturaId IS NULL";
            sql += " )"

            sql += " AND cnt.fechaActulizacionContrato = '" + f + "'";
            if (ids) {
                sql += " AND cnt.contratoId IN (?)";
                sql = mysql2.format(sql, [ids])
            }

            sql += "   UNION";

            //RECUPEMOS LOS CONTRATOS ACTUALIZADOS SIN PREFACTURAS ACTUALIZADAS
            sql += "  SELECT DISTINCT cnt.contratoId, cnt.referencia, cnt.antTotalCliente,";
            sql += " cnt.importeCliente, cnt.importeAnualRenovacion, 'noPrefacturas' AS prefacturas";
            sql += " FROM prefacturas AS p";
            sql += " LEFT JOIN facturas AS f ON f.facturaId = p.facturaId";
            sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = p.contratoId";
            sql += " LEFT JOIN prefacturas_lineas_actualizadas AS pl ON pl.contratoId = cnt.contratoId";
            sql += " WHERE NOT cnt.fechaRenovacionIpc IS NULL ";
            sql += "   AND NOT cnt.fechaActulizacionContrato IS NULL ";
            sql += "   AND cnt.precioActualizado <> 0 ";
            sql += "   AND cnt.antTotalCliente <> 0 ";
            sql += "   AND cnt.antTotalCliente = cnt.importeCliente";
            sql += "   AND cnt.importeAnualRenovacion <> cnt.importeCliente";
            sql += "   AND cnt.fechaActulizacionContrato = '" + f + "'";
            if (ids) {
                sql += " AND cnt.contratoId IN (?)";
                sql = mysql2.format(sql, [ids])
            }
            const [contratos] = await con.query(sql);
            await con.end();
            resolve(contratos);
        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}


module.exports.putRevertirIpc = async (contratos) => {
    let con = null;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            let contratoId = 0;
            let referencias = [];
            let antTotalCliente = 0;
            let data = [];
            let porcentajeRetencion = 0;

            // Todo el proceso debe estar protegido por transacciones
            con = await mysql2.createConnection(obtenerConfiguracion());
            await con.beginTransaction();

            //recuperamos los contratos selecionados


            if (!contratos) throw new Error("No hay contratos con estos criterios, el proceso se ha detenido.");


            for (let c of contratos) {
                contratoId = c.contratoId;
                antTotalCliente = c.antTotalCliente;
                if (c.prefacturas == 'siPrefacturas') {
                    //ACTULIZACIÓN DE PREFACTURAS DEL CONTRATO
                    // Actualizar las lineas de las prefacturas
                    let result = await fnRevierteLineasPrefacturas(con, contratoId);
                    if (!result) throw new Error("Fallo al actualizar las lineas de las prefacturas del contrato " + c.referencia + ", el proceso se ha detenido");
                    //obtenemos las ids de las prefacturas y el porcentaje de retencion
                    if (result.length > 0) {
                        for (i = 0; i < result.length; i++) {
                            data.push({
                                prefacturaId: result[i].prefacturaId,
                                porcentajeRetencion: result[i].porcentajeRetencion
                            });
                        }
                    }
                    //Actulizar las bases de las prefacturas afectadas
                    let result3 = await fnActualizarBasesPrefacturas2(con, data);
                    if (!result3) throw new Error("Fallo al actualizar las bases del contrato " + c.referencia + ", el proceso se ha detenido");

                    //ACTUALIZACIÓN DEL CONTRATO

                    //buscamos las lineas del contrato
                    let result4 = await getContratoLineas2(con, contratoId);
                    if (!result4) throw new Error("Fallo al recuperar las lineas del contrato " + c.referencia + ", el proceso se ha detenido");
                    //calculamos la proporcionalidad de cada linea
                    let result5 = calculaProporcion(result4, c.importeCliente);
                    //recuperamos la suma de todas las prefacturas
                    let result6 = await getTotalesLineasPrefacturas(con, contratoId);
                    if (!result6) throw new Error("Fallo  al recuperar los totales del contrato " + c.referencia + ", el proceso se ha detenido");
                    //actualizamos las lineas del contrato
                    let result7 = await fnActualizarLineasContrato(con, contratoId, result6, result5);
                    if (!result7) throw new Error("Fallo al actualizar las lineas del contrato " + c.referencia + ", el proceso se ha detenido");
                    //actualizamos las bases y los totales
                    let result9 = await fnRevertirBasesContrato(con, contratoId, antTotalCliente);
                    if (!result9) throw new Error("Fallo al actualizar los importes de la cabecera del contrato " + c.referencia + ", el proceso se ha detenido");
                    //borramos los registros del contrato en la tabla prefacturas_lineas_actualizadas
                    let result10 = await borrarActulizadas(con, contratoId);
                    if (!result10) throw new Error("Fallo al borrar el historico de actualización del contrato " + c.referencia + ", el proceso se ha detenido");
                    referencias.push(c.referencia);
                } else {
                    //buscamos las lineas del contrato
                    let result4 = await getContratoLineas2(con, contratoId);
                    if (!result4) throw new Error("Fallo al recuperar las lineas del contrato " + c.referencia + ", el proceso se ha detenido");
                    //calculamos la proporcionalidad de cada linea
                    let result5 = calculaProporcion(result4, c.importeCliente);
                    //recuperamos la suma de todas las prefacturas
                    let result6 = await getTotalesLineasPrefacturas(con, contratoId);
                    if (!result6) throw new Error("Fallo  al recuperar los totales del contrato " + c.referencia + ", el proceso se ha detenido");
                    //actualizamos las lineas del contrato
                    let result7 = await fnActualizarLineasContrato(con, contratoId, result6, result5);
                    if (!result7) throw new Error("Fallo al actualizar las lineas del contrato " + c.referencia + ", el proceso se ha detenido");
                    //actualizamos las bases y los totales
                    let result9 = await fnRevertirBasesContrato(con, contratoId, antTotalCliente);
                    if (!result9) throw new Error("Fallo al actualizar los importes de la cabecera del contrato " + c.referencia + ", el proceso se ha detenido");
                    referencias.push(c.referencia);
                }
            }
            await con.commit();
            await con.end();
            resolve(referencias);
        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.rollback();
                    await con.end();
                }
            }
            reject(e);
        }
    });
}


let fnRevierteLineasPrefacturas = async (con, contratoId) => {
    return new Promise(async (resolve, reject) => {
        try {
            //primero recuperamos la Id de las prefacturas que van a resultar afectadas
            let sql = " SELECT pl.prefacturaId, p.porcentajeRetencion FROM prefacturas_lineas AS pl";
            sql += " INNER JOIN prefacturas_lineas_actualizadas AS pla ON pla.prefacturaLineaId = pl.prefacturaLineaId";
            sql += " INNER JOIN prefacturas AS p ON p.prefacturaId = pla.prefacturaId";
            sql += " INNER JOIN contratos AS c ON c.contratoId = pla.contratoId";
            sql += " WHERE pla.contratoId = ?";
            sql += " GROUP BY p.prefacturaId";
            sql = mysql2.format(sql, contratoId);
            let [result] = await con.query(sql);

            sql = " UPDATE prefacturas_lineas AS pl";
            sql += " INNER JOIN prefacturas_lineas_actualizadas AS pla ON pla.prefacturaLineaId = pl.prefacturaLineaId";
            sql += " INNER JOIN contratos AS c ON c.contratoId = pla.contratoId";
            sql += " SET";
            sql += "     pl.importe =   pla.importe,";
            sql += "     pl.totalLinea = pla.totalLinea,";
            sql += "     pl.coste = pla.coste";
            sql += " WHERE pla.contratoId = ?";
            sql = mysql2.format(sql, contratoId);
            let result2 = await con.query(sql);
            resolve(result);
        } catch (e) {
            resolve(null);
        }
    });
}

var fnRevertirBasesContrato = async (con, id, antTotalCliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            let importeAnualRenovacion = parseFloat(antTotalCliente)
            //BORRAMOS LAS BASES
            let sql = "DELETE FROM contratos_bases";
            sql += " WHERE contratoId = ?";
            sql = mysql2.format(sql, id);
            let result = await con.query(sql);

            //CREAMOS LAS NUEVAS BASES
            sql = "INSERT INTO contratos_bases (contratoId, tipoIvaId, porcentaje, base, cuota)";
            sql += " SELECT pl.contratoId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
            sql += " FROM";
            sql += " (SELECT contratoId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
            sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
            sql += " FROM contratos_lineas";
            sql += " WHERE contratoId = ?";
            sql += " GROUP BY tipoIvaId) AS pl";
            sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
            sql = mysql2.format(sql, id);
            let result2 = await con.query(sql);

            //ACTULIZAMOS LOS TOTALES EN LA CABECERA
            sql = "UPDATE contratos AS cnt,";
            sql += " (SELECT contratoId, SUM(base) AS b, SUM(cuota) AS c";
            sql += " FROM contratos_bases GROUP BY 1) AS cnt2,";
            sql += " (SELECT contratoId, SUM(coste) AS sc";
            sql += " FROM contratos_lineas GROUP BY 1) AS cnt3";
            sql += " SET cnt.importeCliente = cnt2.b,  cnt.total = cnt2.b, cnt.totalConIva = cnt2.b + cnt2.c,";
            sql += " cnt.coste = cnt3.sc,";
            sql += " cnt.ventaNeta =  cnt3.sc,";
            sql += " importeAnualRenovacion = " + importeAnualRenovacion + ",";
            //sql += " fechaRenovacionIpc = '" + fechaRenovacionIpc + "',";
            sql += " ipc = 0,";
            sql += " fechaActulizacionContrato = NULL,";
            sql += " antTotalCliente = 0,";
            sql += " precioActualizado = 0"
            sql += " WHERE cnt.contratoId = ?";
            sql += " AND cnt2.contratoId = cnt.contratoId";
            sql += " AND cnt3.contratoId = cnt.contratoId";
            sql = mysql2.format(sql, id);
            let result3 = await con.query(sql);
            resolve(result3);
        } catch (e) {
            resolve(null);
        }

    });
}

//GENERACION DE PREFACTURAS DE ALQUILERES

//GENERACION DE PREFACTURAS


//TASAS VISADO


module.exports.getContratoTasasVisado = function (id, callback) {
    var connection = cm.getConnection();
    var contratos = null;
    sql = "SELECT * FROM contratro_tasasvisado";
    sql += " WHERE contratoId = ?";
    sql += " ORDER by tasaVisadoId";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


module.exports.getContratoTasaVisado = function (id, callback) {
    var connection = cm.getConnection();
    var contratos = null;
    sql = "SELECT * FROM contratro_tasasvisado";
    sql += " WHERE tasaVisadoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}




module.exports.postContratoTasaVisado = function (contratoTasa, callback) {
    var connection = cm.getConnection();
    contratoTasa.tasaVisadoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO contratro_tasasvisado SET ?";
    sql = mysql.format(sql, contratoTasa);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        contratoTasa.tasaVisadoId = result.insertId;
        callback(null, contratoTasa);
    });
}


// putContratoLinea
// Modifica la linea de contrato según los datos del objeto pasao
module.exports.putContratoTasaVisado = function (id, contratoTasa, callback) {
    if (id != contratoTasa.tasaVisadoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = cm.getConnection();
    sql = "UPDATE contratro_tasasvisado SET ? WHERE tasaVisadoId = ?";
    sql = mysql.format(sql, [contratoTasa, contratoTasa.tasaVisadoId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) return callback(err);
        callback(null, contratoTasa);
    });
}


module.exports.deleteContratoLineaTasa = function (id, callback) {
    var connection = cm.getConnection();
    sql = "DELETE FROM contratro_tasasvisado WHERE tasaVisadoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
    });
}


//ARQUITECTURA

module.exports.getContratosArquitectura = function (done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, com2.nombre AS tecnicoNombre";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN contrato_tecnicos  AS ct ON ct.contratoId = cnt.contratoId";
        sql += " LEFT JOIN comerciales AS com2 ON com2.comercialId = ct.tecnicoId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratosActivosUsuarioArquitectura = function (usuarioId, dapartamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, com2.nombre AS tecnicoNombre";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN contrato_tecnicos  AS ct ON ct.contratoId = cnt.contratoId";
        sql += " LEFT JOIN comerciales  AS com2 ON com2.comercialId = ct.tecnicoId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE contratoCerrado = 0";
        if (dapartamentoId > 0) {
            sql += " AND cnt.tipoContratoId = " + dapartamentoId;
        } else {
            sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        sql += " ORDER BY cnt.fechaInicio DESC";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}


module.exports.getContratosUsuarioArquitectura = function (usuarioId, departamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, com2.nombre AS tecnicoNombre";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN contrato_tecnicos  AS ct ON ct.contratoId = cnt.contratoId";
        sql += " LEFT JOIN comerciales  AS com2 ON com2.comercialId = ct.tecnicoId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        if (departamentoId > 0) {
            sql += " WHERE cnt.tipoContratoId = " + departamentoId;
        } else {
            sql += " WHERE cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        sql += " ORDER BY cnt.fechaInicio DESC";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratosUsuarioPreavisoArquitectura = function (usuarioId, departamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, dp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, com2.nombre AS tecnicoNombre";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN contrato_tecnicos  AS ct ON ct.contratoId = cnt.contratoId";
        sql += " LEFT JOIN comerciales  AS com2 ON com2.comercialId = ct.tecnicoId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cnt.formaPagoId";
        sql += " WHERE NOW() >= DATE_SUB(cnt.fechaFinal, INTERVAL COALESCE(cnt.preaviso, 0) DAY) AND contratoCerrado = 0";
        if (departamentoId > 0) {
            sql += " AND cnt.tipoContratoId = " + departamentoId;
        } else {
            sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        sql += " ORDER BY cnt.fechaInicio DESC";
        sql = mysql.format(sql, usuarioId);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getContratoArquitectura = function (contratoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT cnt.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, com2.nombre AS tecnicoNombre";
        sql += " FROM contratos AS cnt";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = cnt.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = cnt.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = cnt.tipoContratoId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = cnt.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = cnt.agenteId";
        sql += " LEFT JOIN contrato_tecnicos  AS ct ON ct.contratoId = cnt.contratoId";
        sql += " LEFT JOIN comerciales  AS com2 ON com2.comercialId = ct.tecnicoId";
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

//creacion de report json
module.exports.postCrearReportContrato = async (contratoId) => {
    let connection = undefined;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            var obj =
            {
                datos_contrato: {},
                datos_contrato_pagos: [],
                datos_contrato_letras: [],
                datos_contrato_Intereses: []
            }
            //DATOS CONTRATO	
            sql += " SELECT ";
            sql += " c.contratoId,";
            sql += " COALESCE(c.direccion, '') AS direccionTrabajo,";
            sql += " COALESCE(c.codPostal, '') AS codPostalTrabajo,";
            sql += " COALESCE(c.provincia, '') AS provinciaTrabajo,";
            sql += " COALESCE(c.poblacion, '') AS poblacionTrabajo,";
            sql += " c.tipoProyectoId,";
            sql += " tp.nombre AS tipoProyecto,";
            //
            sql += " CAST(CONCAT(";
            sql += " DATE_FORMAT(c.fechaFormalizacionContrato,'%d'), ' de ', ";
            sql += " ELT(DATE_FORMAT(c.fechaFormalizacionContrato,'%m'),";
            sql += " 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'";
            sql += "), ' de ', ";
            sql += " DATE_FORMAT(c.fechaFormalizacionContrato,'%Y')";
            sql += ") AS CHAR) AS fecha,";
            //
            sql += " CAST(DATE_FORMAT(c.fechaContrato, '%d/%m/%Y') AS CHAR) AS fechaContrato,";
            sql += " c.referencia,"
            sql += " CAST(CONCAT(REPLACE(FORMAT(FLOOR(c.importeCliente), 0), ',', '.'), ',', LPAD(ROUND((c.importeCliente - FLOOR(c.importeCliente)) * 100), 2, '0')) AS CHAR) AS importeCliente, ";
            sql += " c.certificacionFinal AS cerFinal,";
            sql += " CAST(DATE_FORMAT(c.fechaJunta, '%d/%m/%Y') AS CHAR) AS fechaJunta,";
            sql += " cli.iban AS iban,";
            sql += " cli.nif AS nifCliente,";
            sql += " COALESCE(c.nombreFirmante, '') AS nombreFirmante,";
            sql += " COALESCE(c.dniFirmante, '') AS dniFirmante,";
            sql += " COALESCE(c.cargoFirmante, '') AS cargoFirmante,";
            sql += " COALESCE(c.correoFirmante, '') AS correoFirmante";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN tipos_proyecto AS tp ON tp.tipoProyectoId = c.tipoProyectoId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = c.clienteId";
            sql += ` WHERE contratoId = ${contratoId}`
            let [result] = await connection.query(sql);
            if (result.length > 0) {
                if (result[0].cerFinal !== null || !isNaN(result[0].cerFinal)) result[0].cerFinal = new Intl.NumberFormat('es-ES').format(result[0].cerFinal);
            }
            obj.datos_contrato = result[0]

            //PAGOS
            sql = "SELECT";
            sql += " p.contPlanificacionTempId,";
            sql += " pr.contratoId,";
            sql += " SUM(pr.totalAlCliente) AS totalAlCliente, ";
            sql += " SUM(pr.totalConIva) AS importePrefacturadoIva,";
            sql += " fp.nombre AS formaPago,";
            sql += " CONCAT(CONVERT(p.concepto USING utf8), IF(p.concepto LIKE '%FIRMA%', ' del contrato', IF(p.concepto LIKE '%INICIO%', ' de la obra', ''))) AS concepto,";
            sql += " p.porcentaje,";
            sql += " fp.formaPagoId,";
            sql += " fp.nombre AS formaPagoNombre";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN prefacturas_temporal AS pr ON pr.contratoId = c.contratoId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formapaGoId = pr.formaPagoId";
            sql += " LEFT JOIN contrato_planificacion_temporal AS p ON p.contPlanificacionTempId = pr.contPlanificacionTempId AND p.contratoId = c.contratoId";
            sql += ` WHERE c.contratoId = ${contratoId} AND fp.esLetra <> 1 AND p.esAdicional = 0`;
            sql += " GROUP BY p.contPlanificacionTempId";
            let [result3] = await connection.query(sql);
            if (result3.length > 0) {
                for (let i = 0; i < result3.length; i++) {
                    result3[i].totalAlCliente = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(result3[i].totalAlCliente).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                    result3[i].importePrefacturadoIva = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(result3[i].importePrefacturadoIva).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                    result3[i].porcentaje = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(result3[i].porcentaje).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                }
            }
            obj.datos_contrato_pagos = result3

            //LETRAS DE CAMBIO 
            sql = "SELECT";
            sql += " pr.prefacturaTempId,";
            sql += " pr.prefacturaInteresesTempId,";
            sql += " pr.contratoId, ";
            sql += " pr.totalAlCliente, ";
            sql += " pr.totalConIva, ";
            sql += " COALESCE(SUM(pr.totalAlcliente), 0) AS sumTotalAlcliente, ";
            sql += " COALESCE(SUM(pr.totalConIva), 0) AS sumTotalConIva, ";
            sql += " SUBSTRING_INDEX(pr.numletra, '/', -1) AS totletras, ";
            sql += " 1 AS esLetra,";
            sql += " COUNT(pr.prefacturaTempId) AS numletras  ";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN prefacturas_temporal AS pr ON pr.contratoId = c.contratoId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formapaGoId = pr.formaPagoId";
            sql += " LEFT JOIN contrato_planificacion_temporal  AS p ON p.contPlanificacionTempId = pr.contPlanificacionTempId AND p.contratoId = c.contratoId";
            sql += ` WHERE c.contratoId = ${contratoId} AND fp.esLetra = 1 AND p.esAdicional = 0`;
            sql += " GROUP BY pr.prefacturaTempId ";
            sql += " ORDER BY pr.fecha ASC";
            let [result2] = await connection.query(sql);
            obj.datos_contrato_letras = result2

            //LETRAS DE INTERESES
            sql = " SELECT ";
            sql += " pr2.contratoId,  ";
            sql += " pr2.prefacturaTempId AS prefacturaInteresesTempId,";
            sql += " pr2.totalAlCliente,  ";
            sql += " pr2.totalConIva,  ";
            sql += " COALESCE(SUM(pr2.totalAlcliente), 0) AS sumTotalAlcliente,  ";
            sql += " COALESCE(SUM(pr2.totalConIva), 0) AS sumTotalConIva,  ";
            sql += " SUBSTRING_INDEX(pr2.numletra, '/', -1) AS totletras,  1 AS esLetra, ";
            sql += " COUNT(pr2.prefacturaTempId) AS numletras,p.esAdicional ";
            sql += " FROM contratos AS c  ";
            sql += " LEFT JOIN contratos AS c2 ON c2.contratoId = c.contratoInteresesId  ";
            sql += " LEFT JOIN prefacturas_temporal AS pr ON pr.contratoId = c.contratoId ";
            sql += " INNER JOIN prefacturas_temporal AS pr2 ON pr2.prefacturaTempId = pr.prefacturaInteresesTempId ";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formapaGoId = pr.formaPagoId ";
            sql += " LEFT JOIN contrato_planificacion_temporal  AS p ON p.contPlanificacionTempId = pr.contPlanificacionTempId AND p.contratoId = c.contratoId ";
            sql += ` WHERE c.contratoId = ${contratoId}  AND fp.esLetra = 1 AND p.esAdicional = 0 `;
            sql += " GROUP BY pr2.prefacturaTempId  ";
            sql += " ORDER BY pr2.fecha ASC";
            let [result4] = await connection.query(sql);

            const round2 = n => Math.round(n * 100) / 100;

            obj.datos_contrato_Intereses = result4

            // Crear un mapa del segundo array
            const interesesMap = new Map(
                obj.datos_contrato_Intereses.map(i => [
                    i.prefacturaInteresesTempId,
                    i
                ])
            );

            for (const pr of obj.datos_contrato_letras) {
                const pi = interesesMap.get(pr.prefacturaInteresesTempId);

                // Convertir a número siempre
                let totalAlCliente = parseFloat(pr.sumTotalAlcliente) || 0;
                let totalConIva = parseFloat(pr.sumTotalConIva) || 0;

                if (pi) {
                    totalAlCliente += parseFloat(pi.sumTotalAlcliente) || 0;
                    totalConIva += parseFloat(pi.sumTotalConIva) || 0;
                }

                pr.sumTotalAlcliente = round2(totalAlCliente);
                pr.sumTotalConIva = round2(totalConIva);
            }


            resolve(obj)

        } catch (e) {
            reject(e)
        }

    });
}


//creacion de report json
module.exports.postCrearReportAdicional = async (contratoId, refPresupuestoAdicional, contratoInteresesId) => {
    let connection = undefined;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            var obj =
            {
                datos_contrato: {},
                datos_contrato_pagos: [],
                datos_contrato_letras: [],
                datos_contrato_Intereses: []
            }
            //DATOS CONTRATO	
            sql += " SELECT DISTINCT";
            sql += " c.contratoId,";
            sql += " COALESCE(c.direccion, '') AS direccionTrabajo,";
            sql += " COALESCE(c.codPostal, '') AS codPostalTrabajo,";
            sql += " COALESCE(c.provincia, '') AS provinciaTrabajo,";
            sql += " COALESCE(c.poblacion, '') AS poblacionTrabajo,";
            sql += " c.tipoProyectoId,";
            sql += " tp.nombre AS tipoProyecto,";
            sql += " ct.refPresupuestoAdicional AS referenciaAdicional,"
            //
            sql += " CAST(DATE_FORMAT(c.fechaFormalizacionContrato, '%d/%m/%Y') AS CHAR) AS fechaContrato,";
            sql += " ct.refPresupuestoAdicional AS referenciaAdicional,"
            sql += " c.referencia,"
            sql += " CAST(CONCAT(REPLACE(FORMAT(FLOOR(c.importeCliente), 0), ',', '.'), ',', LPAD(ROUND((c.importeCliente - FLOOR(c.importeCliente)) * 100), 2, '0')) AS CHAR) AS importeCliente, ";
            sql += " c.certificacionFinal AS cerFinal,";
            sql += " CAST(DATE_FORMAT(c.fechaJunta, '%d/%m/%Y') AS CHAR) AS fechaJunta,";
            sql += " cli.iban AS iban,";
            sql += " cli.nif AS nifCliente,";
            sql += " COALESCE(c.nombreFirmante, '') AS nombreFirmante,";
            sql += " COALESCE(c.dniFirmante, '') AS dniFirmante,";
            sql += " COALESCE(c.cargoFirmante, '') AS cargoFirmante,";
            sql += " COALESCE(c.correoFirmante, '') AS correoFirmante";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN contrato_planificacion_temporal AS ct ON ct.contratoId = c.contratoId";
            sql += " LEFT JOIN tipos_proyecto AS tp ON tp.tipoProyectoId = c.tipoProyectoId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = c.clienteId";
            sql += ` WHERE ct.contratoId = ${contratoId}  AND ct.refPresupuestoAdicional = '${refPresupuestoAdicional}'`;
            let [result] = await connection.query(sql);
            if (result.length > 0) {
                if (result[0].cerFinal !== null || !isNaN(result[0].cerFinal)) result[0].cerFinal = new Intl.NumberFormat('es-ES').format(result[0].cerFinal);
            }
            obj.datos_contrato = result[0]

            //PAGOS
            sql = "SELECT";
            sql += " ct.contPlanificacionTempId,";
            sql += " pr.contratoId,";
            sql += " SUM(pr.totalAlCliente) AS totalAlCliente, ";
            sql += " SUM(pr.totalConIva) AS importePrefacturadoIva,";
            sql += " fp.nombre AS formaPago,";
            sql += " CONCAT(CONVERT(ct.concepto USING utf8), IF(ct.concepto LIKE '%FIRMA%', ' del contrato', IF(ct.concepto LIKE '%INICIO%', ' de la obra', ''))) AS concepto,";
            sql += " ct.porcentaje,";
            sql += " fp.formaPagoId,";
            sql += " fp.nombre AS formaPagoNombre";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN prefacturas_temporal AS pr ON pr.contratoId = c.contratoId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formapaGoId = pr.formaPagoId";
            sql += " LEFT JOIN contrato_planificacion_temporal  AS ct ON ct.contPlanificacionTempId = pr.contPlanificacionTempId AND ct.contratoId = c.contratoId";
            sql += ` WHERE ct.contratoId = ${contratoId} AND fp.esLetra <> 1 AND ct.esAdicional = 1 AND ct.refPresupuestoAdicional = '${refPresupuestoAdicional}'`;
            sql += " GROUP BY ct.contPlanificacionTempId";
            let [result3] = await connection.query(sql);
            if (result3.length > 0) {
                for (let i = 0; i < result3.length; i++) {
                    result3[i].totalAlCliente = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(result3[i].totalAlCliente).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                    result3[i].importePrefacturadoIva = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(result3[i].importePrefacturadoIva).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                    result3[i].porcentaje = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(result3[i].porcentaje).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                }
            }
            obj.datos_contrato_pagos = result3

            //LETRAS DE CAMBIO 
            sql = "SELECT";
            sql += " pr.prefacturaTempId,";
            sql += " pr.prefacturaInteresesTempId,";
            sql += " pr.contratoId, ";
            sql += " pr.totalAlCliente, ";
            sql += " pr.totalConIva, ";
            sql += " COALESCE(SUM(pr.totalAlcliente), 0) AS sumTotalAlcliente, ";
            sql += " COALESCE(SUM(pr.totalConIva), 0) AS sumTotalConIva, ";
            sql += " SUBSTRING_INDEX(pr.numletra, '/', -1) AS totletras, ";
            sql += " 1 AS esLetra,";
            sql += " COUNT(pr.prefacturaTempId) AS numletras  ";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN prefacturas_temporal AS pr ON pr.contratoId = c.contratoId";
            sql += " LEFT JOIN contrato_planificacion_temporal AS ct ON ct.contPlanificacionTempId = pr.contPlanificacionTempId AND ct.contratoId = c.contratoId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formapaGoId = pr.formaPagoId";
            sql += ` WHERE ct.contratoId = ${contratoId} AND fp.esLetra = 1 AND ct.esAdicional = 1  AND ct.refPresupuestoAdicional = '${refPresupuestoAdicional}'`;
            sql += " GROUP BY pr.prefacturaTempId ";
            sql += " ORDER BY pr.fecha ASC";
            let [result2] = await connection.query(sql);

            obj.datos_contrato_letras = result2
            //LETRAS DE INTERESES
            sql = "SELECT";
            sql += " pr2.contratoId,  ";
            sql += " pr2.prefacturaTempId AS prefacturaInteresesTempId,";
            sql += " pr2.totalAlCliente,  ";
            sql += " pr2.totalConIva,  ";
            sql += " COALESCE(SUM(pr2.totalAlcliente), 0) AS sumTotalAlcliente,  ";
            sql += " COALESCE(SUM(pr2.totalConIva), 0) AS sumTotalConIva,  ";
            sql += " SUBSTRING_INDEX(pr2.numletra, '/', -1) AS totletras,  1 AS esLetra, ";
            sql += " COUNT(pr2.prefacturaTempId) AS numletras,p.esAdicional ";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN contratos AS c2 ON c2.contratoId = c.contratoInteresesId  ";
            sql += " LEFT JOIN prefacturas_temporal AS pr ON pr.contratoId = c.contratoId";
            sql += " INNER JOIN prefacturas_temporal AS pr2 ON pr2.prefacturaTempId = pr.prefacturaInteresesTempId ";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formapaGoId = pr.formaPagoId";
            sql += " LEFT JOIN contrato_planificacion_temporal  AS p ON p.contPlanificacionTempId = pr.contPlanificacionTempId AND p.contratoId = c.contratoId ";
            sql += ` WHERE p.contratoId = ${contratoId} AND fp.esLetra = 1 AND p.esAdicional = 1  AND p.refPresupuestoAdicional = '${refPresupuestoAdicional}'`;
            sql += " GROUP BY pr.prefacturaTempId ";
            sql += " ORDER BY pr.fecha ASC";
            let [result4] = await connection.query(sql);

            const round2 = n => Math.round(n * 100) / 100;

            obj.datos_contrato_Intereses = result4

            // Crear un mapa del segundo array
            const interesesMap = new Map(
                obj.datos_contrato_Intereses.map(i => [
                    i.prefacturaInteresesTempId,
                    i
                ])
            );

            for (const pr of obj.datos_contrato_letras) {
                const pi = interesesMap.get(pr.prefacturaInteresesTempId);
                if (!pi) continue;

                pr.sumTotalAlcliente = round2(
                    parseFloat(pr.sumTotalAlcliente) + parseFloat(pi.sumTotalAlcliente)
                );

                pr.sumTotalConIva = round2(
                    parseFloat(pr.sumTotalConIva) + parseFloat(pi.sumTotalConIva)
                );
            }

            resolve(obj)

        } catch (e) {
            reject(e)
        }

    });
}

//creacion de report json
module.exports.postCrearReportContratoActaRecepcion = async (contratoId) => {
    let connection = undefined;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            var obj =
            {
                datos_contrato: {},
                datos_contrato_pagos: [],
                datos_contrato_letras: [],
                datos_contrato_Intereses: []
            }
            //DATOS CONTRATO	
            sql += " SELECT ";
            sql += " c.contratoId,";
            sql += " CONCAT(COALESCE(tv.nombre, ''), ' ', COALESCE(c.direccion, '')) AS direccionTrabajo,";
            sql += " COALESCE(c.codPostal, '') AS codPostalTrabajo,";
            sql += " COALESCE(c.provincia, '') AS provinciaTrabajo,";
            sql += " COALESCE(c.poblacion, '') AS poblacionTrabajo,";
            sql += " c.tipoProyectoId,";
            sql += " tp.nombre AS tipoProyecto,";
            //
            sql += " CAST(CONCAT(";
            sql += " DATE_FORMAT(c.fechaFormalizacionContrato,'%d'), ' de ', ";
            sql += " ELT(DATE_FORMAT(c.fechaFormalizacionContrato,'%m'),";
            sql += " 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'";
            sql += "), ' de ', ";
            sql += " DATE_FORMAT(c.fechaFormalizacionContrato,'%Y')";
            sql += ") AS CHAR) AS fecha,";
            //
            sql += " CAST(CONCAT(";
            sql += " DATE_FORMAT(CURDATE(), '%d'), ' de ', ";
            sql += " ELT(DATE_FORMAT(CURDATE(), '%m'),";
            sql += " 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'";
            sql += "), ' de ', ";
            sql += " DATE_FORMAT(CURDATE(), '%Y') ";
            sql += ") AS CHAR) AS fechaActual,";

            //
            sql += " CAST(DATE_FORMAT(c.fechaInicio, '%d/%m/%Y') AS CHAR) AS fechaInicio,";
            sql += " c.referencia,";
            sql += " CAST(CONCAT(REPLACE(FORMAT(FLOOR(c.certificacionFinal), 0), ',', '.'), ',', LPAD(ROUND((c.certificacionFinal - FLOOR(c.certificacionFinal)) * 100), 2, '0')) AS CHAR) AS certificacionFinal,";
            sql += " CAST(CONCAT(REPLACE(FORMAT(FLOOR(c.importeCliente), 0), ',', '.'), ',', LPAD(ROUND((c.importeCliente - FLOOR(c.importeCliente)) * 100), 2, '0')) AS CHAR) AS importeCliente, ";
            sql += " c.certificacionFinal AS cerFinal,";
            sql += " CAST(DATE_FORMAT(c.fechaJunta, '%d/%m/%Y') AS CHAR) AS fechaJunta,";
            sql += " cli.iban AS iban,";
            sql += " cli.nif AS nifCliente,";
            sql += " COALESCE(c.nombreFirmante, '') AS nombreFirmante,";
            sql += " COALESCE(c.dniFirmante, '') AS dniFirmante,";
            sql += " COALESCE(c.cargoFirmante, '') AS cargoFirmante,";
            sql += " COALESCE(c.correoFirmante, '') AS correoFirmante,";
            sql += " COALESCE(cli.nombre, '') AS nombreCliente";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN tipos_proyecto AS tp ON tp.tipoProyectoId = c.tipoProyectoId";
            sql += " LEFT JOIN tipos_via AS tv ON tv.tipoViaId = c.tipoViaId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = c.clienteId";
            sql += ` WHERE contratoId = ${contratoId}`
            let [result] = await connection.query(sql);
            if (result.length > 0) {
                if (result[0].cerFinal !== null || !isNaN(result[0].cerFinal)) result[0].cerFinal = new Intl.NumberFormat('es-ES').format(result[0].cerFinal);
            }
            obj.datos_contrato = result[0]

            //PAGOS
            sql = "SELECT";
            sql += " pr.fecha,";
            sql += " p.contPlanificacionId,";
            sql += " pr.contratoId,";
            sql += " SUM(pr.totalAlCliente) AS totalAlCliente, ";
            sql += " SUM(pr.totalConIva) AS importePrefacturadoIva,";
            sql += " fp.nombre AS formaPago,";
            sql += " CONCAT(CONVERT(p.concepto USING utf8), IF(p.concepto LIKE '%FIRMA%', ' del contrato', IF(p.concepto LIKE '%INICIO%', ' de la obra', ''))) AS concepto,";
            sql += " p.porcentaje,";
            sql += " fp.formaPagoId,";
            sql += " fp.nombre AS formaPagoNombre";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN prefacturas AS pr ON pr.contratoId = c.contratoId";
            sql += " LEFT JOIN facturas AS f ON f.facturaId = pr.facturaId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formapaGoId = pr.formaPagoId";
            sql += " LEFT JOIN contrato_planificacion  AS p ON p.contPlanificacionId = pr.contPlanificacionId AND p.contratoId = c.contratoId";
            sql += ` WHERE c.contratoId = ${contratoId} AND fp.esLetra <> 1 AND p.esAdicional = 0 AND (f.facturaId IS NULL OR f.contabilizada = 0)`;
            sql += " GROUP BY p.contPlanificacionId";


            let [result3] = await connection.query(sql);
            let totalPagos = 0;
            let totalLetras = 0;
            let totalIntereses = 0;
            if (result3.length > 0) {
                totalPagos = result3.reduce((acc, pago) => acc + parseFloat(pago.importePrefacturadoIva), 0);
                for (let i = 0; i < result3.length; i++) {
                    result3[i].totalAlCliente = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(result3[i].totalAlCliente).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                    result3[i].importePrefacturadoIva = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(result3[i].importePrefacturadoIva).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                    result3[i].porcentaje = new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(result3[i].porcentaje).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                }
            }
            obj.datos_contrato_pagos = result3

            //LETRAS DE CAMBIO 
            sql = "SELECT";
            sql += " pr.fecha,";
            sql += " pr.contratoId, ";
            sql += " pr.prefacturaId,";
            sql += " pr.prefacturaInteresesId,";
            sql += " pr.totalAlCliente, ";
            sql += " pr.totalConIva, ";
            sql += " COALESCE(SUM(pr.totalAlcliente), 0) AS sumTotalAlcliente, ";
            sql += " COALESCE(SUM(pr.totalConIva), 0) AS sumTotalConIva, ";
            sql += " SUBSTRING_INDEX(pr.numletra, '/', -1) AS totletras, ";
            sql += " 1 AS esLetra,";
            sql += " COUNT(pr.prefacturaId) AS numletras  ";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN prefacturas AS pr ON pr.contratoId = c.contratoId";
            sql += " LEFT JOIN facturas AS f ON f.facturaId = pr.facturaId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formapaGoId = pr.formaPagoId";
            sql += " LEFT JOIN contrato_planificacion  AS p ON p.contPlanificacionId = pr.contPlanificacionId AND p.contratoId = c.contratoId";
            sql += ` WHERE c.contratoId = ${contratoId} AND fp.esLetra = 1 AND p.esAdicional = 0 AND (f.facturaId IS NULL OR f.contabilizada = 0)`;
            sql += " GROUP BY pr.prefacturaId ";
            sql += " ORDER BY pr.fecha ASC";
            let [result2] = await connection.query(sql);

            obj.datos_contrato_letras = result2

            const fechas = obj.datos_contrato_letras.map(item => new Date(item.fecha));

            const fechaMenor = new Date(Math.min(...fechas));
            const fechaMayor = new Date(Math.max(...fechas));

            obj.datos_contrato.fechaMenorLetra = moment(fechaMenor).format('DD/MM/YY')
            obj.datos_contrato.fechaMayorLetra = moment(fechaMayor).format('DD/MM/YY')

            if (result2.length > 0) {
                totalLetras = result2.reduce((acc, pago) => acc + parseFloat(pago.sumTotalConIva), 0);

            }

            //LETRAS DE INTERESES
            sql = "SELECT";
            sql += " pr2.fecha,";
            sql += " pr2.contratoId,  ";
            sql += " pr2.prefacturaId AS prefacturaInteresesId,";
            sql += " pr2.totalAlCliente, ";
            sql += " pr2.totalConIva, ";
            sql += " COALESCE(SUM(pr2.totalAlcliente), 0) AS sumTotalAlcliente, ";
            sql += " COALESCE(SUM(pr2.totalConIva), 0) AS sumTotalConIva, ";
            sql += " SUBSTRING_INDEX(pr2.numletra, '/', -1) AS totletras, ";
            sql += " 1 AS esLetra,";
            sql += " COUNT(pr2.prefacturaId) AS numletras  ";
            sql += " FROM contratos AS c ";
            sql += " LEFT JOIN contratos AS c2 ON c2.contratoId = c.contratoInteresesId ";
            sql += " LEFT JOIN prefacturas AS pr ON pr.contratoId = c.contratoId";
            sql += " INNER JOIN prefacturas AS pr2 ON pr2.prefacturaId = pr.prefacturaInteresesId ";
            sql += " LEFT JOIN facturas AS f ON f.facturaId = pr2.facturaId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formapaGoId = pr.formaPagoId";
            sql += " LEFT JOIN contrato_planificacion  AS p ON p.contPlanificacionId = pr.contPlanificacionId AND p.contratoId = c.contratoId";
            sql += ` WHERE c.contratoId = ${contratoId} AND fp.esLetra = 1 AND p.esAdicional = 0 AND (f.facturaId IS NULL OR f.contabilizada = 0)`;
            sql += " GROUP BY pr2.prefacturaId";
            sql += " ORDER BY pr2.fecha ASC";

            let [result4] = await connection.query(sql);
            obj.datos_contrato_Intereses = result4
            if (result4.length > 0) {
                totalIntereses = result4.reduce((acc, pago) => acc + parseFloat(pago.sumTotalConIva), 0);

            }

            const round2 = n => Math.round(n * 100) / 100;


            // Crear un mapa del segundo array
            const interesesMap = new Map(
                obj.datos_contrato_Intereses.map(i => [
                    i.prefacturaInteresesId,
                    i
                ])
            );

            for (const pr of obj.datos_contrato_letras) {
                const pi = interesesMap.get(pr.prefacturaInteresesId);
                if (!pi) continue;

                pr.sumTotalAlcliente = round2(
                    parseFloat(pr.sumTotalAlcliente) + parseFloat(pi.sumTotalAlcliente)
                );

                pr.sumTotalConIva = round2(
                    parseFloat(pr.sumTotalConIva) + parseFloat(pi.sumTotalConIva)
                );

                pr.sumTotalConIvaFormat = new Intl.NumberFormat('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(pr.sumTotalConIva).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }

            obj.datos_contrato.totalPendienteFacturar = new Intl.NumberFormat('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(round2(totalPagos + totalLetras + totalIntereses)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');




            resolve(obj)

        } catch (e) {
            reject(e)
        }

    });
}
var borrarActulizadas = async (con, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            //BORRAMOS LOS REGISTROS
            let sql = "DELETE FROM prefacturas_lineas_actualizadas";
            sql += " WHERE contratoId = ?";
            sql = mysql2.format(sql, id);
            let result = await con.query(sql);
            resolve(result);
        } catch (e) {
            resolve(null);
        }

    });
}

module.exports.getContratosVisibesNoVisibles = async (departamentoId, visible) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            //await con.beginTransaction();
            var sql = "SELECT DISTINCT";
            sql += " c.contratoId,";
            sql += " c.clienteId,";
            sql += " CONCAT(cl.nombre, ' ', e.titulo) AS tituloNombre";
            sql += " FROM contratos AS c";
            sql += " LEFT JOIN ofertas AS of ON of.ofertaId = c.ofertaId";
            sql += " LEFT JOIN ofertas AS of2 ON of2.ofertaId = of.ofertaCosteId AND of2.esCoste = 1";
            sql += " LEFT JOIN ofertas AS of3 ON of3.ofertaCosteId = of2.ofertaId AND of3.esCoste = 2";
            sql += " LEFT JOIN subcontrata_propuestas AS sp ON sp.subcontrataId = of3.ofertaId";
            sql += " LEFT JOIN propuestas AS p ON p.propuestaId = sp.propuestaId ";
            sql += " LEFT JOIN expedientes AS e ON e.expedienteId = of.expedienteId";
            sql += " LEFT JOIN contactosexpediente AS co ON co.expedienteId = e.expedienteId";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = c.clienteId";
            sql += " LEFT JOIN proveedores AS pr ON pr.proveedorId = p.proveedorId";
            sql += " LEFT JOIN comerciales AS cm ON cm.comercialId = cl.colaboradorId";
            sql += " WHERE c.tipoContratoId = ? AND  c.visulizaEnErp = ?  AND NOT of3.referencia IS NULL AND p.ofertaGanadora = 1";
            sql = mysql2.format(sql, [departamentoId, visible]);
            const [result] = await con.query(sql);
            await con.end();
            resolve(result);

        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}

module.exports.getContratoVisibeNoVisible = async (departamentoId, visible, contratoId) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT c.contratoId,";
            sql += " c.referencia AS referenciaVentas, ";
            sql += " cl.nombre AS clienteNombre,";
            sql += " of.tituloTexto,";
            sql += " e.titulo AS tituloTextoExpediente,";
            sql += " c.fechaContrato AS fechaContrato,";
            sql += " of2.ofertaId AS ofertaCosteId,";
            sql += " of2.referencia AS referenciaCoste, ";
            sql += " of3.ofertaId AS ofertaSubcontrataId,";
            sql += " of3.referencia AS referenciaSubcontrata,";
            sql += " p.proveedorId,";
            sql += " pr.nombre AS proveedorNombre,";
            sql += " sp.propuestaId,";
            sql += " IF(e.honorarioVariableId = 1, 0, 2) AS honorarioVariable,";
            sql += " cl.comercialId,";
            sql += " cm.nombre AS comercialNombre,";
            sql += " co.contactoExpedienteId,";
            sql += " co.contactoNombre,";
            sql += " co.telefono1,";
            sql += " co.telefono2,";
            sql += " co.correo,";
            sql += " co.observaciones";
            sql += " FROM contratos AS c";
            sql += " LEFT JOIN ofertas AS of ON of.ofertaId = c.ofertaId";
            sql += " LEFT JOIN ofertas AS of2 ON of2.ofertaId = of.ofertaCosteId AND of2.esCoste = 1";
            sql += " LEFT JOIN ofertas AS of3 ON of3.ofertaCosteId = of2.ofertaId AND of3.esCoste = 2";
            sql += " LEFT JOIN subcontrata_propuestas AS sp ON sp.subcontrataId = of3.ofertaId";
            sql += " LEFT JOIN propuestas AS p ON p.propuestaId = sp.propuestaId ";
            sql += " LEFT JOIN expedientes AS e ON e.expedienteId = of.expedienteId";
            sql += " LEFT JOIN contactosexpediente AS co ON co.expedienteId = e.expedienteId";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = c.clienteId";
            sql += " LEFT JOIN proveedores AS pr ON pr.proveedorId = p.proveedorId";
            sql += " LEFT JOIN comerciales AS cm ON cm.comercialId = cl.colaboradorId";
            sql += " WHERE c.tipoContratoId = ? AND  c.visulizaEnErp = ? AND c.contratoId = ? AND NOT of3.referencia IS NULL AND p.ofertaGanadora = 1";
            sql = mysql2.format(sql, [departamentoId, visible, contratoId]);
            let [result] = await con.query(sql);
            await con.end();
            if (result.length > 0) result = procesaResultado(result)
            resolve(result);

        } catch (e) {
            if (con) {
                if (!con.connection._closing) {
                    await con.end();
                }
            }
            reject(e);
        }
    });
}


var procesaResultado = function (result) {
    var antdir = null;
    var cont = 1;
    var regs = [];
    var obj = {

    };
    var obj = {

    };

    result.forEach(e => {
        if (antdir) {
            if (antdir == e.contratoId) {
                if (e.contactoExpedienteId) {//procesamos las direcciones
                    direccionesObj = {
                        contactoExpedienteId: e.contactoExpedienteId,
                        contactoNombre: e.contactoNombre,
                        telefono1: e.telefono1,
                        telefono2: e.telefono2,
                        correo: e.correo,
                        observaciones: e.observaciones

                    };
                    if (e.contratoId == e.contratoId) {
                        obj.direcciones.push(direccionesObj);
                    }
                    direccionesObj = {}; //una vez incluida la factura en el documento se limpian los datos
                }
                antdir = e.contratoId;

            } else {
                //si es otro documento de pago guardamos el anterior y creamos otro
                regs.push(obj);
                obj = {
                    contratoId: e.contratoId,
                    referenciaVentas: e.referenciaVentas,
                    clienteNombre: e.clienteNombre,
                    tituloTexto: e.tituloTexto,
                    tituloTextoExpediente: e.tituloTextoExpediente,
                    fechaContrato: e.fechaContrato,
                    ofertaCosteId: e.ofertaCosteId,
                    referenciaCoste: e.referenciaCoste,
                    ofertaSubcontrataId: e.ofertaSubcontrataId,
                    referenciaSubcontrata: e.referenciaSubcontrata,
                    proveedorId: e.proveedorId,
                    proveedorNombre: e.proveedorNombre,
                    propuestaId: e.propuestaId,
                    honorarioVariable: e.honorarioVariable,
                    comercialId: e.comercialId,
                    comercialNombre: e.comercialNombre,
                    direcciones: [],
                };
                if (e.contratoDocumentoId) {//procesamos las facturas
                    direccionesObj = {
                        contactoExpedienteId: e.contactoExpedienteId,
                        contactoNombre: e.contactoNombre,
                        telefono1: e.telefono1,
                        telefono2: e.telefono2,
                        correo: e.correo,
                        observaciones: e.observaciones

                    };

                    if (e.contratoId == e.contratoId) {
                        obj.direcciones.push(direccionesObj);
                    }
                    direccionesObj = {}; //una vez incluida la factura en el documento se limpian los datos
                }


                antdir = e.contratoId;
            }

        }
        if (!antdir) {
            obj = {
                contratoId: e.contratoId,
                referenciaVentas: e.referenciaVentas,
                clienteNombre: e.clienteNombre,
                tituloTexto: e.tituloTexto,
                tituloTextoExpediente: e.tituloTextoExpediente,
                fechaContrato: e.fechaContrato,
                ofertaCosteId: e.ofertaCosteId,
                referenciaCoste: e.referenciaCoste,
                ofertaSubcontrataId: e.ofertaSubcontrataId,
                referenciaSubcontrata: e.referenciaSubcontrata,
                proveedorId: e.proveedorId,
                proveedorNombre: e.proveedorNombre,
                propuestaId: e.propuestaId,
                honorarioVariable: e.honorarioVariable,
                comercialId: e.comercialId,
                comercialNombre: e.comercialNombre,
                direcciones: [],
            };
            if (e.contactoExpedienteId) {
                direccionesObj = {
                    contactoExpedienteId: e.contactoExpedienteId,
                    contactoNombre: e.contactoNombre,
                    telefono1: e.telefono1,
                    telefono2: e.telefono2,
                    correo: e.correo,
                    observaciones: e.observaciones

                };

                if (e.contratoId == e.contratoId) {
                    obj.direcciones.push(direccionesObj);
                }
                direccionesObj = {};
            }
            antdir = e.contratoId;
        }
        //si se trata del ultimo registro lo guardamos
        if (cont == result.length) {
            regs.push(obj);
        }
        cont++;

    });


    return regs;
}


//creacion de report json
module.exports.postContratoIntereses = async (contratoId, totalIntereses) => {
    let connection = undefined;
    let sql = "";
    let contrato = null;
    let newContratoId = 0;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            await connection.beginTransaction();
            //DATOS CONTRATO	
            sql = " SELECT *";
            sql += " FROM contratos";
            sql += ` WHERE contratoId = ${contratoId}`
            let [result] = await connection.query(sql);
            if (result.length > 0) {
                result[0].certificacionFinal = null;
                result[0].contratoInteresesId = null;
                result[0].contratoId = 0;
                contrato = result[0];
                contrato.referencia = contrato.referencia + " I";
                //
                result[0].porcentajeBeneficio = 0;
                result[0].importeBeneficio = 0;
                result[0].porcentajeAgente = 0;
                result[0].importeAgente = 0;
                result[0].total = result[0].coste;
                result[0].ventaNeta = result[0].coste;
                result[0].importeCliente = result[0].coste;
                result[0].totalConIva = result[0].coste;
                result[0].contratoIntereses = 1;
                sql = "INSERT INTO contratos SET ?";
                sql = mysql2.format(sql, contrato);
                let [result2] = await connection.query(sql);
                newContratoId = result2.insertId;
                //creamos la linea
                let contratoLinea = {
                    contratoLineaId: 0,
                    linea: 1.100,
                    contratoId: newContratoId,
                    articuloId: 708,
                    unidadId: 9,
                    tipoIvaId: 4,
                    porcentaje: 0,
                    descripcion: 'SUPLIDOS OBRAS',
                    cantidad: 1.00,
                    importe: totalIntereses,
                    totalLinea: totalIntereses,
                    coste: totalIntereses,
                    porcentajeBeneficio: 0.00,
                    porcentajeAgente: 0.00,
                    capituloLinea: 'Capitulo 1: SUPLIDOS OBRAS',
                }
                this.postContratoLineaNew(contratoLinea, connection, async function (err, resultado) {
                    if (err) {
                        throw new Error(err.message);
                    } else {
                        //DATOS DE LOS INTERESES
                        sql = " SELECT pt.*";
                        sql += " FROM contrato_planificacion_temporal as pt";
                        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pt.formaPagoId";
                        sql += ` WHERE pt.contratoId = ${contratoId} AND fp.esLetra = 1 AND pt.importeIntereses > 0`;
                        let [result3] = await connection.query(sql);
                        if (result3.length > 0) {
                            for (let i = 0; i < result3.length; i++) {
                                let planificacion = result3[i];
                                let antId = planificacion.contPlanificacionTempId;
                                //creamos la linea de intereses 
                                planificacion.contPlanificacionTempId = 0;
                                planificacion.contratoId = newContratoId;
                                planificacion.importe = planificacion.importeIntereses;
                                planificacion.importeIntereses = 0;
                                planificacion.porcentaje = (totalIntereses > 0) ? (planificacion.importe * 100) / totalIntereses : 0;
                                planificacion.fecha = new Date();
                                planificacion.importePrefacturado = 0;
                                sql = " INSERT INTO contrato_planificacion_temporal SET ? ";
                                sql = mysql2.format(sql, planificacion);
                                let [result5] = await connection.query(sql);
                                //actualizamos la planificacion principal con el id de la linea de intereses creada
                                let newPlanificacionId = result5.insertId;
                                sql = " UPDATE contrato_planificacion_temporal SET contPlanificacionTempIntId = ? WHERE contratoId = ? AND contPlanificacionTempId =  ? ";
                                sql = mysql2.format(sql, [newPlanificacionId, contratoId, antId]);
                                let [result6] = await connection.query(sql);
                            }
                        }
                        //actualizamos el contrato original para poner el id del contrato de intereses
                        sql = " UPDATE contratos SET contratoInteresesId = ? WHERE contratoId = ? ";
                        sql = mysql2.format(sql, [newContratoId, contratoId]);
                        let [result4] = await connection.query(sql);
                        await connection.commit();
                        await connection.end();
                    }
                });
            }
            resolve(newContratoId)

        } catch (e) {
            if (connection) {
                await connection.rollback();
                await connection.end();
            }
            reject(e)
        }

    });
}

////NUEVO METODO

module.exports.deletePrefacturasContratoGeneradasPlanificacionTemp =
    function (con, contratoId, contPlanificacionTempId, callback) {

        var sql = "SELECT * FROM contrato_planificacion_temporal WHERE contPlanificacionTempId = ?";
        sql = mysql.format(sql, [contPlanificacionTempId]);

        con.query(sql, function (err, result) {
            if (err) return callback(err);

            if (result.length > 0 && result[0].contPlanificacionTempIntId > 0) {

                var contPlanificacionTempIntId = result[0].contPlanificacionTempIntId;

                var sql = `
                DELETE ci
                FROM contrato_planificacion_temporal ci
                WHERE ci.contPlanificacionTempId = ?
                `;
                sql = mysql.format(sql, [contPlanificacionTempIntId]);

                con.query(sql, function (err, result) {
                    if (err) return callback(err);

                    eliminarPrefacturas(con, contPlanificacionTempIntId, contPlanificacionTempId);

                });

            } else {
                eliminarPrefacturas(con, contPlanificacionTempId, contPlanificacionTempId);
            }
        });

        function eliminarPrefacturas(con, contPlanificacionTempIntId, contPlanificacionTempId) {
            var sql = `
            DELETE FROM prefacturas_temporal
            WHERE generada = 1
            AND (contPlanificacionTempId = ? OR contPlanificacionTempId = ?)
        `;
            sql = mysql.format(sql, [contPlanificacionTempIntId, contPlanificacionTempId]);

            con.query(sql, function (err, result2) {
                if (err) return callback(err);
                callback(null);
            });
        }
    };


module.exports.postExportarPlanificacionTempIntereses =
    function (con, data, contratoInteresesId, totalIntereses) {

        return new Promise(async (resolve, reject) => {
            try {
                let sql = "";
                let newPlanificacionId = 0;

                if (data && data.length > 0) {

                    for (let i = 0; i < data.length; i++) {

                        let planificacion = Object.assign({}, data[i]);

                        let antId = planificacion.contPlanificacionTempId;
                        planificacion.contPlanificacionTempId


                        delete planificacion.formaPagoNombre;
                        delete planificacion.esLetra;

                        // Nueva línea de intereses
                        planificacion.contPlanificacionTempId = 0;
                        planificacion.contratoId = contratoInteresesId;
                        planificacion.importeIntereses = 0;
                        planificacion.porcentaje =
                            planificacion.importe > 0
                                ? (planificacion.importe * 100) / totalIntereses
                                : 0;
                        planificacion.contPlanificacionTempIntId = null;

                        sql = "INSERT INTO contrato_planificacion_temporal SET ?";
                        sql = mysql.format(sql, planificacion);

                        let result = await new Promise((res, rej) => {
                            con.query(sql, function (err, r) {
                                if (err) return rej(err);
                                res(r);
                            });
                        });

                        newPlanificacionId = result.insertId;

                        // Actualizamos la planificación principal
                        sql = `
                        UPDATE contrato_planificacion_temporal
                        SET contPlanificacionTempIntId = ?
                        WHERE contPlanificacionTempId = ?
                    `;
                        sql = mysql.format(sql, [
                            newPlanificacionId,
                            antId
                        ]);

                        await new Promise((res, rej) => {
                            con.query(sql, function (err) {
                                if (err) return rej(err);
                                res();
                            });
                        });
                    }
                }

                resolve(newPlanificacionId);

            } catch (e) {
                reject(e);
            }
        });
    };


module.exports.postGenerarPrefacturasTemporales = function (
    contratoId,
    contratoInteresesId,
    totalIntereses,
    prefacturas,
    prefacturasIntereses,
    done
) {

    if (!prefacturasIntereses || prefacturasIntereses.length === 0) {
        cm.getConnectionCallbackTransaction(function (err, con) {
            if (err) return done(err);
            generarPrefacturas(con);
        });
    } else {
        cm.getConnectionCallbackTransaction(function (err, con) {
            if (err) return done(err);

            if (!prefacturas || prefacturas.length === 0) {
                return con.rollback(function () {
                    done(new Error('No hay prefacturas para generar'));
                });
            }

            var contPlanificacionTempId = prefacturas[0].contPlanificacionTempId;
            var importe = prefacturasIntereses.reduce((sum, p) => sum + (p.importe || 0), 0);

            // 1️⃣ ELIMINAMOS PREFRACTURAS PREVIAS
            module.exports.deletePrefacturasContratoGeneradasPlanificacionTemp(
                con,
                contratoId,
                contPlanificacionTempId,
                function (err) {
                    if (err) return rollback(con, err);

                    // 2️⃣ PREPARAMOS DATOS PARA EXPORTACIÓN DE INTERESES
                    if (prefacturasIntereses && prefacturasIntereses.length > 0) {
                        prepararDatosExportacion(con, contratoId, importe, contPlanificacionTempId, function (err, datos) {
                            if (err) return rollback(con, err);

                            // EXPORTAMOS PLANIFICACIÓN INTERESES
                            module.exports.postExportarPlanificacionTempIntereses(
                                con,
                                datos,
                                contratoInteresesId, // contratoInteresesId
                                totalIntereses   // totalIntereses
                            ).then(function (newPlanificacionId) {
                                prefacturasIntereses.forEach(function (pref) {
                                    pref.contPlanificacionTempId = newPlanificacionId;
                                });
                                generarPrefacturas(con);
                            }).catch(function (err) {
                                rollback(con, err);
                            });
                        });
                    } else {
                        // No hay intereses, vamos directamente a generar prefacturas
                        generarPrefacturas(con);
                    }
                }
            );
        });
    }


    // =========================================================
    // ================== GENERACIÓN DE PREFRACTURAS ==========
    // =========================================================

    function generarPrefacturas(con) {
        if (prefacturasIntereses && prefacturasIntereses.length > 0) {
            if (prefacturas.length !== prefacturasIntereses.length) {
                return rollback(con, new Error(
                    'El número de prefacturas de intereses no coincide con el número de prefacturas normales'
                ));
            }

            module.exports.getContrato(contratoId, function (err, contratos) {
                if (err) return rollback(con, err);

                var contrato = contratos[0];

                module.exports.getContrato(
                    contrato.contratoInteresesId,
                    function (err, contratosIntereses) {
                        if (err) return rollback(con, err);

                        var contratoIntereses = contratosIntereses[0];

                        async.eachOfSeries(
                            prefacturas,
                            function (prefactura, index, callback) {
                                generarUnaPrefacturaTemporal(
                                    contrato,
                                    prefactura,
                                    con,
                                    function (err, prefacturaTempId) {
                                        if (err) return callback(err);

                                        generarUnaPrefacturaTemporal(
                                            contratoIntereses,
                                            prefacturasIntereses[index],
                                            con,
                                            function (err, prefacturaInteresesTempId) {
                                                if (err) return callback(err);

                                                var sql = `
                                                    UPDATE prefacturas_temporal
                                                    SET prefacturaInteresesTempId = ?
                                                    WHERE prefacturaTempId = ?
                                                `;
                                                sql = mysql.format(sql, [
                                                    prefacturaInteresesTempId,
                                                    prefacturaTempId
                                                ]);

                                                con.query(sql, callback);
                                            }
                                        );
                                    }
                                );
                            },
                            function (err) {
                                if (err) return rollback(con, err);
                                con.commit(function (err) {
                                    if (err) return rollback(con, err);
                                    done(null, 'OK');
                                    /*  if (prefacturas.length > 1 && !contrato.mantenedorId && contrato.tipoContratoId == 8) {
                                         //comprobamos si hay descuadre
                                         cm.getConnectionCallback(function (err, con) {
                                             if (err) return done(err);
                                             var sql = "SELECT SUM(totalConIva) AS totalConIvaPrefacturas FROM prefacturas_temporal WHERE contratoId = " + contrato.contratoId;
                                             con.query(sql, function (err, data) {
                                                 cm.closeConnection(con);
                                                 if (err) return done(err);
                                                 var descuadre = contrato.totalConIva - data[0].totalConIvaPrefacturas
                                                 if (descuadre != 0) {
                                                     descuadre = descuadre.toFixed(4);
                                                     cuadraUltimaPrefacturaContratoTemporal(contrato, prefacturas[0].contPlanificacionTempId, descuadre, function (err, result) {
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
                                     }; */
                                });
                            }
                        );
                    }
                );
            });
        } else {
            // Solo prefacturas normales
            module.exports.getContrato(contratoId, function (err, contratos) {
                if (err) return rollback(con, err);

                var contrato = contratos[0];

                async.eachSeries(
                    prefacturas,
                    function (prefactura, callback) {
                        generarUnaPrefacturaTemporal(
                            contrato,
                            prefactura,
                            con,
                            callback
                        );
                    },
                    function (err) {
                        if (err) return rollback(con, err);
                        con.commit(function (err) {
                            if (err) return rollback(con, err);
                            done(null, 'OK');
                            /* if (prefacturas.length > 1 && contrato.tipoContratoId == 8) {
                                //comprobamos si hay descuadre
                                cm.getConnectionCallback(function (err, con) {
                                    if (err) return done(err);
                                    var sql = "SELECT SUM(totalConIva) AS totalConIvaPrefacturas FROM prefacturas_temporal WHERE contratoId = " + contrato.contratoId;
                                    con.query(sql, function (err, data) {
                                        cm.closeConnection(con);
                                        if (err) return done(err);
                                        var descuadre = contrato.totalConIva - data[0].totalConIvaPrefacturas
                                        if (descuadre != 0) {
                                            descuadre = descuadre.toFixed(4);
                                            cuadraUltimaPrefacturaContratoTemporal(contrato, prefacturas[0].contPlanificacionTempId, descuadre, function (err, result) {
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
                            }; */
                        });
                    }

                );
            });
        }
    }

    // =========================================================
    // ================== ROLLBACK ============================
    // =========================================================

    function rollback(con, err) {
        con.rollback(function () {
            done(err);
        });
    }

    // =========================================================
    // ====== FUNCION AUXILIAR: PREPARAR DATOS EXPORT =========
    // =========================================================

    function prepararDatosExportacion(con, contratoId, importe, contPlanificacionTempId, callback) {

        var sql = `
            SELECT *
            FROM contrato_planificacion_temporal
            WHERE contPlanificacionTempId = ?
            LIMIT 1
        `;
        sql = mysql.format(sql, [contPlanificacionTempId]);

        con.query(sql, function (err, results) {
            if (err) return callback(err);
            if (!results || results.length === 0) {
                return callback(new Error('No se encontró el registro de contrato_planificacion_temporal'));
            }

            var registro = results[0];

            var datos = [{
                contPlanificacionTempId: registro.contPlanificacionTempId,
                contratoId: contratoId,
                concepto: registro.concepto + ' INTERESES',
                porcentaje: 0,
                porRetenGarantias: 0,
                fecha: new Date(),
                importe: importe || 0,
                importePrefacturado: 0,
                importeFacturado: 0,
                importeFacturadoIva: 0,
                importeCobrado: 0,
                formaPagoId: registro.formaPagoId,
                esAdicional: registro.esAdicional,
                contratoAdicionalId: registro.contratoAdicionalId,
                refPresupuestoAdicional: registro.refPresupuestoAdicional,
                importeIntereses: 0,
                contPlanificacionTempIntId: 0,
                externa: registro.externa
            }];

            callback(null, datos);
        });
    }
};


var generarUnaPrefacturaTemporal = function (contrato, prefactura, con, done) {
    // Generar y dar de alta la cabecera de prefactura
    generarUnaCabeceraPrefacturaTemporal(contrato, prefactura, con, function (err, prefacturaDb) {
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
                    var lineaPrefacturaDb = obtenerObjetoDbLineaPrefacturaTemporal(prefacturaDb.prefacturaTempId, lineaContrato, contrato, prefactura, divisor);
                    var sql = "INSERT INTO prefacturas_lineas_temporal SET ?";
                    sql = mysql.format(sql, lineaPrefacturaDb);
                    con.query(sql, function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                }, function (err) {
                    // Generar las bases de prefactura
                    if (err) return done(err);
                    fnActualizarBasesPrefacturasTemporal(prefacturaDb.prefacturaTempId, con, function (err) {
                        if (err) return done(err);
                        if (prefacturaDb.contPlanificacionTempId) {
                            //si se trata de planificación actulizamos el importe prefacturado en la tabla contrato_planificacion
                            fnActualizarPrefacturadoPlanificacionTemporal(prefacturaDb.contPlanificacionTempId, prefacturaDb.totalAlCliente, con, function (err) {
                                if (err) return done(err);
                                done(null, prefacturaDb.prefacturaTempId)
                            });
                        } else {
                            done(null, prefacturaDb.prefacturaTempId);
                        }
                    })
                });
        });
    });
};

var generarUnaCabeceraPrefacturaTemporal = function (contrato, prefactura, con, done) {
    // Primero hay que obtener los datos de empresa y cliente
    var empresa = null;
    var cliente = null;
    empresaDb.getEmpresa(contrato.empresaId, function (err, data) {
        if (err) return done(err);
        empresa = data;
        clienteDb.getCliente(prefactura.clienteId, function (err, data) {
            if (err) return done(err);
            cliente = data;
            var prefacturaDb = obtenerObjetoDbCabeceraPrefacturaTemporal(empresa, cliente, contrato, prefactura, con, function (err, prefacturaDb) {
                if (err) return done(err);
                var sql = "INSERT INTO prefacturas_temporal SET ?";
                sql = mysql.format(sql, prefacturaDb);
                con.query(sql, function (err, data) {
                    if (err) return done(err);
                    prefacturaDb.prefacturaTempId = data.insertId;
                    done(null, prefacturaDb);
                });
            })
        })
    })
}



var obtenerObjetoDbCabeceraPrefacturaTemporal = function (empresa, cliente, contrato, prefactura, con, done) {
    var prefacturaDb = {
        prefacturaTempId: 0,
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
        receptorNombre: cliente.nombreComercial,
        receptorDireccion: cliente.direccion,
        receptorCodPostal: cliente.codPostal,
        receptorPoblacion: cliente.poblacion,
        receptorProvincia: cliente.provincia,
        total: prefactura.importe,
        formaPagoId: contrato.formaPagoId,
        totalAlCliente: prefactura.importeCliente,
        retenGarantias: prefactura.retenGarantias,
        coste: prefactura.importeCoste,
        generada: 1,
        porcentajeBeneficio: prefactura.porcentajeBeneficio,
        porcentajeAgente: prefactura.porcentajeAgente,
        contratoId: contrato.contratoId,
        observaciones: contrato.obsFactura,
        periodo: prefactura.periodo,
        porcentajeRetencion: contrato.porcentajeRetencion,
        observacionesPago: prefactura.observacionesPago,
        contratoPorcenId: prefactura.contratoPorcenId,
        contPlanificacionTempId: prefactura.contPlanificacionTempId,
        numLetra: prefactura.numLetra,
        beneficioLineal: contrato.beneficioLineal
    };

    if (prefactura.formaPagoId) prefacturaDb.formaPagoId = prefactura.formaPagoId
    fnGetNumeroPrefacturaTemporal(prefacturaDb, con, function (err, prefactura) {
        if (err) return done(err);
        done(null, prefactura);
    })
}

var fnGetNumeroPrefacturaTemporal = function (prefactura, con, done) {
    var sql = "SELECT * FROM empresas_series";
    sql += " WHERE empresaId = ?";
    sql = mysql.format(sql, prefactura.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(prefactura.fecha).year();
        var serie;
        for (var i = 0; i < res.length; i++) {
            if (res[i].tipoProyectoId) {
                if (prefactura.tipoProyectoId == res[i].tipoProyectoId) {
                    if (res[i].serie_prefactura && res[i].serie_prefactura != '') {
                        serie = res[i].serie_prefactura;
                        break;
                    }
                }
            }
            if (res[i].departamentoId) {
                if (prefactura.departamentoId == res[i].departamentoId) {
                    if (res[i].serie_prefactura && res[i].serie_prefactura != '') {
                        serie = res[i].serie_prefactura;
                        break;
                    }
                }
            }
        }
        if (!serie) return done(new Error('No existe una serie de facturación para esta empresa'));
        sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM prefacturas_temporal";
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


var obtenerObjetoDbLineaPrefacturaTemporal = function (prefacturaId, lineaContrato, contrato, prefactura, divisor) {
    var lineaPrefacturaDb = {};
    if (!contrato.beneficioLineal) {
        lineaPrefacturaDb = {
            prefacturaLineaTempId: 0,
            linea: lineaContrato.linea,
            prefacturaTempId: prefacturaId,
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
    } else {
        lineaPrefacturaDb = {
            prefacturaLineaTempId: 0,
            linea: lineaContrato.linea,
            prefacturaTempId: prefacturaId,
            unidadId: lineaContrato.unidadId,
            articuloId: lineaContrato.articuloId,
            tipoIvaId: lineaContrato.tipoIvaId,
            porcentaje: lineaContrato.porcentaje,
            descripcion: lineaContrato.descripcion,
            cantidad: lineaContrato.cantidad,
            importe: lineaContrato.costeUnidad * divisor,
            totalLinea: lineaContrato.totalLinea * divisor,
            coste: lineaContrato.coste * divisor,
            porcentajeBeneficio: lineaContrato.porcentajeBeneficio,
            importeBeneficioLinea: lineaContrato.importeBeneficioLinea * divisor,
            porcentajeAgente: lineaContrato.porcentajeAgente,
            importeAgenteLinea: lineaContrato.importeAgenteLinea * divisor,
            ventaNetaLinea: lineaContrato.ventaNetaLinea * divisor,
            capituloLinea: lineaContrato.capituloLinea
        }
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


var fnActualizarBasesPrefacturasTemporal = function (id, con, callback) {
    sql = "INSERT INTO prefacturas_bases_temporal (prefacturaTempId, tipoIvaId, porcentaje, base, cuota)";
    sql += " SELECT pl.prefacturaTempId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
    sql += " FROM";
    sql += " (SELECT prefacturaTempId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
    sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
    sql += " FROM prefacturas_lineas_temporal";
    sql += " WHERE prefacturaTempId = ?";
    sql += " GROUP BY tipoIvaId) AS pl";
    sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, result) {
        if (err) return callback(err);
        fnActualizarTotalesPrefacturasTemporal(id, con, function (err) {
            if (err) return callback(err);
            callback();
        });
    });
}

var fnActualizarTotalesPrefacturasTemporal = function (id, con, callback) {
    sql = "UPDATE prefacturas_temporal AS pf,";
    sql += " (SELECT prefacturaTempId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM prefacturas_bases_temporal GROUP BY 1) AS pf2,";
    sql += " (SELECT prefacturaTempId, SUM(coste) AS sc";
    sql += " FROM prefacturas_lineas_temporal GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.importeRetencion = COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0), "
    sql += " pf.totalConIva = pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0),";
    sql += " pf.restoCobrar = (pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0)) - pf.retenGarantias,"
    sql += " pf.coste = pf3.sc";
    sql += " WHERE pf.prefacturaTempId = ?";
    sql += " AND pf2.prefacturaTempId = pf.prefacturaTempId";
    sql += " AND pf3.prefacturaTempId = pf.prefacturaTempId";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, result) {
        if (err) return callback(err);
        callback(null);
    });
}

var fnActualizarPrefacturadoPlanificacionTemporal = function (id, importeCliente, con, callback) {
    var sql = "UPDATE contrato_planificacion_temporal";
    sql += " SET importePrefacturado = importePrefacturado + " + importeCliente;
    sql += " WHERE contPlanificaciontempId = ?"
    sql = mysql.format(sql, id);
    con.query(sql, function (err, result) {
        if (err) return callback(err);
        callback();
        /*  fnActualizarTotalesPrefacturasTemporal(id, con, function (err) {
             if (err) return callback(err);
             callback();
         }); */
    });
}

var fnActualizarTotalesPrefacturasTemporal = function (id, con, callback) {
    sql = "UPDATE prefacturas_temporal AS pf,";
    sql += " (SELECT prefacturaTempId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM prefacturas_bases_temporal GROUP BY 1) AS pf2,";
    sql += " (SELECT prefacturaTempId, SUM(coste) AS sc";
    sql += " FROM prefacturas_lineas_temporal GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.importeRetencion = COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0), "
    sql += " pf.totalConIva = pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0),";
    sql += " pf.restoCobrar = (pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0)) - pf.retenGarantias,"
    sql += " pf.coste = pf3.sc";
    sql += " WHERE pf.prefacturaTempId = ?";
    sql += " AND pf2.prefacturaTempId = pf.prefacturaTempId";
    sql += " AND pf3.prefacturaTempId = pf.prefacturaTempId";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, result) {
        if (err) return callback(err);
        callback(null);
    });
}

module.exports.postImportarRegistrosTemporales = async (planificcion, contratoInteresesId) => {
    let con = null;

    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            con.beginTransaction();
            let result1 = await postImportarPlanificacion(planificcion, con);
            if (result1.length === 0) {
                throw new Error('Error al importar la planificación temporal');
            }

            //creamos el objeto de prefacturas
            for (let r of result1) {
                let registros = await getObjPrefacturas(r, con);


                await new Promise((resolvePref, rejectPref) => {
                    module.exports.postGenerarPrefacturasConIntereses(
                        r.contratoId,
                        contratoInteresesId,
                        registros.prefacturas || [],
                        registros.prefacturasIntereses || [],
                        (err) => {
                            if (err) return rejectPref(err);
                            resolvePref();
                        }
                    );
                });
            }
            //let [result2] = await getObjPrefacturas(result1, con);
            //let [result3] = await getObjPrefacturasIntereses(result2, con);
            await con.commit();
            await con.end();
            resolve(result1);

        } catch (e) {
            if (con && !con.connection?._closing) {
                await con.end();
            }
            reject(e);
        }
    });
}

var postImportarPlanificacion = async (lineas, con) => {

    return new Promise(async (resolve, reject) => {
        try {


            if (lineas.length === 0) {
                resolve([]);
                return;
            }

            // Construimos placeholders para cada fila
            let values = {};
            let nuevaPlanificacion = []


            for (let l of lineas) {
                values = {
                    contPlanificacionId: 0,                      // contPlanificacionId
                    contratoId: l.contratoId,
                    concepto: l.concepto,
                    porcentaje: l.porcentaje,
                    porRetenGarantias: l.porRetenGarantias,
                    fecha: l.fechaReal,
                    importe: l.importe,
                    esAdicional: l.esAdicional,
                    contratoAdicionalId: l.contratoAdicionalId,
                    refPresupuestoAdicional: l.refPresupuestoAdicional,
                    importeIntereses: l.importeIntereses,
                    importePrefacturado: 0,                      // importePrefacturado
                    importeFacturado: 0,                      // importeFacturado
                    importeFacturadoIva: 0,                      // importeFacturadoIva
                    importeCobrado: 0,                      // importeCobrado
                    formaPagoId: l.formaPagoId,
                    contPlanificacionTempId: l.contPlanificacionTempId,
                    contPlanificacionIntId: null,
                }
                let sql = `
                INSERT IGNORE INTO contrato_planificacion SET ?
            `;

                const [result] = await con.query(sql, values);
                if (result.affectedRows > 0) {
                    values.contPlanificacionId = result.insertId;
                    values.contPlanificacionTempId = l.contPlanificacionTempId;
                    if (l.contPlanificacionTempIntId) {
                        //recuperamos la planificacion de intereses
                        let sqlInt = "SELECT * FROM contrato_planificacion_temporal WHERE contPlanificacionTempId = ?";
                        sqlInt = mysql2.format(sqlInt, [l.contPlanificacionTempIntId]);
                        let [planificacionInt] = await con.query(sqlInt);
                        let values2 = {
                            contPlanificacionId: 0,                      // contPlanificacionId
                            contratoId: planificacionInt[0].contratoId,
                            concepto: planificacionInt[0].concepto,
                            porcentaje: planificacionInt[0].porcentaje,
                            porRetenGarantias: planificacionInt[0].porRetenGarantias,
                            fecha: planificacionInt[0].fechaReal,
                            importe: planificacionInt[0].importe,
                            esAdicional: l.esAdicional,
                            contratoAdicionalId: l.contratoAdicionalId,
                            refPresupuestoAdicional: l.refPresupuestoAdicional,
                            importeIntereses: 0,
                            importePrefacturado: 0,                      // importePrefacturado
                            importeFacturado: 0,                      // importeFacturado
                            importeFacturadoIva: 0,                      // importeFacturadoIva
                            importeCobrado: 0,                      // importeCobrado
                            formaPagoId: l.formaPagoId,
                            contPlanificacionTempId: l.contPlanificacionTempIntId,
                            contPlanificacionIntId: null
                        }
                        let sql = `
                             INSERT IGNORE INTO contrato_planificacion SET ?
                        `;
                        const [result] = await con.query(sql, values2);
                        if (result.affectedRows > 0) {
                            sql = `
                                UPDATE contrato_planificacion
                                SET contPlanificacionIntId = ?
                                WHERE contPlanificacionId = ?
                            `;
                            sql = mysql2.format(sql, [result.insertId, values.contPlanificacionId]);
                            await con.query(sql);
                            values.contPlanificacionIntId = result.insertId;
                            values.contPlanificacionTempIntId = l.contPlanificacionTempIntId;
                            nuevaPlanificacion.push(values);
                        } else {
                            nuevaPlanificacion.push(values);
                        }

                    } else {
                        nuevaPlanificacion.push(values);
                    }
                }
            }
            resolve(nuevaPlanificacion);

        } catch (e) {
            resolve([])
        }
    });
}

var getObjPrefacturas = async (l, con) => {

    return new Promise(async (resolve, reject) => {
        try {
            let values = {};
            let nuevasPrefacturas = [];
            let nuevasPrefacturasInt = [];

            let sql = "SELECT * FROM prefacturas_temporal WHERE contPlanificacionTempId = ? AND contratoId = ?";
            sql = mysql2.format(sql, [l.contPlanificacionTempId, l.contratoId]);
            let [prefacturas] = await con.query(sql);

            for (let p of prefacturas) {
                values = {
                    fecha: p.fecha,
                    importe: p.totalAlCliente,
                    importeCliente: p.totalAlCliente,
                    importeCoste: p.coste,
                    retenGarantias: 0,
                    empresaId: p.empresaId,
                    clienteId: p.clienteId,
                    porcentajeBeneficio: p.porcentajeBeneficio,
                    porcentajeAgente: p.porcentajeAgente,
                    empresa: p.emisorNombre,
                    cliente: p.receptorNombre,
                    periodo: p.periodo,
                    contPlanificacionId: l.contPlanificacionId,
                    formaPagoId: p.formaPagoId,
                    numLetra: p.numLetra,
                    prefacturaInteresesTempId: p.prefacturaInteresesTempId
                }
                nuevasPrefacturas.push(values);
            }
            if (l.contPlanificacionTempIntId) {
                sql = "SELECT * FROM prefacturas_temporal WHERE contPlanificacionTempId = ?";
                sql = mysql2.format(sql, [l.contPlanificacionTempIntId]);
                let [prefacturasIntereses] = await con.query(sql);
                for (let pi of prefacturasIntereses) {
                    values = {
                        fecha: pi.fecha,
                        importe: pi.totalAlCliente,
                        importeCliente: pi.totalAlCliente,
                        importeCoste: pi.coste,
                        retenGarantias: 0,
                        empresaId: pi.empresaId,
                        clienteId: pi.clienteId,
                        porcentajeBeneficio: pi.porcentajeBeneficio,
                        porcentajeAgente: pi.porcentajeAgente,
                        empresa: pi.emisorNombre,
                        cliente: pi.receptorNombre,
                        periodo: pi.periodo,
                        contPlanificacionId: l.contPlanificacionTempIntId,
                        formaPagoId: pi.formaPagoId,
                        numLetra: pi.numLetra,
                        prefacturaInteresesTempId: pi.prefacturaInteresesTempId
                    }
                    nuevasPrefacturasInt.push(values);
                    console.log('nuevasPrefacturasInt', nuevasPrefacturasInt);
                }
            }
            let obj = {
                prefacturas: nuevasPrefacturas,
                prefacturasIntereses: nuevasPrefacturasInt
            }


            resolve(obj);

        } catch (e) {
            resolve([])
        }
    });
}



module.exports.postGenerarPrefacturasConIntereses = function (
    contratoId,
    contratoInteresesId,
    prefacturas,
    prefacturasIntereses,
    done
) {
    // Abrimos transacción
    cm.getConnectionCallbackTransaction(function (err, con) {
        if (err) return done(err);

        if (!prefacturas || prefacturas.length === 0) {
            return con.rollback(function () {
                done(new Error('No hay prefacturas para generar'));
            });
        }

        generarPrefacturas(con);
    });

    // =========================================================
    // ================== GENERACIÓN DE PREFRACTURAS ==========
    // =========================================================
    function generarPrefacturas(con) {
        if (prefacturasIntereses && prefacturasIntereses.length > 0) {
            if (prefacturas.length !== prefacturasIntereses.length) {
                return rollback(con, new Error(
                    'El número de prefacturas de intereses no coincide con el número de prefacturas normales'
                ));
            }

            // Obtenemos contratos
            module.exports.getContrato(contratoId, function (err, contratos) {
                if (err) return rollback(con, err);
                const contrato = contratos[0];

                module.exports.getContrato(contratoInteresesId, function (err, contratosIntereses) {
                    if (err) return rollback(con, err);
                    const contratoIntereses = contratosIntereses[0];

                    async.eachOfSeries(prefacturas, function (prefactura, index, callback) {
                        // Generar prefactura normal
                        generarUnaPrefacturaIntereses(contrato, prefactura, con, function (err, prefacturaId) {
                            if (err) return callback(err);

                            // Generar prefactura de intereses
                            generarUnaPrefacturaIntereses(contratoIntereses, prefacturasIntereses[index], con, function (err, prefacturaInteresesId) {
                                if (err) return callback(err);

                                // Vincular prefactura de intereses
                                const sql = `
                                    UPDATE prefacturas
                                    SET prefacturaInteresesId = ?
                                    WHERE prefacturaId = ?
                                `;
                                con.query(mysql.format(sql, [prefacturaInteresesId, prefacturaId]), callback);
                            });
                        });
                    }, function (err) {
                        if (err) return rollback(con, err);
                        con.commit(function (err) {
                            if (err) return rollback(con, err);
                            done(null, 'OK');
                        });
                    });
                });
            });
        } else {
            // Solo prefacturas normales
            module.exports.getContrato(contratoId, function (err, contratos) {
                if (err) return rollback(con, err);
                const contrato = contratos[0];

                async.eachSeries(prefacturas, function (prefactura, callback) {
                    generarUnaPrefacturaIntereses(contrato, prefactura, con, callback);
                }, function (err) {
                    if (err) return rollback(con, err);
                    con.commit(function (err) {
                        if (err) return rollback(con, err);
                        done(null, 'OK');
                    });
                });
            });
        }
    }

    // =========================================================
    // ================== ROLLBACK ============================
    // =========================================================
    function rollback(con, err) {
        con.rollback(function () {
            done(err);
        });
    }
};




////NUEVO METODO DE PREFACTURACIÓN CON INTERESES

module.exports.deletePrefacturasContratoGeneradasPlanificacionIntereses = function (con, contratoId, contPlanificacionId, callback) {

    var sql = "SELECT * FROM contrato_planificacion WHERE contPlanificacionId = ?";
    sql = mysql.format(sql, [contPlanificacionId]);

    con.query(sql, function (err, result) {
        if (err) return callback(err);

        if (result.length > 0 && result[0].contPlanificacionIntId > 0) {

            var contPlanificacionIntId = result[0].contPlanificacionIntId;

            var sql = `
                DELETE ci
                FROM contrato_planificacion ci
                WHERE ci.contPlanificacionId = ?
                `;
            sql = mysql.format(sql, [contPlanificacionIntId]);

            con.query(sql, function (err, result) {
                if (err) return callback(err);

                eliminarPrefacturas(con, contPlanificacionIntId, contPlanificacionId);

            });

        } else {
            eliminarPrefacturas(con, contPlanificacionId, contPlanificacionId);
        }
    });

    function eliminarPrefacturas(con, contPlanificacionIntId, contPlanificacionId) {
        var sql = `
            DELETE FROM prefacturas
            WHERE generada = 1
            AND (contPlanificacionId = ? OR contPlanificacionId = ?)
        `;
        sql = mysql.format(sql, [contPlanificacionIntId, contPlanificacionId]);

        con.query(sql, function (err, result2) {
            if (err) return callback(err);
            callback(null);
        });
    }
};


module.exports.postExportarPlanificacionIntereses = function (con, data, contratoInteresesId, totalIntereses) {

    return new Promise(async (resolve, reject) => {
        try {
            let sql = "";
            let newPlanificacionId = 0;

            if (data && data.length > 0) {

                for (let i = 0; i < data.length; i++) {

                    let planificacion = Object.assign({}, data[i]);

                    let antId = planificacion.contPlanificacionId;
                    planificacion.contPlanificacionId


                    delete planificacion.formaPagoNombre;
                    delete planificacion.esLetra;

                    // Nueva línea de intereses
                    planificacion.contPlanificacionId = 0;
                    planificacion.contratoId = contratoInteresesId;
                    planificacion.importeIntereses = 0;
                    planificacion.porcentaje =
                        planificacion.importe > 0
                            ? (planificacion.importe * 100) / totalIntereses
                            : 0;
                    planificacion.contPlanificacionIntId = null;

                    sql = "INSERT INTO contrato_planificacion SET ?";
                    sql = mysql.format(sql, planificacion);

                    let result = await new Promise((res, rej) => {
                        con.query(sql, function (err, r) {
                            if (err) return rej(err);
                            res(r);
                        });
                    });

                    newPlanificacionId = result.insertId;

                    // Actualizamos la planificación principal
                    sql = `
                        UPDATE contrato_planificacion
                        SET contPlanificacionIntId = ?
                        WHERE contPlanificacionId = ?
                    `;
                    sql = mysql.format(sql, [
                        newPlanificacionId,
                        antId
                    ]);

                    await new Promise((res, rej) => {
                        con.query(sql, function (err) {
                            if (err) return rej(err);
                            res();
                        });
                    });
                }
            }

            resolve(newPlanificacionId);

        } catch (e) {
            reject(e);
        }
    });
};


module.exports.postGenerarPrefacturasIntereses = function (
    contratoId,
    contratoInteresesId,
    totalIntereses,
    prefacturas,
    prefacturasIntereses,
    done
) {

    if (!prefacturasIntereses || prefacturasIntereses.length === 0) {
        cm.getConnectionCallbackTransaction(function (err, con) {
            if (err) return done(err);
            generarPrefacturasIntereses(con);
        });
    } else {
        cm.getConnectionCallbackTransaction(function (err, con) {
            if (err) return done(err);

            if (!prefacturas || prefacturas.length === 0) {
                return con.rollback(function () {
                    done(new Error('No hay prefacturas para generar'));
                });
            }

            var contPlanificacionId = prefacturas[0].contPlanificacionId;
            var importe = prefacturasIntereses.reduce((sum, p) => sum + (p.importe || 0), 0);

            // 1️⃣ ELIMINAMOS PREFRACTURAS PREVIAS
            module.exports.deletePrefacturasContratoGeneradasPlanificacionIntereses(
                con,
                contratoId,
                contPlanificacionId,
                function (err) {
                    if (err) return rollback(con, err);

                    // 2️⃣ PREPARAMOS DATOS PARA EXPORTACIÓN DE INTERESES
                    if (prefacturasIntereses && prefacturasIntereses.length > 0) {
                        prepararDatosExportacionIntereses(con, contratoId, importe, contPlanificacionId, function (err, datos) {
                            if (err) return rollback(con, err);

                            // EXPORTAMOS PLANIFICACIÓN INTERESES
                            module.exports.postExportarPlanificacionIntereses(
                                con,
                                datos,
                                contratoInteresesId, // contratoInteresesId
                                totalIntereses   // totalIntereses
                            ).then(function (newPlanificacionId) {
                                prefacturasIntereses.forEach(function (pref) {
                                    pref.contPlanificacionId = newPlanificacionId;
                                });
                                generarPrefacturasIntereses(con);
                            }).catch(function (err) {
                                rollback(con, err);
                            });
                        });
                    } else {
                        // No hay intereses, vamos directamente a generar prefacturas
                        generarPrefacturasIntereses(con);
                    }
                }
            );
        });
    }


    // =========================================================
    // ================== GENERACIÓN DE PREFRACTURAS ==========
    // =========================================================

    function generarPrefacturasIntereses(con) {
        if (prefacturasIntereses && prefacturasIntereses.length > 0) {
            if (prefacturas.length !== prefacturasIntereses.length) {
                return rollback(con, new Error(
                    'El número de prefacturas de intereses no coincide con el número de prefacturas normales'
                ));
            }

            module.exports.getContrato(contratoId, function (err, contratos) {
                if (err) return rollback(con, err);

                var contrato = contratos[0];

                module.exports.getContrato(
                    contrato.contratoInteresesId,
                    function (err, contratosIntereses) {
                        if (err) return rollback(con, err);

                        var contratoIntereses = contratosIntereses[0];

                        async.eachOfSeries(
                            prefacturas,
                            function (prefactura, index, callback) {
                                generarUnaPrefacturaIntereses(
                                    contrato,
                                    prefactura,
                                    con,
                                    function (err, prefacturaId) {
                                        if (err) return callback(err);

                                        generarUnaPrefacturaIntereses(
                                            contratoIntereses,
                                            prefacturasIntereses[index],
                                            con,
                                            function (err, prefacturaInteresesId) {
                                                if (err) return callback(err);

                                                var sql = `
                                                    UPDATE prefacturas
                                                    SET prefacturaInteresesId = ?
                                                    WHERE prefacturaId = ?
                                                `;
                                                sql = mysql.format(sql, [
                                                    prefacturaInteresesId,
                                                    prefacturaId
                                                ]);

                                                con.query(sql, callback);
                                            }
                                        );
                                    }
                                );
                            },
                            function (err) {
                                if (err) return rollback(con, err);
                                con.commit(function (err) {
                                    if (err) return rollback(con, err);
                                    done(null, 'OK');
                                });
                            }
                        );
                    }
                );
            });
        } else {
            // Solo prefacturas normales
            module.exports.getContrato(contratoId, function (err, contratos) {
                if (err) return rollback(con, err);

                var contrato = contratos[0];

                async.eachSeries(
                    prefacturas,
                    function (prefactura, callback) {
                        generarUnaPrefacturaIntereses(
                            contrato,
                            prefactura,
                            con,
                            callback
                        );
                    },
                    function (err) {
                        if (err) return rollback(con, err);
                        con.commit(function (err) {
                            if (err) return rollback(con, err);
                            done(null, 'OK');
                        });
                    }
                );
            });
        }
    }

    // =========================================================
    // ================== ROLLBACK ============================
    // =========================================================

    function rollback(con, err) {
        con.rollback(function () {
            done(err);
        });
    }

    // =========================================================
    // ====== FUNCION AUXILIAR: PREPARAR DATOS EXPORT =========
    // =========================================================

    function prepararDatosExportacionIntereses(con, contratoId, importe, contPlanificacionId, callback) {

        var sql = `
            SELECT *
            FROM contrato_planificacion
            WHERE contPlanificacionId = ?
            LIMIT 1
        `;
        sql = mysql.format(sql, [contPlanificacionId]);

        con.query(sql, function (err, results) {
            if (err) return callback(err);
            if (!results || results.length === 0) {
                return callback(new Error('No se encontró el registro de contrato_planificacion'));
            }

            var registro = results[0];

            var datos = [{
                contPlanificacionId: registro.contPlanificacionId,
                contratoId: contratoId,
                concepto: registro.concepto + ' INTERESES',
                porcentaje: 0,
                porRetenGarantias: 0,
                fecha: new Date(),
                importe: importe || 0,
                importePrefacturado: 0,
                importeFacturado: 0,
                importeFacturadoIva: 0,
                importeCobrado: 0,
                formaPagoId: registro.formaPagoId,
                //esAdicional: registro.esAdicional,
                //contratoAdicionalId: registro.contratoAdicionalId,
                //refPresupuestoAdicional: registro.refPresupuestoAdicional,
                importeIntereses: 0,
                contPlanificacionIntId: 0,
                //externa: registro.externa
            }];

            callback(null, datos);
        });
    }
};


var generarUnaPrefacturaIntereses = function (contrato, prefactura, con, done) {
    // Generar y dar de alta la cabecera de prefactura
    generarUnaCabeceraPrefacturaIntereses(contrato, prefactura, con, function (err, prefacturaDb) {
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
                    var lineaPrefacturaDb = obtenerObjetoDbLineaPrefacturaIntereses(prefacturaDb.prefacturaId, lineaContrato, contrato, prefactura, divisor);
                    var sql = "INSERT INTO prefacturas_lineas SET ?";
                    sql = mysql.format(sql, lineaPrefacturaDb);
                    con.query(sql, function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                }, function (err) {
                    // Generar las bases de prefactura
                    if (err) return done(err);
                    fnActualizarBasesPrefacturasIntereses(prefacturaDb.prefacturaId, con, function (err) {
                        if (err) return done(err);
                        if (prefacturaDb.contPlanificacionId) {
                            //si se trata de planificación actulizamos el importe prefacturado en la tabla contrato_planificacion
                            fnActualizarPrefacturadoPlanificacionIntereses(prefacturaDb.contPlanificacionId, prefacturaDb.totalAlCliente, con, function (err) {
                                if (err) return done(err);
                                done(null, prefacturaDb.prefacturaId)
                            });
                        } else {
                            done(null, prefacturaDb.prefacturaId);
                        }
                    })
                });
        });
    });
};

var generarUnaCabeceraPrefacturaIntereses = function (contrato, prefactura, con, done) {
    // Primero hay que obtener los datos de empresa y cliente
    var empresa = null;
    var cliente = null;
    empresaDb.getEmpresa(contrato.empresaId, function (err, data) {
        if (err) return done(err);
        empresa = data;
        //if(!prefactura.clienteId) prefactura.clienteId = contrato.clienteId;
        clienteDb.getCliente(prefactura.clienteId, function (err, data) {
            if (err) return done(err);
            cliente = data;
            obtenerObjetoDbCabeceraPrefacturaIntereses(empresa, cliente, contrato, prefactura, con, function (err, prefacturaDb) {
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



var obtenerObjetoDbCabeceraPrefacturaIntereses = function (empresa, cliente, contrato, prefactura, con, done) {
    var prefacturaDb = {
        prefacturaId: 0,
        tipoProyectoId: contrato.tipoProyectoId,
        departamentoId: contrato.tipoContratoId,
        fecha: prefactura.fecha,
        empresaId: empresa.empresaId,
        clienteId: cliente.clienteId,
        emisorNif: empresa.nif,
        emisorNombre: empresa.nombre,
        emisorDireccion: empresa.direccion,
        emisorCodPostal: empresa.codPostal,
        emisorPoblacion: empresa.poblacion,
        emisorProvincia: empresa.provincia,
        receptorNif: cliente.nif,
        receptorNombre: cliente.nombreComercial,
        receptorDireccion: cliente.direccion,
        receptorCodPostal: cliente.codPostal,
        receptorPoblacion: cliente.poblacion,
        receptorProvincia: cliente.provincia,
        total: prefactura.importe,
        formaPagoId: contrato.formaPagoId,
        totalAlCliente: prefactura.importeCliente,
        retenGarantias: prefactura.retenGarantias,
        coste: prefactura.importeCoste,
        generada: 1,
        porcentajeBeneficio: prefactura.porcentajeBeneficio,
        porcentajeAgente: prefactura.porcentajeAgente,
        contratoId: contrato.contratoId,
        observaciones: contrato.obsFactura,
        periodo: prefactura.periodo,
        porcentajeRetencion: contrato.porcentajeRetencion,
        observacionesPago: prefactura.observacionesPago,
        contratoPorcenId: prefactura.contratoPorcenId,
        contPlanificacionId: prefactura.contPlanificacionId,
        numLetra: prefactura.numLetra,
        beneficioLineal: contrato.beneficioLineal
    };

    if (prefactura.formaPagoId) prefacturaDb.formaPagoId = prefactura.formaPagoId
    fnGetNumeroPrefacturaIntereses(prefacturaDb, con, function (err, prefactura) {
        if (err) return done(err);
        done(null, prefactura);
    })
}

var fnGetNumeroPrefacturaIntereses = function (prefactura, con, done) {
    var sql = "SELECT * FROM empresas_series";
    sql += " WHERE empresaId = ?";
    sql = mysql.format(sql, prefactura.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(prefactura.fecha).year();
        var serie;
        for (var i = 0; i < res.length; i++) {
            if (res[i].tipoProyectoId) {
                if (prefactura.tipoProyectoId == res[i].tipoProyectoId) {
                    if (res[i].serie_prefactura && res[i].serie_prefactura != '') {
                        serie = res[i].serie_prefactura;
                        break;
                    }
                }
            }
            if (res[i].departamentoId) {
                if (prefactura.departamentoId == res[i].departamentoId) {
                    if (res[i].serie_prefactura && res[i].serie_prefactura != '') {
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


var obtenerObjetoDbLineaPrefacturaIntereses = function (prefacturaId, lineaContrato, contrato, prefactura, divisor) {
    var lineaPrefacturaDb = {};
    if (!contrato.beneficioLineal) {
        lineaPrefacturaDb = {
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
    } else {
        lineaPrefacturaDb = {
            prefacturaLineaId: 0,
            linea: lineaContrato.linea,
            prefacturaId: prefacturaId,
            unidadId: lineaContrato.unidadId,
            articuloId: lineaContrato.articuloId,
            tipoIvaId: lineaContrato.tipoIvaId,
            porcentaje: lineaContrato.porcentaje,
            descripcion: lineaContrato.descripcion,
            cantidad: lineaContrato.cantidad,
            importe: lineaContrato.costeUnidad * divisor,
            totalLinea: lineaContrato.totalLinea * divisor,
            coste: lineaContrato.coste * divisor,
            porcentajeBeneficio: lineaContrato.porcentajeBeneficio,
            importeBeneficioLinea: lineaContrato.importeBeneficioLinea * divisor,
            porcentajeAgente: lineaContrato.porcentajeAgente,
            importeAgenteLinea: lineaContrato.importeAgenteLinea * divisor,
            ventaNetaLinea: lineaContrato.ventaNetaLinea * divisor,
            capituloLinea: lineaContrato.capituloLinea
        }
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


var fnActualizarBasesPrefacturasIntereses = function (id, con, callback) {
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
        fnActualizarTotalesPrefacturasIntereses(id, con, function (err) {
            if (err) return callback(err);
            callback();
        });
    });
}

var fnActualizarTotalesPrefacturasIntereses = function (id, con, callback) {
    sql = "UPDATE prefacturas AS pf,";
    sql += " (SELECT prefacturaId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM prefacturas_bases GROUP BY 1) AS pf2,";
    sql += " (SELECT prefacturaId, SUM(coste) AS sc";
    sql += " FROM prefacturas_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.importeRetencion = COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0), "
    sql += " pf.totalConIva = pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0),";
    sql += " pf.restoCobrar = (pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0)) - pf.retenGarantias,"
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

var fnActualizarPrefacturadoPlanificacionIntereses = function (id, importeCliente, con, callback) {
    var sql = "UPDATE contrato_planificacion";
    sql += " SET importePrefacturado = importePrefacturado + " + importeCliente;
    sql += " WHERE contPlanificacionId = ?"
    sql = mysql.format(sql, id);
    con.query(sql, function (err, result) {
        if (err) return callback(err);
        fnActualizarTotalesPrefacturasIntereses(id, con, function (err) {
            if (err) return callback(err);
            callback();
        });
    });
}

var fnActualizarTotalesPrefacturasIntereses = function (id, con, callback) {
    sql = "UPDATE prefacturas AS pf,";
    sql += " (SELECT prefacturaId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM prefacturas_bases GROUP BY 1) AS pf2,";
    sql += " (SELECT prefacturaId, SUM(coste) AS sc";
    sql += " FROM prefacturas_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.importeRetencion = COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0), "
    sql += " pf.totalConIva = pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0),";
    sql += " pf.restoCobrar = (pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0)) - pf.retenGarantias,"
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


// NUEVOS METODOS ASINCRONOS PARA LA EXPORTACIÓN DE PLANIFICACIÓN E INTERESES


// ===============================
// POST IMPORTAR REGISTROS TEMPORALES ASYNC NUEVO
// ===============================
module.exports.importarRegistrosTemporalesAsync = async (planificacion, contratoInteresesId) => {
    let con = null;
    try {
        con = await mysql2.createConnection(obtenerConfiguracion());
        await con.beginTransaction();

        const planificacionResult = await importarPlanificacionAsync(planificacion, con);
        if (!planificacionResult.length) {
            throw new Error('Error al importar la planificación temporal');
        }

        for (const linea of planificacionResult) {
            const registros = await obtenerPrefacturasAsync(linea, con);

            await generarPrefacturasConInteresesAsync(
                con,
                linea.contratoId,
                contratoInteresesId,
                registros.prefacturas || [],
                registros.prefacturasIntereses || []
            );
        }

        await con.commit();
        await con.end();
        return planificacionResult;

    } catch (err) {
        if (con) await con.rollback().catch(() => { });
        if (con) await con.end().catch(() => { });
        throw err;
    }
};

// ===============================
// IMPORTAR PLANIFICACION ASYNC NUEVO
// ===============================
async function importarPlanificacionAsync(lineas, con) {
    if (!lineas.length) return [];

    const nuevaPlanificacion = [];

    for (const l of lineas) {
        const values = {
            contPlanificacionId: 0,
            contratoId: l.contratoId,
            concepto: l.concepto,
            porcentaje: l.porcentaje,
            porRetenGarantias: l.porRetenGarantias,
            fecha: l.fechaReal,
            importe: l.importe,
            esAdicional: l.esAdicional,
            contratoAdicionalId: l.contratoAdicionalId,
            refPresupuestoAdicional: l.refPresupuestoAdicional,
            importeIntereses: l.importeIntereses,
            importePrefacturado: 0,
            importeFacturado: 0,
            importeFacturadoIva: 0,
            importeCobrado: 0,
            formaPagoId: l.formaPagoId,
            contPlanificacionTempId: l.contPlanificacionTempId,
            contPlanificacionIntId: null,
        };

        const [result] = await con.query("INSERT IGNORE INTO contrato_planificacion SET ?", values);
        if (result.affectedRows > 0) {
            values.contPlanificacionId = result.insertId;
            values.contPlanificacionTempId = l.contPlanificacionTempId;

            if (l.contPlanificacionTempIntId) {
                const [planificacionInt] = await con.query(
                    "SELECT * FROM contrato_planificacion_temporal WHERE contPlanificacionTempId = ?",
                    [l.contPlanificacionTempIntId]
                );

                if (planificacionInt.length) {
                    const pInt = planificacionInt[0];
                    const values2 = {
                        contPlanificacionId: 0,
                        contratoId: pInt.contratoId,
                        concepto: pInt.concepto,
                        porcentaje: pInt.porcentaje,
                        porRetenGarantias: pInt.porRetenGarantias,
                        fecha: pInt.fechaReal,
                        importe: pInt.importe,
                        esAdicional: l.esAdicional,
                        contratoAdicionalId: l.contratoAdicionalId,
                        refPresupuestoAdicional: l.refPresupuestoAdicional,
                        importeIntereses: 0,
                        importePrefacturado: 0,
                        importeFacturado: 0,
                        importeFacturadoIva: 0,
                        importeCobrado: 0,
                        formaPagoId: l.formaPagoId,
                        contPlanificacionTempId: l.contPlanificacionTempIntId,
                        contPlanificacionIntId: null
                    };

                    const [res2] = await con.query("INSERT IGNORE INTO contrato_planificacion SET ?", values2);
                    if (res2.affectedRows > 0) {
                        await con.query(
                            "UPDATE contrato_planificacion SET contPlanificacionIntId = ? WHERE contPlanificacionId = ?",
                            [res2.insertId, values.contPlanificacionId]
                        );
                        values.contPlanificacionIntId = res2.insertId;
                        values.contPlanificacionTempIntId = l.contPlanificacionTempIntId;

                    }
                }
            }
            nuevaPlanificacion.push(values);
        }
    }
    return nuevaPlanificacion;
}

// ===============================
// OBTENER PREFRACTURAS ASYNC NUEVO
// ===============================
// Función auxiliar para traducir tipo de facturación a meses
// Función auxiliar para calcular diferencia de meses entre dos fechas
function diferenciaMeses(fecha1, fecha2) {
    const f1 = new Date(fecha1);
    const f2 = new Date(fecha2);
    return (f2.getFullYear() - f1.getFullYear()) * 12 + (f2.getMonth() - f1.getMonth());
}

function formatearFechaEspanol(fecha) {
    const d = fecha.getDate().toString().padStart(2, '0');
    const m = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const y = fecha.getFullYear();
    return `${d}/${m}/${y}`;
}


function calcularPeriodo(fechaInicio, intervaloMeses) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + intervaloMeses);
    fin.setDate(fin.getDate() - 1); // restar 1 día para que termine justo antes del siguiente periodo
    return `${formatearFechaEspanol(inicio)}-${formatearFechaEspanol(fin)}`;
}


async function obtenerPrefacturasAsync(linea, con) {
    const prefacturas = [];
    const prefacturasIntereses = [];

    // Primera consulta
    const [prefTemp] = await con.query(
        "SELECT * FROM prefacturas_temporal WHERE contPlanificacionTempId = ? AND contratoId = ? ORDER BY fecha, prefacturaTempId",
        [linea.contPlanificacionTempId, linea.contratoId]
    );

    if (prefTemp.length > 0) {
        const fechaBase = new Date(linea.fecha);

        // Calcular el intervalo en meses entre el primer y segundo registro
        let intervaloMeses = 1; // por defecto mensual
        if (prefTemp.length > 1) {
            intervaloMeses = diferenciaMeses(prefTemp[0].fecha, prefTemp[1].fecha);
            if (intervaloMeses < 1) intervaloMeses = 1; // asegurar mínimo 1 mes
        }

        // Generar fechas y prefacturas
        for (let i = 0; i < prefTemp.length; i++) {
            const p = prefTemp[i];
            const fechaRegistro = new Date(fechaBase);
            fechaRegistro.setMonth(fechaRegistro.getMonth() + i * intervaloMeses);
            const periodo = calcularPeriodo(fechaRegistro, intervaloMeses);

            prefacturas.push({
                fecha: fechaRegistro,
                importe: p.totalAlCliente,
                importeCliente: p.totalAlCliente,
                importeCoste: p.coste,
                retenGarantias: 0,
                empresaId: p.empresaId,
                clienteId: p.clienteId,
                porcentajeBeneficio: p.porcentajeBeneficio,
                porcentajeAgente: p.porcentajeAgente,
                empresa: p.emisorNombre,
                cliente: p.receptorNombre,
                periodo: periodo,
                contPlanificacionId: linea.contPlanificacionId,
                formaPagoId: p.formaPagoId,
                numLetra: p.numLetra,
                prefacturaInteresesTempId: p.prefacturaInteresesTempId
            });
        }

        // Segunda consulta
        if (linea.contPlanificacionTempIntId) {
            const [prefInt] = await con.query(
                "SELECT * FROM prefacturas_temporal WHERE contPlanificacionTempId = ? ORDER BY fecha, prefacturaTempId",
                [linea.contPlanificacionTempIntId]
            );

            if (prefInt.length > 0) {
                // Validación: debe coincidir el número de registros
                if (prefInt.length !== prefTemp.length) {
                    throw new Error(
                        `Error: el número de registros de prefacturasIntereses (${prefInt.length}) no coincide con prefacturas (${prefTemp.length})`
                    );
                }

                // Generar fechas iguales que prefacturas
                for (let i = 0; i < prefInt.length; i++) {
                    const pi = prefInt[i];
                    const fechaRegistro = new Date(fechaBase);
                    fechaRegistro.setMonth(fechaRegistro.getMonth() + i * intervaloMeses);
                    const periodo = calcularPeriodo(fechaRegistro, intervaloMeses);

                    prefacturasIntereses.push({
                        fecha: fechaRegistro,
                        importe: pi.totalAlCliente,
                        importeCliente: pi.totalAlCliente,
                        importeCoste: pi.coste,
                        retenGarantias: 0,
                        empresaId: pi.empresaId,
                        clienteId: pi.clienteId,
                        porcentajeBeneficio: pi.porcentajeBeneficio,
                        porcentajeAgente: pi.porcentajeAgente,
                        empresa: pi.emisorNombre,
                        cliente: pi.receptorNombre,
                        periodo: periodo,
                        contPlanificacionId: linea.contPlanificacionIntId,
                        formaPagoId: pi.formaPagoId,
                        numLetra: pi.numLetra,
                        prefacturaInteresesTempId: pi.prefacturaInteresesTempId
                    });
                }
            }
        }
    }

    return { prefacturas, prefacturasIntereses };
}



// ===============================
// GENERAR PREFRACTURAS CON INTERESES ASYNC NUEVO
// ===============================
async function generarPrefacturasConInteresesAsync(con, contratoId, contratoInteresesId, prefacturas, prefacturasIntereses) {
    if (!prefacturas || !prefacturas.length) {
        throw new Error('No hay prefacturas para generar');
    }

    if (prefacturasIntereses.length && prefacturas.length !== prefacturasIntereses.length) {
        throw new Error('El número de prefacturas de intereses no coincide con el número de prefacturas normales');
    }

    const [contratos] = await con.query("SELECT * FROM contratos WHERE contratoId = ?", [contratoId]);
    const contrato = contratos[0];

    const [contratosInt] = await con.query("SELECT * FROM contratos WHERE contratoId = ?", [contratoInteresesId]);
    const contratoIntereses = contratosInt[0];

    for (let i = 0; i < prefacturas.length; i++) {
        const prefacturaId = await generarUnaPrefacturaAsync(con, contrato, prefacturas[i]);

        if (prefacturasIntereses.length) {
            const prefacturaInteresesId = await generarUnaPrefacturaAsync(con, contratoIntereses, prefacturasIntereses[i]);
            await con.query(
                "UPDATE prefacturas SET prefacturaInteresesId = ? WHERE prefacturaId = ?",
                [prefacturaInteresesId, prefacturaId]
            );
        }
    }
}

// ===============================
// GENERAR UNA PREFRACTURA ASYNC NUEVO
// ===============================
async function generarUnaPrefacturaAsync(con, contrato, prefactura) {
    // 1️⃣ Crear cabecera
    const prefacturaDb = await generarCabeceraPrefacturaAsync(con, contrato, prefactura);

    // 2️⃣ Obtener lineas del contrato
    const [lineasContrato] = await con.query("SELECT * FROM contratos_lineas WHERE contratoId = ?", [contrato.contratoId]);

    const importeContrato = contrato.mantenedorId ? contrato.importeMantenedor : contrato.importeCliente;
    const divisor = prefactura.importe / importeContrato;

    for (const linea of lineasContrato) {
        const lineaDb = generarLineaPrefacturaDb(prefacturaDb.prefacturaId, linea, contrato, prefactura, divisor);
        await con.query("INSERT INTO prefacturas_lineas SET ?", lineaDb);
    }

    // 3️⃣ Actualizar bases y totales
    await actualizarBasesPrefacturaAsync(con, prefacturaDb.prefacturaId);

    if (prefacturaDb.contPlanificacionId) {
        await con.query(
            "UPDATE contrato_planificacion SET importePrefacturado = importePrefacturado + ? WHERE contPlanificacionId = ?",
            [prefacturaDb.totalAlCliente, prefacturaDb.contPlanificacionId]
        );
    }

    return prefacturaDb.prefacturaId;
}

// ===============================
// GENERAR CABECERA PREFRACTURA ASYNC NUEVO
// ===============================
async function generarCabeceraPrefacturaAsync(con, contrato, prefactura) {
    const [empresaRes] = await con.query("SELECT * FROM empresas WHERE empresaId = ?", [contrato.empresaId]);
    const empresa = empresaRes[0];

    const [clienteRes] = await con.query("SELECT * FROM clientes WHERE clienteId = ?", [prefactura.clienteId]);
    const cliente = clienteRes[0];

    const prefacturaDb = {
        prefacturaId: 0,
        tipoProyectoId: contrato.tipoProyectoId,
        departamentoId: contrato.tipoContratoId,
        fecha: prefactura.fecha,
        empresaId: empresa.empresaId,
        clienteId: cliente.clienteId,
        emisorNif: empresa.nif,
        emisorNombre: empresa.nombre,
        emisorDireccion: empresa.direccion,
        emisorCodPostal: empresa.codPostal,
        emisorPoblacion: empresa.poblacion,
        emisorProvincia: empresa.provincia,
        receptorNif: cliente.nif,
        receptorNombre: cliente.nombreComercial,
        receptorDireccion: cliente.direccion,
        receptorCodPostal: cliente.codPostal,
        receptorPoblacion: cliente.poblacion,
        receptorProvincia: cliente.provincia,
        total: prefactura.importe,
        formaPagoId: prefactura.formaPagoId,
        totalAlCliente: prefactura.importeCliente,
        retenGarantias: prefactura.retenGarantias,
        coste: prefactura.importeCoste,
        generada: 1,
        porcentajeBeneficio: prefactura.porcentajeBeneficio,
        porcentajeAgente: prefactura.porcentajeAgente,
        contratoId: contrato.contratoId,
        observaciones: contrato.obsFactura,
        periodo: prefactura.periodo,
        porcentajeRetencion: contrato.porcentajeRetencion,
        observacionesPago: prefactura.observacionesPago,
        contratoPorcenId: prefactura.contratoPorcenId,
        contPlanificacionId: prefactura.contPlanificacionId,
        numLetra: prefactura.numLetra,
        beneficioLineal: contrato.beneficioLineal
    };

    // Generar numero y serie
    const ano = moment(prefactura.fecha).year();
    const [series] = await con.query("SELECT * FROM empresas_series WHERE empresaId = ?", [empresa.empresaId]);
    const serieObj = series.find(s => (s.tipoProyectoId && s.tipoProyectoId === contrato.tipoProyectoId) || (s.departamentoId && s.departamentoId === contrato.tipoContratoId));
    if (!serieObj) throw new Error("No existe serie de facturación para esta empresa");
    const serie = serieObj.serie_prefactura;

    const [res] = await con.query(
        "SELECT COALESCE(MAX(numero)+1,1) AS n FROM prefacturas WHERE empresaId = ? AND ano = ? AND serie = ?",
        [empresa.empresaId, ano, serie]
    );

    prefacturaDb.numero = res[0].n;
    prefacturaDb.ano = ano;
    prefacturaDb.serie = serie;

    const [insertRes] = await con.query("INSERT INTO prefacturas SET ?", prefacturaDb);
    prefacturaDb.prefacturaId = insertRes.insertId;

    return prefacturaDb;
}

// ===============================
// GENERAR LINEA PREFRACTURA DB
// ===============================
function generarLineaPrefacturaDb(prefacturaId, lineaContrato, contrato, prefactura, divisor) {
    if (!contrato.beneficioLineal) {
        return {
            prefacturaLineaId: 0,
            linea: lineaContrato.linea,
            prefacturaId,
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
        };
    } else {
        return {
            prefacturaLineaId: 0,
            linea: lineaContrato.linea,
            prefacturaId,
            unidadId: lineaContrato.unidadId,
            articuloId: lineaContrato.articuloId,
            tipoIvaId: lineaContrato.tipoIvaId,
            porcentaje: lineaContrato.porcentaje,
            descripcion: lineaContrato.descripcion,
            cantidad: lineaContrato.cantidad,
            importe: lineaContrato.costeUnidad * divisor,
            totalLinea: lineaContrato.totalLinea * divisor,
            coste: lineaContrato.coste * divisor,
            porcentajeBeneficio: lineaContrato.porcentajeBeneficio,
            importeBeneficioLinea: lineaContrato.importeBeneficioLinea * divisor,
            porcentajeAgente: lineaContrato.porcentajeAgente,
            importeAgenteLinea: lineaContrato.importeAgenteLinea * divisor,
            ventaNetaLinea: lineaContrato.ventaNetaLinea * divisor,
            capituloLinea: lineaContrato.capituloLinea
        };
    }
}

// ===============================
// ACTUALIZAR BASES Y TOTALES PREFRACTURA
// ===============================
async function actualizarBasesPrefacturaAsync(con, prefacturaId) {
    // Insertar o actualizar las bases de prefactura
    await con.query(`
        INSERT INTO prefacturas_bases (prefacturaId, tipoIvaId, porcentaje, base, cuota)
        SELECT pl.prefacturaId, pl.tipoIvaId, pl.porcentaje,
               SUM(pl.totalLinea) AS base,
               ROUND(SUM(pl.totalLinea) * (pl.porcentaje / 100), 2) AS cuota
        FROM prefacturas_lineas AS pl
        WHERE pl.prefacturaId = ?
        GROUP BY pl.prefacturaId, pl.tipoIvaId, pl.porcentaje
        ON DUPLICATE KEY UPDATE 
            base = VALUES(base), 
            cuota = VALUES(cuota)
    `, [prefacturaId]);

    // Actualizar totales de la prefactura
    await con.query(`
        UPDATE prefacturas AS pf
        JOIN (
            SELECT prefacturaId, SUM(base) AS b, SUM(cuota) AS c
            FROM prefacturas_bases
            GROUP BY prefacturaId
        ) AS pf2 ON pf.prefacturaId = pf2.prefacturaId
        JOIN (
            SELECT prefacturaId, SUM(coste) AS sc
            FROM prefacturas_lineas
            GROUP BY prefacturaId
        ) AS pf3 ON pf.prefacturaId = pf3.prefacturaId
        SET pf.total = pf2.b,
            pf.importeRetencion = COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0),
            pf.totalConIva = pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0),
            pf.restoCobrar = (pf2.b + pf2.c - COALESCE((pf2.b * pf.porcentajeRetencion) / 100, 0)) - pf.retenGarantias,
            pf.coste = pf3.sc
        WHERE pf.prefacturaId = ?
    `, [prefacturaId]);
}


// funciones relacionadas con el ajuste de la ultima prefactura temporal

var cuadraUltimaPrefacturaContratoTemporal = function (contrato, contPlanificacionTempId, descuadre, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return callback(err);
        // Primero hay que obtener laas lineas de la ultima prefactura del contrato
        var sql = "SELECT * FROM prefacturas_lineas_temporal WHERE prefacturaTempId IN ";
        sql += "(SELECT MAX(prefacturaTempId) FROM prefacturas_temporal WHERE contratoId = ? AND contPlanificacionTempId = ? AND contratoPorcenId IS NULL) ORDER BY prefacturaLineaTempId ASC";
        sql = mysql.format(sql, [contrato.contratoId, contPlanificacionTempId]);
        con.query(sql, function (err, lineas) {
            if (err) return callback(err);
            actualizaLineaDescuedreTemporal(lineas[0], descuadre, contrato, contPlanificacionTempId, function (err, result) {
                if (err) return callback(err);
                callback(null, 'OK');
            })
        });
    });
}

var actualizaLineaDescuedreTemporal = function (linea, descuadre, contrato, contPlanificacionTempId, callback) {
    var totalConIva = 0;
    var nuevoCoste = 0;
    var nuevoImporte = 0;
    var nuevoTotal = 0;
    var diferencia = 0;
    if (descuadre) {
        descuadre = parseFloat(descuadre);
        totalConIva = (1 + (linea.porcentaje / 100)) * linea.totalLinea;
        nuevoCoste = ((totalConIva + descuadre) * linea.coste) / totalConIva;
        nuevoImporte = ((totalConIva + descuadre) * linea.importe) / totalConIva;
        nuevoTotal = ((totalConIva + descuadre) * linea.totalLinea) / totalConIva;
    }
    /*if(nuevaBaseLin) {
         totalConIva =  (1 + (linea.porcentaje/100)) * nuevaBaseLin;
         nuevoCoste = ((totalConIva) * linea.coste) / totalConIva;
         nuevoImporte = (totalConIva * linea.importe) / totalConIva;
         nuevoTotal = (totalConIva * linea.totalLinea) / totalConIva;
    }*/
    var lin = {
        prefacturaTempId: linea.prefacturaTempId,
        prefacturaLineaTempId: linea.prefacturaLineaTempId,
        coste: nuevoCoste,
        importe: nuevoImporte,
        linea: linea.linea,
        articuloId: linea.articuloId,
        tipoIvaId: linea.tipoIvaId,
        porcentaje: linea.porcentaje,
        descripcion: linea.descripcion,
        cantidad: linea.cantidad,
        totalLinea: nuevoTotal,
        descuadre: descuadre,
        contPlanificacionTempId: contPlanificacionTempId
    }
    putPrefacturaLineaTemporal(linea.prefacturaLineaTempId, lin, function (err, result) {
        if (err) return callback(err);
        var bucle = false;
        compruebaAjusteTemporal(linea, contrato, function (err, result) {
            if (err) return callback(err);
            callback(null, 'OK');
        });
    });
}

var putPrefacturaLineaTemporal = function (id, prefacturaLinea, callback) {
    if (id != prefacturaLinea.prefacturaLineaTempId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var contPlanificacionTempId = prefacturaLinea.contPlanificacionTempId;
    var diferencia = prefacturaLinea.diferencia;
    delete prefacturaLinea.diferencia;
    delete prefacturaLinea.contPlanificacionTempId;
    delete prefacturaLinea.descuadre;
    var connection = getConnection();
    sql = "UPDATE prefacturas_lineas_temporal SET ? WHERE prefacturaLineaTempId = ?";
    sql = mysql.format(sql, [prefacturaLinea, prefacturaLinea.prefacturaLineaTempId]);
    connection.query(sql, function (err, result) {
        if (err) return callback(err)
        if (result.affectedRows > 0 && contPlanificacionTempId) {
            //recuperamos la linea de planificación para calcular el nuevo porcentaje
            sql = "SELECT * FROM contrato_planificacion_temporal WHERE contPlanificacionTempId = ?";
            sql = mysql.format(sql, contPlanificacionTempId);
            connection.query(sql, function (err, result) {
                if (err) return connection.rollback(function (err2) { callback(err) });
                var planificacion = result[0]
                nuevoImporte = planificacion.importePrefacturado //- (diferencia);
                //calculamos el nuevo porcentaje
                nuevoPorcen = (nuevoImporte * planificacion.porcentaje) / planificacion.importePrefacturado;
                sql = "UPDATE contrato_planificacion_temporal SET importePrefacturado =  ?, importe =  ?, porcentaje = ? ";
                sql += " WHERE contPlanificacionTempId = ?";
                sql = mysql.format(sql, [nuevoImporte, nuevoImporte, nuevoPorcen, contPlanificacionTempId]);
                connection.query(sql, function (err, result) {
                    if (err) return connection.rollback(function (err2) { callback(err) });
                    connection.commit(function (err) {
                        if (err) return connection.rollback(function (err2) { callback(err) });
                        connection.end();
                        // actualizar las bases y cuotas
                        fnActualizarBasesTemporal(prefacturaLinea.prefacturaTempId, function (err, res) {
                            if (err) {
                                return callback(err);
                            }
                            callback(null, prefacturaLinea);
                        })
                    });
                });
            });
        } else {
            connection.end();
            // actualizar las bases y cuotas
            fnActualizarBasesTemporal(prefacturaLinea.prefacturaTempId, function (err, res) {
                if (err) {
                    return callback(err);
                }
                callback(null, prefacturaLinea);
            })
        }
    });
}

var fnActualizarBasesTemporal = function (id, callback) {
    fnBorraBasesTemporal(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        sql = "INSERT INTO prefacturas_bases_temporal (prefacturaTempId, tipoIvaId, porcentaje, base, cuota)";
        sql += " SELECT pl.prefacturaTempId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
        sql += " FROM";
        sql += " (SELECT prefacturaTempId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
        sql += " FROM prefacturas_lineas_temporal";
        sql += " WHERE prefacturaTempId = ?";
        sql += " GROUP BY tipoIvaId) AS pl";
        sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            // Antes de volver actualizamos los totales y así está hecho
            fnActualizarTotalesTemporal(id, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        });
    })
}

var fnBorraBasesTemporal = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM prefacturas_bases_temporal";
    sql += " WHERE prefacturaTempId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

var fnActualizarTotalesTemporal = function (id, callback) {
    var connection = getConnection();
    sql = "UPDATE prefacturas_temporal AS pf,";
    sql += " (SELECT prefacturaTempId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM prefacturas_bases_temporal GROUP BY 1) AS pf2,";
    sql += " (SELECT prefacturaTempId, SUM(coste) AS sc";
    sql += " FROM prefacturas_lineas_temporal GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
    sql += " pf.coste = pf3.sc";
    sql += " WHERE pf.prefacturaTempId = ?";
    sql += " AND pf2.prefacturaTempId = pf.prefacturaTempId";
    sql += " AND pf3.prefacturaTempId = pf.prefacturaTempId";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

var compruebaAjusteTemporal = function (linea, contrato, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT SUM(totalConIva) AS totalConIvaPrefacturas FROM prefacturas_temporal WHERE contratoId = " + contrato.contratoId;
        con.query(sql, function (err, data) {
            cm.closeConnection(con);
            if (err) return done(err);
            var descuadre = contrato.totalConIva - data[0].totalConIvaPrefacturas
            if (descuadre != 0) {
                descuadre = descuadre.toFixed(2);
                descuadre = parseFloat(descuadre);
                cuadraCuotaContratoTemporal(linea, contrato, descuadre, function (err, result) {
                    if (err) return done(err);
                    done(null);
                });
            } else {
                fnActualizarTotalesAjusteTemporal(linea.prefacturaTempId, function (err, result) {
                    if (err) return done(err);
                    done(null);

                });
            }
        });
    });
}

var cuadraCuotaContratoTemporal = function (linea, contrato, descuadre, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return callback(err);
        var sql = "UPDATE prefacturas_bases_temporal";
        sql += " set cuota =";
        sql += " (SELECT tmp.cuota  FROM "
        sql += " (SELECT cuota + " + descuadre + "  AS cuota FROM prefacturas_bases_temporal WHERE";
        sql += " tipoIvaId = " + linea.tipoIvaId;
        sql += " AND prefacturaTempId  = " + linea.prefacturaTempId;
        sql += ") AS tmp)";
        sql += " WHERE tipoIvaId = " + linea.tipoIvaId;
        sql += " AND prefacturaTempId = " + linea.prefacturaTempId;
        con.query(sql, function (err, data) {
            cm.closeConnection(con);
            if (err) return callback(err);
            fnActualizarTotalesAjusteTemporal(linea.prefacturaTempId, function (err, result) {
                if (err) return callback(err);
                callback(null);

            });

            //buscamos las nuevas bases
            /*cm.getConnectionCallback(function (err, con) {
                var sql2 = " SELECT * from prefacturas_bases_temporal";
                sql2 += " WHERE prefacturaTempId = " + linea.prefacturaTempId;
                con.query(sql2, function (err, bases) {
                    cm.closeConnection(con);
                    if(err) return callback(err);
                    var otrasBasesSum = 0;
                    var nuevaBaseSum;
                    var nuevaBaseLin;
                    for(var i = 0; i < bases.length; i++) {
                        if(bases[i].tipoIvaId != linea.tipoIvaId) {
                            otrasBasesSum = otrasBasesSum + bases[i].base;
                        } else {
                            nuevaBaseSum = bases[i].base;
                        }
                    }
                    nuevaBaseLin = nuevaBaseSum - otrasBasesSum
                    actualizaLineaDescuedre(linea, null, contrato, nuevaBaseLin, function(err, result) {
                        if(err) return callback(err);
                        callback(null, result);
                    });
                });
            });*/
        });
    });
}

var fnActualizarTotalesAjusteTemporal = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return callback(err);
        var sql = "UPDATE prefacturas_temporal AS pf,";
        sql += " (SELECT prefacturaTempId, SUM(base) AS b, SUM(cuota) AS c";
        sql += " FROM prefacturas_bases_temporal GROUP BY 1) AS pf2,";
        sql += " (SELECT prefacturaTempId, SUM(coste) AS sc";
        sql += " FROM prefacturas_lineas_temporal GROUP BY 1) AS pf3";
        sql += " SET pf.total = pf2.b, totalAlCliente = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
        sql += " pf.coste = pf3.sc";
        sql += " WHERE pf.prefacturaTempId = ?";
        sql += " AND pf2.prefacturaTempId = pf.prefacturaTempId";
        sql += " AND pf3.prefacturaTempId = pf.prefacturaTempId";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
}
