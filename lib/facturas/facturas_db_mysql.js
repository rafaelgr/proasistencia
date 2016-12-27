// facturas_db_mysql
// Manejo de la tabla facturas en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");

var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var config2 = require("../../config.json");
var fs = require('fs');
var sql = "";

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function (err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function (err) {
        if (err) callback(err);
    });
}

// comprobarFactura
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarFactura(factura) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof factura;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && factura.hasOwnProperty("facturaId"));
    comprobado = (comprobado && factura.hasOwnProperty("empresaId"));
    comprobado = (comprobado && factura.hasOwnProperty("clienteId"));
    comprobado = (comprobado && factura.hasOwnProperty("fecha"));
    return comprobado;
}


// getFacturas
// lee todos los registros de la tabla facturas y
// los devuelve como una lista de objetos
module.exports.getFacturas = function (callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum";
    sql += " , fp.nombre as formaPago"
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        facturas = result;
        callback(null, facturas);
    });
}

// getFacturasContrato
// devuelve todas las facturas asociadas a un contrato.
module.exports.getFacturasContrato = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum";
    sql += " , fp.nombre as formaPago"
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
    sql += " WHERE f.contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        facturas = result;
        callback(null, facturas);
    });
}


// getFactura
// busca  el factura con id pasado
module.exports.getFactura = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum";
    sql += " , fp.nombre as formaPago"
    sql += " FROM facturas as f";
    sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
    sql += " WHERE f.facturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// getPreContaFacturas
// obtiene las facturas no contabilizadas entre las fechas indicadas
module.exports.getPreContaFacturas = function (dFecha, hFecha, callback) {
    var connection = getConnection();
    var facturas = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE facturas SET sel = 1";
    sql += " WHERE fecha >= ? AND fecha <= ?";
    sql += " AND contafich IS NULL";
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum";
        sql += " , fp.nombre as formaPago"
        sql += "  FROM facturas AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql += " AND f.contafich IS NULL";
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            facturas = res;
            callback(null, facturas);
        });
    });
}

// getPreLiquidacionFacturas
// obtiene las facturas no contabilizadas entre las fechas indicadas
module.exports.getPreLiquidacionFacturas = function (dFecha, hFecha, callback) {
    var connection = getConnection();
    var facturas = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "";
    // primero las marcamos por defeto como seleccionadas
    var sql = "UPDATE facturas SET sel = 1";
    sql += " WHERE fecha >= ? AND fecha <= ?";
    sql += " AND contafich IS NULL";
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum ";
        sql += " , fp.nombre as formaPago"
        sql += " FROM facturas AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            facturas = res;
            callback(null, facturas);
        });
    });
}


// postFactura
// crear en la base de datos el factura pasado
module.exports.postFactura = function (factura, callback) {
    if (!comprobarFactura(factura)) {
        var err = new Error("El factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    factura.facturaId = 0; // fuerza el uso de autoincremento
    fnGetNumeroFactura(factura, function (err, res) {
        if (err) return callback(err);
        sql = "INSERT INTO facturas SET ?";
        sql = mysql.format(sql, factura);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            factura.facturaId = result.insertId;
            callback(null, factura);
        });
    })
}

// putFactura
// Modifica el factura según los datos del objeto pasao
module.exports.putFactura = function (id, factura, callback) {
    if (!comprobarFactura(factura)) {
        var err = new Error("El factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != factura.facturaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE facturas SET ? WHERE facturaId = ?";
    sql = mysql.format(sql, [factura, factura.facturaId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, factura);
    });
}

// deleteFactura
// Elimina el factura con el id pasado
module.exports.deleteFactura = function (id, factura, callback) {
    var connection = getConnection();
    sql = "DELETE from facturas WHERE facturaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// deleteFacturasContrato
// Elimina todas las facturas pertenecientes a un contrato.
module.exports.deleteFacturasContrato = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from facturas WHERE contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

/*
|---------------------------------------|
|                                       |
|  LINEAS PREFACTURA                    |
|                                       |
|---------------------------------------|
*/


// comprobarFacturaLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarFacturaLinea(facturaLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof facturaLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && facturaLinea.hasOwnProperty("facturaId"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("facturaLineaId"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("linea"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("porcentaje"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("descripcion"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("cantidad"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("importe"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("totalLinea"));
    return comprobado;
}

// getNextFacturaLine
// busca el siguiente número de línea de la factura pasada
module.exports.getNextFacturaLineas = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT MAX(linea) as maxline FROM facturas_lineas"
    sql += " WHERE facturaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        var maxline = result[0].maxline;
        if (!maxline) {
            return callback(null, 1);
        }
        callback(null, maxline + 1);
    });
}

// getFacturaLineas
// Devuelve todas las líneas de una prefacttura
module.exports.getFacturaLineas = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT * FROM facturas_lineas"
    sql += " WHERE facturaId = ?";
    sql += " ORDER by linea";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// getFacturaLinea
// Devuelve la línea de factura solcitada por su id.
module.exports.getFacturaLinea = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT * FROM facturas_lineas"
    sql += " WHERE facturaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// postFacturaLinea
// crear en la base de datos la linea de factura pasada
module.exports.postFacturaLinea = function (facturaLinea, callback) {
    if (!comprobarFacturaLinea(facturaLinea)) {
        var err = new Error("La linea de factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    facturaLinea.facturaLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO facturas_lineas SET ?";
    sql = mysql.format(sql, facturaLinea);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        facturaLinea.facturaLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBases(facturaLinea.facturaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, facturaLinea);
        })
    });
}

// putFacturaLinea
// Modifica la linea de factura según los datos del objeto pasao
module.exports.putFacturaLinea = function (id, facturaLinea, callback) {
    if (!comprobarFacturaLinea(facturaLinea)) {
        var err = new Error("La linea de factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != facturaLinea.facturaLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE facturas_lineas SET ? WHERE facturaLineaId = ?";
    sql = mysql.format(sql, [facturaLinea, facturaLinea.facturaLineaId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(facturaLinea.facturaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, facturaLinea);
        })
    });
}

// deleteFacturaLinea
// Elimina la linea de factura con el id pasado
module.exports.deleteFacturaLinea = function (id, facturaLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from facturas_lineas WHERE facturaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(facturaLinea.facturaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    });
}

// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la factura pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBases = function (id, callback) {
    fnBorraBases(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
        sql += " SELECT pl.facturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
        sql += " FROM";
        sql += " (SELECT facturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
        sql += " FROM facturas_lineas";
        sql += " WHERE facturaId = ?";
        sql += " GROUP BY tipoIvaId) AS pl";
        sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
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
    var connection = getConnection();
    sql = "UPDATE facturas AS pf,";
    sql += " (SELECT facturaId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM facturas_bases GROUP BY 1) AS pf2";
    sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c";
    sql += " WHERE pf.facturaId = ?"
    sql += " AND pf2.facturaId = pf.facturaId";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// fnBorraBases
// elimina las bases y cuotas de una factura
// antes de actualizarlas
var fnBorraBases = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM facturas_bases";
    sql += " WHERE facturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// getFacturaBases
// devuelve los regitros de bases y cutas de la 
// factura con el id pasado
module.exports.getFacturaBases = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pb.*, ti.nombre as tipo";
    sql += " FROM facturas_bases as pb";
    sql += " LEFT JOIN tipos_iva as ti ON ti.tipoIvaId = pb.tipoIvaId"
    sql += " WHERE facturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// -- Obtener número de factura
// La idea es devolver la factura con los campos ano, numero y serie
var fnGetNumeroFactura = function (factura, done) {
    var con = getConnection();
    // hay que obtener de la empresa la serie
    var sql = "SELECT * FROM empresas where empresaId = ?";
    sql = mysql.format(sql, factura.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(factura.fecha).year();
        var serie = res[0].serieFac;
        fnComprobarOrdenCorrecto(serie, ano, factura.fecha, function (err, res) {
            if (err) return done(err);
            sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM facturas";
            sql += " WHERE empresaId = ?";
            sql += " AND ano = ?";
            sql += " AND serie = ?";
            sql = mysql.format(sql, [factura.empresaId, ano, serie]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                // actualizar los campos del objeto factura
                factura.numero = res[0].n;
                factura.ano = ano;
                factura.serie = serie;
                done(null, factura);
            })
        })
    });
}

var fnGetNumeroFacturaTrans = function (factura, con, done) {
    // hay que obtener de la empresa la serie
    var sql = "SELECT * FROM empresas where empresaId = ?";
    sql = mysql.format(sql, factura.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(factura.fecha).year();
        var serie = res[0].serieFac;
        if (factura.tipoMantenimientoId == 2) {
            serie = res[0].serieFacS;
        }
        fnComprobarOrdenCorrecto(serie, ano, factura.fecha, function (err, res) {
            if (err) return done(err);
            sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM facturas";
            sql += " WHERE empresaId = ?";
            sql += " AND ano = ?";
            sql += " AND serie = ?";
            sql = mysql.format(sql, [factura.empresaId, ano, serie]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                // actualizar los campos del objeto factura
                factura.numero = res[0].n;
                factura.ano = ano;
                factura.serie = serie;
                done(null, factura);
            })
        }, con);
    });
}


// CREACION A PARTIR DE PREFACTURAS
module.exports.postCrearDesdePrefacturas = function (dFecha, hFecha, fechaFactura, clienteId, agenteId, articuloId, tipoMantenimientoId, done) {
    var con = getConnection();
    var sql = "";
    var facturaId = 0;
    var factura = null;
    // Transaccion general que protege todo el proceso
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // obtener las prefacturas que han de pasarse a factura
        sql = "SELECT pf.*, c.comercialId as agenteId, cm.articuloId, cm.tipoMantenimientoId FROM prefacturas as pf";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId"
        sql += " LEFT JOIN contrato_cliente_mantenimiento as cm ON cm.contratoClienteMantenimientoId = pf.contratoClienteMantenimientoId"
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        sql += " AND pf.facturaId IS NULL AND pf.sel = 1";
        if (clienteId != 0) sql += " AND clienteId = " + clienteId;
        if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
        if (articuloId != 0) sql += " AND articuloId = " + articuloId;
        if (tipoMantenimientoId != 0) sql += " AND tipoMantenimientoId = " + tipoMantenimientoId;
        sql += " ORDER BY fecha";
        sql = mysql.format(sql, [dFecha, hFecha]);
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function () { done(err) });
            prefacturas = res;
            async.eachSeries(prefacturas, function (pf, callback2) {
                // transformar un objeto prefactura en uno factura
                pf.facturaId = 0;
                async.series([
                    function (callback) {
                        // obtener el número de factura que le corresponde
                        fnGetNumeroFacturaTrans(pf, con, function (err, res) {
                            if (err) return callback(err);
                            factura = res;
                            callback(null);
                        }, con);
                    },
                    function (callback) {
                        // insertar la cabecera
                        // eliminar las columnas adcionales
                        delete factura.agenteId;
                        delete factura.tipoMantenimientoId;
                        delete factura.articuloId;
                        sql = "INSERT INTO facturas SET ?";
                        sql = mysql.format(sql, factura);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            factura.facturaId = result.insertId;
                            facturaId = result.insertId;
                            callback(null);
                        });
                    },
                    function (callback) {
                        // insertar las líneas
                        sql = "INSERT INTO facturas_lineas(linea, facturaId, articuloId, porcentaje, descripcion, cantidad, importe, totalLinea)";
                        sql += " SELECT linea, " + factura.facturaId + " AS  facturaId, articuloId, porcentaje, descripcion, cantidad, importe, totalLinea";
                        sql += " FROM prefacturas_lineas";
                        sql += " WHERE prefacturas_lineas.prefacturaId = ?";
                        sql = mysql.format(sql, factura.prefacturaId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        // insertar las bases
                        sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
                        sql += " SELECT  " + factura.facturaId + " AS  facturaId, tipoIvaId, porcentaje, base, cuota";
                        sql += " FROM prefacturas_bases";
                        sql += " WHERE prefacturas_bases.prefacturaId = ?";
                        sql = mysql.format(sql, factura.prefacturaId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        // actualizar la prefactura indicando la factura en la que está.
                        sql = "UPDATE prefacturas SET facturaId = ? WHERE prefacturaId = ?";
                        sql = mysql.format(sql, [factura.facturaId, factura.prefacturaId]);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    }
                ], function (err) {
                    if (err) return callback2(err);
                    callback2(null);
                });
            }, function (err) {
                if (err) return con.rollback(function () { done(err) });
                con.commit(function (err) {
                    if (err) return con.rollback(function () { done(err) });
                    done(null);
                })
            })
        });
    });
}

module.exports.postContabilizarFacturas = function (dFecha, hFecha, done) {
    var con = getConnection();
    var sql = "";
    sql = "SELECT f.serie AS serie,";
    sql += " CONCAT(ano, RIGHT(CONCAT('000000',numero),6)) AS factura,";
    sql += " DATE_FORMAT(fecha, '%d/%m/%y') AS fecha,";
    sql += " c.cuentaContable AS cuenta_cli,";
    sql += " fp.codigoContable AS fpago,";
    sql += " 0 AS tipo_operacion,";
    sql += " '' AS cuenta_ret, '' AS imp_ret, '' AS tipo_ret,";
    sql += " 700000001 AS cuenta_ventas,";
    sql += " '' AS centro_coste,";
    sql += " fb.base AS imp_venta, fb.porcentaje AS por_iva, fb.cuota AS imp_iva,";
    sql += " '' AS por_rec, '' AS imp_rec,";
    sql += " f.totalConIva AS total_factura, 0 AS integracion";
    sql += " FROM facturas  AS f";
    sql += " LEFT JOIN facturas_bases AS fb ON fb.facturaId = f.facturaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = c.formaPagoId";
    sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
    sql += " AND f.contafich IS NULL";
    sql += " ORDER BY serie, factura";
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        facturas = res;
        var facs = "serie;factura;fecha;cuenta_cli;fpago;tipo_operacion;";
        facs += "cuenta_ret;imp_ret;tipo_ret;cuenta_ventas;centro_coste;imp_venta;";
        facs += "por_iva;imp_iva;por_rec;imp_rec;total_factura;integracion\r\n";
        var f1 = "%s;%s;%s;%s;%s;%s;";
        var f2 = "%s;%s;%s;%s;%s;%s;";
        var f3 = "%s;%s;%s;%s;%s;%s\r\n";
        facturas.forEach(function (f) {
            // vamos cargando una a una las líneas de facturas;
            facs += sprintf(f1, f.serie, f.factura, f.fecha, f.cuenta_cli, f.fpago, f.tipo_operacion);
            facs += sprintf(f2, f.cuenta_ret, f.imp_ret, f.tipo_ret, f.cuenta_ventas, f.centro_coste, f.imp_venta);
            facs += sprintf(f3, f.por_iva, f.imp_iva, f.por_rec, f.imp_rec, f.total_factura, f.integracion);
        });
        // montamos el nombre del fichero.
        var fichero = moment(dFecha).format('YYYYMMDD') + "_" + moment(hFecha).format('YYYYMMDD') + ".csv";
        var nomfich = config2.conta_dir + "\\" + fichero;
        fs.writeFile(nomfich, facs, function (err) {
            if (err) return done(err);
            // actualizar las facturas como generadas
            sql = "UPDATE facturas as f SET f.contafich = ?"
            sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
            sql += " AND f.contafich IS NULL";
            sql = mysql.format(sql, [fichero, dFecha, hFecha]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                done(null, fichero);
            });
        });
    });
}


// fnComprobarOrderCorrecto:
// es llamada desde obtener numero de factura, porque es en ese momento cuando sabemos
// la serie correspondiente.
var fnComprobarOrdenCorrecto = function (serie, ano, fecha, done, con) {
    var passedConnection = true;
    var con = con;
    if (!con) {
        // si no nos han pasado una conexión la creamos.
        con = getConnection();
        passedConnection = false;
    }
    var sql = "SELECT * FROM facturas";
    sql += " WHERE ano = ? AND serie = ? AND fecha > ?"
    sql = mysql.format(sql, [ano, serie, fecha]);
    con.query(sql, function (err, res) {
        if (!passedConnection) closeConnection(con);
        if (err) return done(err);
        if (res.length == 0) {
            done(null, true);
        } else {
            done(new Error('Ya hay facturas posteriores a ' + moment(fecha).format('DD/MM/YYYY') + ' dadas de alta para la serie ' + serie));
        }
    })
}