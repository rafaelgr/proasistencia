// prefacturas_db_mysql
// Manejo de la tabla prefacturas en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var mysql2 = require('mysql2/promise');
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
var fs = require('fs');
const { CallTracker } = require("assert");
var cobrosDb = require("../cobros/cobros_db_mysql");

//  leer la configurción de MySQL

var sql = "";


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
    connection.connect(function(err) {
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

// comprobarPrefactura
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarPrefactura(prefactura) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof prefactura;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && prefactura.hasOwnProperty("prefacturaId"));
    comprobado = (comprobado && prefactura.hasOwnProperty("empresaId"));
    comprobado = (comprobado && prefactura.hasOwnProperty("clienteId"));
    comprobado = (comprobado && prefactura.hasOwnProperty("fecha"));
    return comprobado;
}


// getPrefacturas
// lee todos los registros de la tabla prefacturas que no estén prefacturadosy
// los devuelve como una lista de objetos
module.exports.getPrefacturas = function (callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.facturaId IS NULL";
    sql += " ORDER BY pf.fecha, f.receptorNombre ASC, pf.numero ASC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturas = result;
        callback(null, prefacturas);
    });
}

module.exports.getPrefacturasContrato = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    var sql = "";
    sql = "UPDATE prefacturas SET sel = 0 WHERE contratoId = ?";
    sql = mysql.format(sql, contratoId);
    //primero marcamos todas las prefacturas del contrato como no seleccionadas
    connection.query(sql, function (err, result) {
        sql = "SELECT pf.*,";
        sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
        sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
        sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo,";
        sql += " IF(pf.facturaId, 0, pf.totalConIva) noFacturado,";
        sql += " IF(pf.facturaId, pf.totalConIva, 0) facturado,";
        sql += " fp.tipoFormaPagoId,"
        sql += " fp.esLetra"
        sql += " FROM prefacturas AS pf";
        sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
        sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
        sql += " WHERE pf.contratoId = ?";
        sql += " ORDER BY pf.fecha, f.receptorNombre ASC, pf.numero ASC";
        sql = mysql.format(sql, contratoId);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err, null);
            }
            result.forEach(function (pf) {
                pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
            });
            prefacturas = result;
            callback(null, prefacturas);
        });

    });
}

module.exports.getPrefacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.contratoId = ?";
    sql += " AND pf.generada = 1"
    sql += " AND pf.contratoPorcenId IS NULL";
    sql += " ORDER BY pf.fecha, f.receptorNombre ASC, pf.numero ASC";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturas = result;
        callback(null, prefacturas);
    });
}

module.exports.getPrefacturasContratoGeneradasPlanificacion = function (contratoId, contPlanificacionId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.contratoId = ?";
    sql += " AND pf.generada = 1"
    sql += " AND pf.contPlanificacionId = ?";
    sql += " ORDER BY pf.fecha, f.receptorNombre ASC, pf.numero ASC";
    sql = mysql.format(sql, [contratoId, contPlanificacionId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturas = result;
        //actulizamos
        callback(null, prefacturas);
    });
}


module.exports.deletePrefacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "DELETE FROM prefacturas";
    sql += " WHERE contratoId = ? AND generada = 1  AND contratoPorcenId IS NULL";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err);
        callback(null);
    });
}

module.exports.deletePrefacturasContratoGeneradasPlanificacion = function (contratoId, contPlanificacionId, importe, callback) {
    var connection = getConnection();
    connection.beginTransaction(function (err) {
        if(err) return callback(err);
        var sql = "DELETE FROM prefacturas";
        sql += " WHERE contratoId = ? AND generada = 1 AND contPlanificacionId =  ?";
        sql = mysql.format(sql, [contratoId, contPlanificacionId]);
        connection.query(sql, function (err, result) {
            if (err) return connection.rollback(function (err2) { callback(err) });
            //actulizamos el importe prefacturado en la tabla contrato_planificacion
            sql = "UPDATE contrato_planificacion SET importePrefacturado = importePrefacturado - ?";
            sql += " WHERE contPlanificacionId = ?"
            sql = mysql.format(sql, [importe, contPlanificacionId]);
            connection.query(sql, function (err, result) {
                if (err) return connection.rollback(function (err2) { callback(err) });
                connection.commit(function (err) {
                    if (err) return connection.rollback(function (err2) { callback(err) });
                    connection.end();
                    callback(null);//todo correcto
                });
            });
        });
    });
}

module.exports.deletePrefacturasContratoSinFacturar = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "DELETE FROM prefacturas";
    sql += " WHERE contratoId = ? AND facturaId IS NULL";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err);
        callback(null);
    });
}

// getPrefacturasAll
// lee todos los registros de la tabla prefacturas y
// los devuelve como una lista de objetos
module.exports.getPrefacturasAll = function (callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " ORDER BY pf.fecha, f.receptorNombre ASC, pf.numero ASC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturas = result;
        callback(null, prefacturas);
    });
}


// getPreEmisionPrefacturas
// obtiene las prefacturas no prefacturadas entre las fechas indicadas
module.exports.getPreEmisionPrefacturas = function (dFecha, hFecha, clienteId, agenteId, tipoMantenimientoId, empresaId, rectificativa, callback) {
    var connection = getConnection();
    var prefacturas = null;
    // primero las marcamos por defeto como prefacturables
    var sql = "UPDATE prefacturas as pf,clientes as c, contratos as cm";
    sql += " SET pf.sel = 1";
    sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
    sql += " AND c.clienteId = pf.clienteId AND cm.contratoId = pf.contratoId";
    if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
    if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
    if (tipoMantenimientoId != 0) sql += " AND cm.tipoContratoId = " + tipoMantenimientoId;
    if (rectificativa == 1) sql += " AND pf.total < 0";
    sql += " AND pf.facturaId IS NULL";
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT pf.*,";
        sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
        sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
        sql += " fp.nombre AS vFPago,";
        sql += " c.comercialId as agenteId, cm.tipoContratoId, com.nombre as agente, cm.direccion as dirTrabajo";
        sql += " FROM prefacturas AS pf";
        sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId";
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
        sql += " LEFT JOIN comerciales as com ON com.comercialId = c.comercialId";
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
        if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
        if (tipoMantenimientoId != 0) sql += " AND cm.tipoContratoId = " + tipoMantenimientoId;
        if (rectificativa == 1) sql += " AND pf.total < 0";
        if (empresaId != 0) sql += " AND pf.empresaId = " + empresaId;
        sql += " AND pf.facturaId IS NULL";
        sql += " ORDER BY pf.fecha, f.receptorNombre ASC, pf.numero ASC";
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            res.forEach(function (pf) {
                pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
            });
            prefacturas = res;
            callback(null, prefacturas);
        });
    });
}



// getPrefactura
// busca  el prefactura con id pasado
module.exports.getPrefactura = function (id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.prefacturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        callback(null, result[0]);
    });
}


// postPrefactura
// crear en la base de datos el prefactura pasado
module.exports.postPrefactura = function (prefactura, callback) {
    if (!comprobarPrefactura(prefactura)) {
        var err = new Error("El prefactura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    prefactura.prefacturaId = 0; // fuerza el uso de autoincremento
    fnGetNumeroPrefactura(prefactura, function (err, res) {
        if (err) return callback(err);
        sql = "INSERT INTO prefacturas SET ?";
        sql = mysql.format(sql, prefactura);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            prefactura.prefacturaId = result.insertId;
            callback(null, prefactura);
        });
    });
}

// putPrefactura
// Modifica el prefactura según los datos del objeto pasao
module.exports.putPrefactura = function (id, prefactura, callback) {
    if (!comprobarPrefactura(prefactura)) {
        var err = new Error("El prefactura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != prefactura.prefacturaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE prefacturas SET ? WHERE prefacturaId = ?";
    sql = mysql.format(sql, [prefactura, prefactura.prefacturaId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, prefactura);
    });
}

// deletePrefactura
// Elimina el prefactura con el id pasado
module.exports.deletePrefactura = function (id, prefactura, callback) {
    var connection = getConnection();
    var nuevoImporte = 0;
    var nuevoPorcen = 0;
    connection.beginTransaction(function (err) {
        if(err) return callback(err);
        sql = "DELETE from prefacturas WHERE prefacturaId = ?;";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            if (err) return connection.rollback(function (err2) { callback(err) });
            //ACTUALIZAMOS LA PLANIFICACIÓN DE OBRAS SI ES NECESARIO
            if(result.affectedRows > 0 && prefactura.departamentoId == 8 && prefactura.contPlanificacionId) {
                //recuperamos la linea de planificación para calcular el nuevo porcentaje
                  sql = "SELECT * FROM contrato_planificacion WHERE contPlanificacionId = ?";
                  sql = mysql.format(sql, [prefactura.contPlanificacionId]);
                  connection.query(sql, function (err, result) {
                    if (err) return connection.rollback(function (err2) { callback(err) });
                    var planificacion = result[0]
                    nuevoImporte = planificacion.importePrefacturado - prefactura.total;
                    //calculamos el nuevo porcentaje
                    nuevoPorcen = (nuevoImporte * planificacion.porcentaje) / planificacion.importePrefacturado;
                    sql = "UPDATE contrato_planificacion SET importePrefacturado =  ?, importe =  ?, porcentaje = ? ";
                    sql += " WHERE contPlanificacionId = ?";
                    sql = mysql.format(sql, [nuevoImporte, nuevoImporte, nuevoPorcen, prefactura.contPlanificacionId]);
                    connection.query(sql, function (err, result) {
                      if (err) return connection.rollback(function (err2) { callback(err) });
                      connection.commit(function (err) {
                          if (err) return connection.rollback(function (err2) { callback(err) });
                          connection.end();
                          callback(null);//todo correcto
                      });
                    });

                  });
            } else {
                connection.commit(function (err) {
                    if (err) return connection.rollback(function (err2) { callback(err) });
                    connection.end();
                    callback(null);//todo correcto
                });
            }
        });

    });
}

// deletePrefacturasContrato
// Elimina todas las prefacturas pertenecientes a un contrato.
module.exports.deletePrefacturasContrato = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from prefacturas WHERE contratoClienteMantenimientoId = ? AND generada = 1";
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


// comprobarPrefacturaLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarPrefacturaLinea(prefacturaLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof prefacturaLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("prefacturaId"));
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("prefacturaLineaId"));
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("linea"));
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("porcentaje"));
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("descripcion"));
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("cantidad"));
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("importe"));
    comprobado = (comprobado && prefacturaLinea.hasOwnProperty("totalLinea"));
    return comprobado;
}

// getNextPrefacturaLine
// busca el siguiente número de línea de la prefactura pasada
module.exports.getNextPrefacturaLineas = function (id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT MAX(linea) as maxline FROM prefacturas_lineas"
    sql += " WHERE prefacturaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
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

// getPrefacturaLineas
// Devuelve todas las líneas de una prefacttura
module.exports.getPrefacturaLineas = function (id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM prefacturas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.prefacturaId = ?";
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

// getPrefacturaLinea
// Devuelve la línea de prefactura solcitada por su id.
module.exports.getPrefacturaLinea = function (id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades, pf.departamentoId, pf.contPlanificacionId FROM prefacturas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " LEFT JOIN prefacturas AS pf ON pf.prefacturaId = pfl.prefacturaId"
    sql += " WHERE pfl.prefacturaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// postPrefacturaLinea
// crear en la base de datos la linea de prefactura pasada
module.exports.postPrefacturaLinea = function (prefacturaLinea, callback) {
    if (!comprobarPrefacturaLinea(prefacturaLinea)) {
        var err = new Error("La linea de prefactura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    prefacturaLinea.prefacturaLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO prefacturas_lineas SET ?";
    sql = mysql.format(sql, prefacturaLinea);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        prefacturaLinea.prefacturaLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBases(prefacturaLinea.prefacturaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, prefacturaLinea);
        })
    });
}


// putPrefacturaLinea
// Modifica la linea de prefactura según los datos del objeto pasao
module.exports.putPrefacturaLinea = function (id, prefacturaLinea, callback) {
    if (!comprobarPrefacturaLinea(prefacturaLinea)) {
        var err = new Error("La linea de prefactura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != prefacturaLinea.prefacturaLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var contPlanificacionId = prefacturaLinea.contPlanificacionId;
    var departamentoId = prefacturaLinea.departamentoId;
    var diferencia = prefacturaLinea.diferencia;
    delete prefacturaLinea.diferencia;
    delete prefacturaLinea.contPlanificacionId;
    delete prefacturaLinea.departamentoId;
    var connection = getConnection();
    sql = "UPDATE prefacturas_lineas SET ? WHERE prefacturaLineaId = ?";
    sql = mysql.format(sql, [prefacturaLinea, prefacturaLinea.prefacturaLineaId]);
    connection.query(sql, function (err, result) {
        if(result.affectedRows > 0 && departamentoId == 8 && contPlanificacionId) {
            //recuperamos la linea de planificación para calcular el nuevo porcentaje
              sql = "SELECT * FROM contrato_planificacion WHERE contPlanificacionId = ?";
              sql = mysql.format(sql, contPlanificacionId);
              connection.query(sql, function (err, result) {
                if (err) return connection.rollback(function (err2) { callback(err) });
                var planificacion = result[0]
                nuevoImporte = planificacion.importePrefacturado - (diferencia);
                //calculamos el nuevo porcentaje
                nuevoPorcen = (nuevoImporte * planificacion.porcentaje) / planificacion.importePrefacturado;
                sql = "UPDATE contrato_planificacion SET importePrefacturado =  ?, importe =  ?, porcentaje = ? ";
                sql += " WHERE contPlanificacionId = ?";
                sql = mysql.format(sql, [nuevoImporte, nuevoImporte, nuevoPorcen, contPlanificacionId]);
                connection.query(sql, function (err, result) {
                  if (err) return connection.rollback(function (err2) { callback(err) });
                  connection.commit(function (err) {
                      if (err) return connection.rollback(function (err2) { callback(err) });
                      connection.end();
                                             // actualizar las bases y cuotas
                        fnActualizarBases(prefacturaLinea.prefacturaId, function (err, res) {
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
                        fnActualizarBases(prefacturaLinea.prefacturaId, function (err, res) {
                            if (err) {
                                return callback(err);
                            }
                        callback(null, prefacturaLinea);
                        })
        }
    });
}


// deletePrefacturaLinea
// Elimina la linea de prefactura con el id pasado
module.exports.deletePrefacturaLinea = function (id, prefacturaLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from prefacturas_lineas WHERE prefacturaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(prefacturaLinea.prefacturaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    });
}


// recalculo de línea de prefactura
module.exports.recalculoLineasPrefactura = function (prefacturaId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, done) {
    var con = getConnection();
    // Buscamos la líneas de la prefactura
    sql = " SELECT pf.coste as costePrefacturaCompleta, pf.contPlanificacionId, pf.departamentoId, pfl.*";
    sql += " FROM prefacturas as pf";
    sql += " LEFT JOIN prefacturas_lineas as pfl ON pfl.prefacturaId = pf.prefacturaId";
    sql += " WHERE pf.prefacturaId = ?";
    sql = mysql.format(sql, prefacturaId);
    con.query(sql, function (err, lineas) {
        con.end();
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
            /* var porcentajeDelCoste = linea.coste / linea.costePrefacturaCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste; */
            var linea2 =  Object.assign({} , linea)
            linea.porcentajeBeneficio = porcentajeBeneficio;
            linea.porcentajeAgente = porcentajeAgente;
            // Recalculamos el total de la línea en base a los nuevos datos
            linea.totalLinea = obtenerImporteAlClienteDesdeCoste(linea.coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId);
            linea.diferencia =  linea2.totalLinea - linea.totalLinea;
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costePrefacturaCompleta;
            // Actualizamos la línea lo que actualizará de paso la prefactura
            exports.putPrefacturaLinea(linea.prefacturaLineaId, linea, function (err, result) {
                if (err) return callback(err);
                ActulizaPorcentajesCalculadora(porcentajeBeneficio, porcentajeAgente, prefacturaId, function(err, result) {
                    if(err) return callback(err);
                    callback(null);
                });
            })
        }, function (err) {
            if (err) return done(err);
            done(null);
        });
    });

}

var ActulizaPorcentajesCalculadora = function(porcentajeBeneficio, porcentajeAgente, prefacturaId, callback) {
    var connection = getConnection();
    sql = "UPDATE prefacturas SET porcentajeBeneficio = ?, porcentajeAgente = ? WHERE prefacturaId = ?";
    sql = mysql.format(sql, [porcentajeBeneficio, porcentajeAgente, prefacturaId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, 'OK');
    });
}

//FUNCIONES RELACIONADAS CON LOS PERMISOS POR DEPARTAMENTOS

// getPrefacturasUsuario
// lee todos los registros de la tabla prefacturas que no estén prefacturadosy
// los devuelve como una lista de objetos
module.exports.getPrefacturasUsuario = function (usuarioId, departamentoId, dFecha, hFecha, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cm.tipoContratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.facturaId IS NULL";
    if(departamentoId > 0) {
        sql += " AND pf.departamentoId = " + departamentoId;
    } else {
        sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    if(dFecha != 'null' && hFecha != 'null') {
        sql += " AND f.fecha >= ?";
        sql += " AND  f.fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    } 
    sql += " ORDER BY pf.fecha, f.receptorNombre ASC, pf.numero ASC ";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturas = result;
        callback(null, prefacturas);
    });
}

// getPrefacturasAllUsuario
// lee todos los registros de la tabla prefacturas y
// los devuelve como una lista de objetos
module.exports.getPrefacturasAllUsuario = function (usuarioId, departamentoId, dFecha, hFecha, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cm.tipoContratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    if(departamentoId > 0) {
        sql += " WHERE pf.departamentoId = " + departamentoId;
    } else {
        sql += " WHERE pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    if(dFecha != 'null' && hFecha != 'null') {
        sql += " AND f.fecha >= ?";
        sql += " AND  f.fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    } 
    sql += " ORDER BY pf.fecha , f.receptorNombre ASC, pf.numero ASC";
    sql = mysql.format(sql, usuarioId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturas = result;
        callback(null, prefacturas);
    });
}

// getPreEmisionPrefacturasUsuario
// obtiene las prefacturas no prefacturadas entre las fechas indicadas
module.exports.getPreEmisionPrefacturasUsuario = function (dFecha, hFecha, usuarioId,clienteId, agenteId, departamentoId, empresaId, rectificativa, callback) {
    var connection = getConnection();
    var prefacturas = null;
    // primero las marcamos por defeto como prefacturables
    var sql = "UPDATE prefacturas as pf,clientes as c";
    sql += " SET pf.sel = 1";
    sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
    sql += " AND c.clienteId = pf.clienteId";
    if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
    if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
    if (departamentoId != 0) {
        sql += " AND pf.departamentoId = " + departamentoId;
    } else {
        sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+usuarioId+")";
    }
    if (rectificativa == 1) sql += " AND pf.total < 0";
    sql += " AND pf.facturaId IS NULL";
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT pf.*,";
        sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
        sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
        sql += " fp.nombre AS vFPago,";
        sql += " c.comercialId as agenteId, cm.tipoContratoId, com.nombre as agente, cm.direccion as dirTrabajo, cm.referencia";
        sql += " FROM prefacturas AS pf";
        sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId";
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
        sql += " LEFT JOIN comerciales as com ON com.comercialId = c.comercialId";
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
        if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
        if (departamentoId != 0) {
            sql += " AND pf.departamentoId = " + departamentoId;
        } else {
            sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+usuarioId+")";
        }
        if (rectificativa == 1) sql += " AND pf.total < 0";
        if (empresaId != 0) sql += " AND pf.empresaId = " + empresaId;
        sql += " AND pf.facturaId IS NULL";
        sql += " ORDER BY pf.fecha, f.receptorNombre ASC, pf.numero ASC";
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            res.forEach(function (pf) {
                pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
            });
            prefacturas = res;
            callback(null, prefacturas);
        });
    });
}

//creacion d e report json
module.exports.postCrearReport = function (dFecha, hFecha, clienteId, empresaId, tipoIvaId, factu, orden, departamentoId, usuarioId, infgestionCobros, callback) {
    var connection = getConnection();
    var obj = {};
    var sql = "SELECT"; 
    sql += " f.empresaId, ";
    sql += " f.facturaId,";
    sql += " f.numLetra,"
    sql += " emp.nombre AS empresaNombre,";
    sql += " c.referencia AS contratoReferencia,"
    sql += " f.prefacturaId,";
    sql += " f.fecha,";
	sql += " f.emisorNombre,";  
    sql += " ti.nombre AS tipoIva,";
    sql += " f.totalConIva,";
    sql += " cli.cuentaContable, ";
    sql += " fb.porcentaje AS porcentaje,";
    sql += " IF(ti.nombre='SUPLIDOS', 0, fb.base)  AS basFact,";
    sql += " fb.cuota,";
    sql += " f.importeRetencion,";
    sql += " f.ano,";
    sql += " f.numero,";
    sql += " f.serie,";
    sql += " f.receptorNombre,";
    sql += " f.fechaRecibida,";
    sql += " f.fechaGestionCobros,";
    sql += " fp.nombre AS formaPagoNombre,";
    sql += " IF(ti.nombre='SUPLIDOS', fb.base, 0)  AS suplidos";
    sql += " FROM prefacturas AS f";
    sql += " LEFT JOIN prefacturas_bases AS fb ON fb.prefacturaId = f.prefacturaId";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = f.clienteId"
    sql += " LEFT JOIN tipos_iva AS ti ON ti.tipoIvaId = fb.tipoIvaId";
    sql += " LEFT JOIN empresas AS emp ON emp.empresaId = f.empresaId";
    sql += " LEFT JOIN contratos as c ON c.contratoId = f.contratoId";
    sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";

    if(departamentoId && departamentoId > 0) {
        sql += " WHERE f.departamentoId =" + departamentoId;
    } else {
        sql += " WHERE f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
   
    if (clienteId > 0) {
        sql += " AND f.clienteId IN (" + clienteId + ")";
    }
    if (empresaId) {
        sql += " AND f.empresaId IN (" + empresaId + ")";
    }
    if (dFecha) {
        sql += " AND f.fecha >= '" + dFecha + " 00:00:00'";
    }
    if (hFecha) {
        sql += " AND f.fecha <= '" + hFecha + " 23:59:59'";
    }
    if (tipoIvaId > 0) {
        sql += " AND ti.tipoIvaId IN (" + tipoIvaId + ")";
    }
    if(factu == "sinFactu") {
        sql += " AND f.facturaId IS NULL"
    }
    if(factu == "factu") {
        sql += " AND NOT f.facturaId IS NULL"
    }

    if(orden) {
        sql += " ORDER BY " +  orden;
    } else {
        sql += " ORDER BY f.numero";
    }

    if(departamentoId == 8 && infgestionCobros == 'true') {
        sql = "SELECT"; 
        sql += " f.empresaId, ";
        sql += " f.facturaId,";
        sql += " f.numLetra,"
        sql += " emp.nombre AS empresaNombre,";
        sql += " c.referencia AS contratoReferencia,"
        sql += " f.prefacturaId,";
        sql += " f.fecha,";
        sql += " f.emisorNombre,";
        sql += " f.total,";  
        sql += " f.totalConIva,";
        sql += " cli.cuentaContable, ";
        sql += " f.importeRetencion,";
        sql += " f.ano,";
        sql += " f.numero,";
        sql += " f.serie,";
        sql += " f.receptorNombre,";
        sql += " f.fechaRecibida,";
        sql += " f.fechaGestionCobros,";
        sql += " fp.nombre AS formaPagoNombre";
        sql += " FROM prefacturas AS f";
        sql += " LEFT JOIN clientes AS cli ON cli.clienteId = f.clienteId"
        sql += " LEFT JOIN empresas AS emp ON emp.empresaId = f.empresaId";
        sql += " LEFT JOIN contratos as c ON c.contratoId = f.contratoId";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " WHERE f.departamentoId = " + departamentoId;
         
        if (clienteId > 0) {
            sql += " AND f.clienteId IN (" + clienteId + ")";
        }
        if (empresaId) {
            sql += " AND f.empresaId IN (" + empresaId + ")";
        }
        if (dFecha) {
            sql += " AND f.fecha >= '" + dFecha + " 00:00:00'";
        }
        if (hFecha) {
            sql += " AND f.fecha <= '" + hFecha + " 23:59:59'";
        }
       
        if(factu == "sinFactu") {
            sql += " AND f.facturaId IS NULL"
        }
        if(factu == "factu") {
            sql += " AND NOT f.facturaId IS NULL"
        }
    
        if(orden) {
            sql += " ORDER BY " +  orden;
        } else {
            sql += " ORDER BY f.numero";
        }
    
    }

    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        //REPORT CASO OBRAS
        if(departamentoId == 8 && infgestionCobros == 'true') {
            fnBuscaCobros(result, function (err, res) {
                if (err) {
                    return callback(err);
                }
                obj= procesaResultadoObras(result);
                /* var resultado = JSON.stringify(obj);
                fs.writeFile(process.env.REPORTS_DIR + "\\listadoPre.json", resultado, function(err) {
                    if(err) return callback(err);
                    //return callback(null, true);
                }); */
                callback(null, obj);
            })
        } else {
            obj= procesaResultado(result);
           /*  var resultado = JSON.stringify(obj);
            fs.writeFile(process.env.REPORTS_DIR + "\\listadoPre.json", resultado, function(err) {
                if(err) return callback(err);
                //return callback(null, true);
            }); */
            callback(null, obj);
        }
    });
 
}

var procesaResultado = (result) => {
    var obj = 
        {
            libCli: ""
        }
    var antfacid = null;
    result.forEach(e => {
        e.duplicado = false;
        e.fecha = moment(e.fecha).format('DD/MM/YYYY');
        if(e.prefacturaId == antfacid) {
            e.importeRetencion = 0;
            e.duplicado = true;
        }
        antfacid = e.prefacturaId;
    });
    obj.libCli = result
    return obj;
}


var procesaResultadoObras = (result) => {
    var obj = 
        {
            libCli: "",
            acumulados: ""
        }
    var antfacid = null;

    //acumulados
    var acumPenRecibir =  0;
    var acumRecibido = 0;
    var acumGestCobros = 0;
    var acumCobrado = 0;
    var acumTotConIva = 0;

    result.forEach(e => {
        e.penRecibir =  0;
        e.recibido = 0;
        e.gestCobros = 0;

        e.duplicado = false;
        e.fecha = moment(e.fecha).format('DD/MM/YYYY');
        if(e.prefacturaId == antfacid) {
            e.importeRetencion = 0;
            e.duplicado = true;
        }
        if(e.duplicado == false) {
            acumTotConIva += e.totalConIva;
            if(e.cobrado != 0) {
                acumCobrado += e.cobrado
            } else {
                //miramos si los campos fechaRecibida y fechaGestionCobros son o no nulos
                //departamento de obras
                if(e.fechaRecibida == null && e.fechaGestionCobros == null) {
                    e.penRecibir = e.totalConIva;
                    acumPenRecibir += e.totalConIva
                    //e.acumPenRecibir = acumPenRecibir;
                } else if(e.fechaRecibida != null && e.fechaGestionCobros == null) {
                    e.recibido = e.totalConIva;
                    acumRecibido += e.totalConIva;
                    //e.acumRecibido = acumRecibido;
                } else if(e.fechaRecibida != null && e.fechaGestionCobros != null) {
                    e.gestCobros = e.totalConIva;
                    acumGestCobros += e.totalConIva
                    //e.acumGestCobros = acumGestCobros;
                } 
            }
        }
        

        antfacid = e.prefacturaId;
    });
    obj.libCli = result
    obj.acumulados = {
        acumPenRecibir: acumPenRecibir,
        acumRecibido: acumRecibido,
        acumGestCobros: acumGestCobros,
        acumCobrado: acumCobrado,
        acumTotConIva: acumTotConIva

    }
    return obj;
}

// CREACION DE PREFACTURA DE CLIENTE A PARTIR DE PARTES //

module.exports.postCrearPrefactCliDesdeParte = function (seleccionados, deFecha, aFecha, fechaPrefactura, done) {
    var con = getConnection();
    var partesActualiza = [];
    var lineasFactura;
   
    var sql =""
    var partes = [];
    var porSeparado;
    var parteId;
    var fechaPrefacturaAno;

    deFecha = moment(deFecha, 'DD.MM.YYYY').format('DD/MM/YYYY');
    aFecha = moment(aFecha, 'DD.MM.YYYY HH:mm').format('DD/MM/YYYY');
    if(fechaPrefactura != "") {
        fechaPrefactura =  moment(fechaPrefactura, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD');
        fechaPrefacturaAno =  moment(fechaPrefactura, 'YYYY-MM-DD').format('YYYY');
    } else {
        fechaPrefactura = new Date();
        fechaPrefacturaAno =  moment(fechaPrefactura, 'YYYY-MM-DD').format('YYYY');
    }
    var periodo = deFecha + "-" + aFecha;
    
    for (var i= 0; i< seleccionados.length; i++) {
        partes.push(seleccionados[i].parteId);
    }
    //OBTENEMOS LAS CABECERAS de las facturas que no tienen seleccionada la casilla de factura propia y de las que si la tienene
    sql = "(SELECT '"+fechaPrefacturaAno+"' AS ano, '"+fechaPrefactura+"' AS fecha, ser.clienteId, '"+ periodo +"' AS periodo,  par.parteId, par.factPropiaCli,";
    sql += " par.empresaParteId AS empresaId, emp.nombre AS emisorNombre, emp.nif AS emisorNif, emp.`direccion` AS emisorDireccion,";
    sql += " emp.`codPostal` AS emisorCodpostal, emp.`poblacion` AS emisorPoblacion, emp.`provincia` AS emisorProvincia,";
    sql += " cli.`nombre` AS receptorNombre, cli.`nif` AS receptorNif, cli.`codPostal2` AS receptorCodPostal, 0 AS porcentajeRetencion, 0 AS importeRetencion,";
    sql += " cli.`poblacion2` AS receptorPoblacion, cli.`provincia2` AS receptorProvincia, ser.`direccionTrabajo` AS receptorDireccion,";
    sql += " par.formaPagoClienteId AS formaPagoId, SUM(par.`importe_cliente`) AS coste, SUM(par.`importe_cliente`) AS totalAlCliente, SUM(par.`importe_cliente`) AS total, 0 AS porcentajeBeneficio,";
    sql += " 0 AS porcentajeAgente, SUM(par.importe_cliente_iva) AS totalConIva, 7 AS departamentoId, 1 AS noCalculadora";
    sql += " FROM servicios AS ser";
    sql += " LEFT JOIN partes AS par ON par.servicioId = ser.servicioId";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
    sql += " LEFT JOIN empresas AS emp ON emp.empresaId = par.empresaParteId";
    sql += " WHERE par.parteId IN (?) AND par.FactPropiaCli = 0 GROUP BY ser.clienteId, par.empresaParteId, par.formaPagoClienteId)"
    sql += " UNION"
    sql += " (SELECT '"+fechaPrefacturaAno+"' AS ano, '"+fechaPrefactura+"' AS fecha, ser.clienteId, '"+ periodo +"' AS periodo,  par.parteId, par.factPropiaCli,";
    sql += " par.empresaParteId AS empresaId, emp.nombre AS emisorNombre, emp.nif AS emisorNif, emp.`direccion` AS emisorDireccion,";
    sql += " emp.`codPostal` AS emisorCodpostal, emp.`poblacion` AS emisorPoblacion, emp.`provincia` AS emisorProvincia,";
    sql += " cli.`nombre` AS receptorNombre, cli.`nif` AS receptorNif, cli.`codPostal2` AS receptorCodPostal,  0 AS porcentajeRetencion, 0 AS importeRetencion,";
    sql += " cli.`poblacion2` AS receptorPoblacion, cli.`provincia2` AS receptorProvincia, ser.`direccionTrabajo` AS receptorDireccion,";
    sql += " par.formaPagoClienteId AS formaPagoId, par.`importe_cliente` AS coste, par.`importe_cliente` AS totalAlCliente, par.`importe_cliente` AS total, 0 AS porcentajeBeneficio,";
    sql += " 0 AS porcentajeAgente, par.importe_cliente_iva AS totalConIva, 7 AS departamentoId, 1 AS noCalculadora";
    sql += " FROM servicios AS ser";
    sql += " LEFT JOIN partes AS par ON par.servicioId = ser.servicioId";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
    sql += " LEFT JOIN empresas AS emp ON emp.empresaId = par.empresaParteId";
    sql += " WHERE par.parteId IN (?) AND par.FactPropiaCli = 1)"
    sql = mysql.format(sql, [partes, partes]);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        cabFacturas = res;
        con.beginTransaction(function (err) {// Transaccion general que protege todo el proceso
            if (err) return done(err);
            
                async.eachSeries(cabFacturas, function (sel, callback2) {
                    porSeparado = sel.factPropiaCli;
                    parteId = sel.parteId;
                    var lineaFactura = {
                        parteLineaId: 0,
                        prefacturaLineaId:0,
                    };
                    var lineasObj = [];
                    async.series([
                        function (callback) {
                            // obtener Las series de factura correspondientes
                            sql = "SELECT * FROM empresas where empresaId = ?";
            
                            sql = mysql.format(sql, sel.empresaId);
                            con.query(sql, function (err, res) {
                                if (err) return callback(err);
                                sel.serie = res[0].seriePre;
                                callback(null);
                            });
                        },
                        function (callback) {
                             // obtener el número de factura que le corresponde
                             sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM prefacturas";
                             sql += " WHERE empresaId = ?";
                             sql += " AND ano = ?";
                             sql += " AND serie = ?";
                             sql = mysql.format(sql, [sel.empresaId, sel.ano, sel.serie]);
                             con.query(sql, function (err, res) {
                                 if (err) return callback(err);
                                 sel.numero = res[0].n
                                
                                 callback(null);
                             });
                        },
                        
                        function (callback) {
                           //SE CREA LA CABECERA DE LA FACTURA
                           sel.prefacturaId = 0//forzamos el autoincremento
                           //borramos los campos adicioneles
                           delete sel.factPropiaCli;
                           delete sel.parteId;
                           var sql2 = "INSERT INTO prefacturas SET ?"
                           sql2 = mysql.format(sql2, sel);
                           con.query(sql2, function(err, res) {
                                if (err) return callback(err);
                                sel.prefacturaId = res.insertId;
                                callback(null)
                           });
                        },
                        function(callback) {
                             //TRANSFORMAR LOS CAMPOS DEL PARTE_LINEA EN CAMPOS DE FACTURA_LINEA
                             sql = " (SELECT pt.parteLineaId, pt.descripcion AS descripcion, pt.unidades AS cantidad,ar.articuloId AS articuloId,pt.tipoIvaClienteId AS tipoIvaId, pt.ivaCliente AS porcentaje, ar.unidadId,";
                             sql += " pt.precioCliente AS importe, pt.importeClienteIva AS coste, pt.importeCliente AS totalLinea ,ga.nombre AS capituloLinea ";
                             sql += " FROM partes AS par";
                             sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
                             sql += " LEFT JOIN partes_lineas AS pt ON pt.parteId = par.parteId"
                             sql += " LEFT JOIN articulos AS ar ON ar.codigoReparacion = pt.codigoArticulo";
                             sql += " LEFT JOIN unidades AS u ON u.unidadId = ar.unidadId";
                             sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoarticuloId = ar.grupoArticuloId"
                             sql += " WHERE ser.clienteId = ? AND par.empresaParteId = ? AND par.formaPagoClienteId = ? AND par.factPropiaCli = ? AND par.parteId IN (?)";
                             if(porSeparado == 1) {
                                 sql += " AND par.parteId = " + parteId;
                             }
                             sql += " ORDER BY pt.parteLineaId)"
                             sql = mysql.format(sql, [sel.clienteId, sel.empresaId, sel.formaPagoId, porSeparado, partes]);
                             con.query(sql, function (err, res) {
                                if (err) return callback(err);
                                lineasFactura = res
                                //procesamos las lineas
                                var cont = 0;
                                lineasFactura.forEach( function(l){
                                    lineaFactura = {
                                        parteLineaId: 0,
                                        prefacturaLineaId:0,
                                    };
                                    lineaFactura.parteLineaId = l.parteLineaId
                                    lineasObj.push(lineaFactura); //guardanmos las ids de partelineaId y facproveLineaId para actualizar la linea del parte mas adelante
                                    cont ++;
                                    l.prefacturaLineaId = 0//forzamos autoincremento
                                    l.prefacturaId = sel.prefacturaId;
                                    var str = cont.toString();
                                    l.linea = "1." + str;
    
                                });
                                callback(null)
                            });
                        },
                        function (callback) {
                            //SE CREAN LAS lINEAS DE LA FACTURA
                            
                            var cont = 0;
                           async.eachSeries(lineasFactura, function (f, done2) {
                            delete f.parteLineaId;
                            var sql2 = "INSERT INTO prefacturas_lineas SET ?"
                            sql2 = mysql.format(sql2, f);
                                con.query(sql2, function(err, res) {
                                    if (err) return done2(err);
                                    f.prefacturaLineaId = res.insertId;
                                    lineasObj[cont].prefacturaLineaId = f.prefacturaLineaId; //guardanmos las ids de partelineaId y facturaLineaId para actualizar la linea del parte mas adelante
                                    cont++;
                                    done2(null);
    
                                });
                            },function (err) {
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                        function(callback) {//SE INSERTAN LAS BASES DE LA FACTURA
                            sql = "INSERT INTO prefacturas_bases (prefacturaId, tipoIvaId, porcentaje, base, cuota)";
                            sql += " SELECT pl.prefacturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
                            sql += " FROM";
                            sql += " (SELECT prefacturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
                            sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
                            sql += " FROM prefacturas_lineas";
                            sql += " WHERE prefacturaId = ?";
                            sql += " GROUP BY tipoIvaId) AS pl";
                            sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
                            sql = mysql.format(sql, sel.prefacturaId);
                            con.query(sql, function(err, res) { 
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                        function(callback) {//SELECCIONAMOS LA ID DEL PARTE QUE SE TIENE QUE ACTUALIZAR
                            sql = " SELECT par.parteId";
                             sql += " FROM partes AS par";
                             sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
                             if(porSeparado == 1) {
                                sql += " WHERE par.parteId = " + parteId;
                            } else {
                                sql += " WHERE ser.clienteId = ? AND par.empresaParteId = ? AND par.formaPagoClienteId = ? AND par.parteId IN (?)";
                                sql = mysql.format(sql, [sel.clienteId, sel.empresaId, sel.formaPagoId, partes]);
                            }
                             con.query(sql, function(err, res) { 
                                if (err) return callback(err);
                                partesActualiza = res
                                callback(null);
                            });
                        },
                        function(callback) {//ACTUALIZAMOS EL PARTE CON EL NUMERO E ID DE LA FACTURA CORRESPONDIENTE 
                            async.eachSeries(partesActualiza, function (f, done3) {
                                var sql3 = "UPDATE PARTES SET  prefacturaId = ? WHERE parteId = ?"
                                sql3 = mysql.format(sql3, [sel.prefacturaId, f.parteId]);
                                    con.query(sql3, function(err, res) {
                                        if (err) return done3(err);
                                        done3(null);
        
                                    });
                                },function (err) {
                                    if (err) return callback(err);
                                    callback(null);
                                });
                        },
                        function (callback) {//ACTUALIZAMOS LAS LINAS DEL PARTE CON LAS IDS DE LAS LINEAS DE FACTURA  CORRESPONDIENTE 
                            //SE CREAN LAS lINEAS DE LA FACTURA
                           async.eachSeries(lineasObj, function (f, done2) {
                            var sql2 = "UPDATE partes_lineas SET prefacturaLineaId = ? WHERE parteLineaId = ? "
                            sql2 = mysql.format(sql2, [ f.prefacturaLineaId, f.parteLineaId]);
                                con.query(sql2, function(err, res) {
                                    if (err) return done2(err);
                                    done2(null);
    
                                });
                            },function (err) {
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
                        con.end();
                        done(null);
                    })
                })
            });
    });
}

//RECEPCION--GESTIÓN DE COBROS

//putrecepcionGestionContrato
module.exports.getRecepcionGestionContrato = async (contratoId) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT prefacturaId, fechaRecibida, fechaGestionCobros FROM prefacturas WHERE contratoId = ? AND sel = 1";
            sql = mysql.format(sql, contratoId);
            const [result] = await connection.query(sql);
            await connection.end();
			resolve (result);
          
        } catch(error) {
            if(connection) {
				if (!connection.connection._closing) await connection.end();
			}
			reject (error);
        }
    });
}

//putrecepcionGestionContrato
module.exports.putRecepcionGestionContrato = async (contratoId, recepcionGestion) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "UPDATE prefacturas SET ? WHERE contratoId = ? AND sel = 1";
            sql = mysql.format(sql, [recepcionGestion, contratoId]);
            const [result] = await connection.query(sql);
            await connection.end();
			resolve (result);
          
        } catch(error) {
            if(connection) {
				if (!connection.connection._closing) await connection.end();
			}
			reject (error);
        }
    });
}


var obtenerImporteAlClienteDesdeCoste = function (coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId) {
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (porcentajeBeneficio) {
            importeBeneficio = porcentajeBeneficio * coste / 100;
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (porcentajeAgente) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - porcentajeAgente) / 100));
        importeAgente = roundToTwo(importeAlCliente - ventaNeta);
    }
    importeAlCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    if (tipoClienteId == 1){
        // es un mantenedor
        importeAlCliente = roundToTwo(importeAlCliente - ventaNeta + importeBeneficio);
    }
    return importeAlCliente;
}


// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la prefactura pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBases = function (id, callback) {
    fnBorraBases(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
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

// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la prefactura pasada
// basándose en los tipos y porcentajes de las líneas
var fnBuscaCobros = function (result, callback) {
    async.eachSeries(result, function (r, done) {
        r.cobrado = 0;
        if(!r.facturaId) {
            done();
        } else {
            cobrosDb.getCobrosFactura(r.facturaId, function(err, res) {
                if(err) return callback(err);
                if(res.length > 0) {
                    res.forEach( function(e) {
                        r.cobrado += e.impvenci;
                    });
                    done();
                }else {
                    done();
                }

            });
        }
    }, function (err) {
        if (err) return callback(err);
        callback(null, result);
    });
}


// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de prefactura
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotales = function (id, callback) {
    var connection = getConnection();
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
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// fnBorraBases
// elimina las bases y cuotas de una prefactura
// antes de actualizarlas
var fnBorraBases = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM prefacturas_bases";
    sql += " WHERE prefacturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// getPrefacturaBases
// devuelve los regitros de bases y cutas de la 
// prefactura con el id pasado
module.exports.getPrefacturaBases = function (id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pb.*, ti.nombre as tipo";
    sql += " FROM prefacturas_bases as pb";
    sql += " LEFT JOIN tipos_iva as ti ON ti.tipoIvaId = pb.tipoIvaId"
    sql += " WHERE prefacturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// -- Obtener número de prefactura
// La idea es devolver la prefactura con los campos ano, numero y serie
var fnGetNumeroPrefactura = function (prefactura, done) {
    var con = getConnection();
    // hay que obtener de la empresa la serie
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

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};