// tarifas_db_mysql 
// Manejo de la tabla tarifas en la base de datos
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
var ioAPI = require('../ioapi/ioapi');

var correoAPI = require('../correoElectronico/correoElectronico');

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

// comprobartarifa
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTarifa(tarifa) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tarifa;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tarifa.hasOwnProperty("tarifaId"));
    comprobado = (comprobado && tarifa.hasOwnProperty("grupoTarifaId"));
    comprobado = (comprobado && tarifa.hasOwnProperty("nombre"));
    return comprobado;
}


// getTarifas
// lee todos los registros de la tabla tarifas que no estén tarifadosy
// los devuelve como una lista de objetos
module.exports.getTarifas = function (callback) {
    var connection = getConnection();
    var tarifas = null;
    sql = "SELECT tf.*, gt.nombre";
    sql += " FROM tarifas AS tf";
    sql += " LEFT JOIN grupo_tarifa AS gt ON tf.grupoTarifaId = gt.grupoTarifaId";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        tarifas = result;
        callback(null, tarifas);
    });
}

// getTarifa
// busca  el tarifa con id pasado
module.exports.getTarifa = function (id, callback) {
    var connection = getConnection();
    var tarifas = null;
    sql = "SELECT tf.*, gt.nombre";
    sql += " FROM tarifas AS tf";
    sql += " LEFT JOIN grupo_tarifa AS gt ON tf.grupoTarifaId = gt.grupoTarifaId";
    sql += " WHERE tf.tarifaId = ?";
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

module.exports.deleteTarifasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var tarifas = null;
    sql = "DELETE FROM tarifas";
    sql += " WHERE contratoId = ? AND generada = 1"
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err);
        callback(null);
    });
}

// postTarifa
// crear en la base de datos el tarifa pasado
module.exports.postTarifa = function (tarifa, callback) {
    if (!comprobarTarifa(tarifa)) {
        var err = new Error("la tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    tarifa.tarifaId = 0; // fuerza el uso de autoincremento
    fnGetNumeroTarifa(tarifa, function (err, res) {
        if (err) return callback(err);
        sql = "INSERT INTO tarifas SET ?";
        sql = mysql.format(sql, tarifa);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            tarifa.tarifaId = result.insertId;
            callback(null, tarifa);
        });
    });
}

module.exports.postContabilizarTarifas = function (dFecha, hFecha, done) {
    var con = getConnection();
    var sql = "";
    sql = "SELECT * FROM empresas;";
    con.query(sql, function (err, empresas) {
        async.eachSeries(empresas, function (empresa, callback) {
            contabilizarEmpresa(dFecha, hFecha, empresa, function (err) {
                if (err) return callback(err);
                callback();
            });
        }, function (err) {
            if (err) return done(err);
            done(null, 'OK');
        });
    });
}




// putTarifa
// Modifica el tarifa según los datos del objeto pasao
module.exports.putTarifa = function (id, tarifa, callback) {
    if (!comprobarTarifa(tarifa)) {
        var err = new Error("El tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tarifa.tarifaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE tarifas SET ? WHERE tarifaId = ?";
    sql = mysql.format(sql, [tarifa, tarifa.tarifaId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifa);
    });
}

// deleteTarifa
// Elimina el tarifa con el id pasado
module.exports.deleteTarifa = function (id, tarifa, callback) {
    var connection = getConnection();
    sql = "DELETE from tarifas WHERE tarifaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// deleteTarifasContrato
// Elimina todas las tarifas pertenecientes a un contrato.
module.exports.deleteTarifasContrato = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from tarifas WHERE contratoClienteMantenimientoId = ? AND generada = 1";
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
|  LINEAS TARIFAS                       |
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
            return callback(null, 1.1);
        }
        callback(null, roundToTwo(maxline + 0.1));
    });
}

// getFacturaLineas
// Devuelve todas las líneas de una prefacttura
module.exports.getFacturaLineas = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM facturas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.facturaId = ?";
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
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM facturas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.facturaLineaId = ?";
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


// recalculo de línea de factura
module.exports.recalculoLineasFactura = function (facturaId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, done) {
    var con = getConnection();
    // Buscamos la líneas de la factura
    sql = " SELECT pf.coste as costeFacturaCompleta, pfl.*";
    sql += " FROM facturas as pf";
    sql += " LEFT JOIN facturas_lineas as pfl ON pfl.facturaId = pf.facturaId";
    sql += " WHERE pf.facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, function (err, lineas) {
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
            var porcentajeDelCoste = linea.coste / linea.costeFacturaCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste;
            // Recalculamos el total de la línea en base a los nuevos datos
            linea.totalLinea = obtenerImporteAlClienteDesdeCoste(importeDelNuevoCoste, porcentajeBeneficio, porcentajeAgente, tipoClienteId);
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costeFacturaCompleta;
            // Actualizamos la línea lo que actualizará de paso la factura
            exports.putFacturaLinea(linea.facturaLineaId, linea, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        }, function (err) {
            if (err) return done(err);
            done(null);
        });
    });

}





var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};

