// prefacturas_db_mysql
// Manejo de la tabla prefacturas en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
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
// lee todos los registros de la tabla prefacturas que no estén facturadosy
// los devuelve como una lista de objetos
module.exports.getPrefacturas = function (callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
    sql += " WHERE pf.facturaId IS NULL";
    sql += " ORDER BY pf.fecha";
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
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
    sql += " WHERE pf.contratoId = ?";
    sql += " ORDER BY pf.fecha";
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

module.exports.getPrefacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
    sql += " WHERE pf.contratoId = ?";
    sql += " AND pf.generada = 1"
    sql += " ORDER BY pf.fecha";
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

module.exports.deletePrefacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "DELETE FROM prefacturas";
    sql += " WHERE contratoId = ? AND generada = 1"
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
    sql += " fp.nombre AS vFPago, cm.referencia";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
    sql += " ORDER BY pf.fecha";
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


// getPreEmisionFacturas
// obtiene las prefacturas no facturadas entre las fechas indicadas
module.exports.getPreEmisionFacturas = function (dFecha, hFecha, clienteId, agenteId, articuloId, tipoMantenimientoId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    // primero las marcamos por defeto como facturables
    var sql = "UPDATE prefacturas SET sel = 1";
    sql += " WHERE fecha >= ? AND fecha <= ?";
    sql += " AND facturaId IS NULL";
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT pf.*,";
        sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
        sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
        sql += " fp.nombre AS vFPago,";
        sql += " c.comercialId as agenteId, cm.articuloId, cm.tipoMantenimientoId"
        sql += " FROM prefacturas AS pf";
        sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId"
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
        if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
        if (articuloId != 0) sql += " AND articuloId = " + articuloId;
        if (tipoMantenimientoId != 0) sql += " AND tipoMantenimientoId = " + tipoMantenimientoId;
        sql += " AND pf.facturaId IS NULL";
        sql += " ORDER BY pf.fecha";
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
    sql += " fp.nombre AS vFPago, cm.referencia";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
    sql += " WHERE pf.prefacturaId = ?";
    sql += " ORDER BY pf.fecha";
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
    sql = "DELETE from prefacturas WHERE prefacturaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
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
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM prefacturas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
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
    var connection = getConnection();
    sql = "UPDATE prefacturas_lineas SET ? WHERE prefacturaLineaId = ?";
    sql = mysql.format(sql, [prefacturaLinea, prefacturaLinea.prefacturaLineaId]);
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
            callback(null, prefacturaLinea);
        })
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
module.exports.recalculoLineasPrefactura = function (prefacturaId, coste, porcentajeBeneficio, porcentajeAgente, done) {
    var con = getConnection();
    // Buscamos la líneas de la prefactura
    sql = " SELECT pf.coste as costePrefacturaCompleta, pfl.*";
    sql += " FROM prefacturas as pf";
    sql += " LEFT JOIN prefacturas_lineas as pfl ON pfl.prefacturaId = pf.prefacturaId";
    sql += " WHERE pf.prefacturaId = ?";
    sql = mysql.format(sql, prefacturaId);
    con.query(sql, function (err, lineas) {
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
            var porcentajeDelCoste = linea.coste / linea.costePrefacturaCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste;
            // Recalculamos el total de la línea en base a los nuevos datos
            linea.totalLinea = obtenerImporteAlClienteDesdeCoste(importeDelNuevoCoste, porcentajeBeneficio, porcentajeAgente);
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costePrefacturaCompleta;
            // Actualizamos la línea lo que actualizará de paso la prefactura
            exports.putPrefacturaLinea(linea.prefacturaLineaId, linea, function (err, result) {
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

// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de factura
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

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};