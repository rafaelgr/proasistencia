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
    sql = "SELECT tf.*, gt.nombre as grupoNombre";
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
    sql = "SELECT tf.*, gt.nombre as grupoNombre";
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
        callback(null, result[0]);
    });
}

//devualve las tarifas que continene un articulo determinado
module.exports.getTarifasArticulo = function(articuloId, callback){
    var connection = getConnection();
    var tarifas = null;
    sql = "SELECT tf.* , grt.nombre AS nombreGrupo";
    sql += " FROM tarifas  AS tf";
    sql += " INNER JOIN tarifas_lineas AS tfl ON tfl.tarifaId = tf.tarifaId";
    sql += " INNER JOIN grupo_tarifa AS grt ON  grt.grupoTarifaId = tf.grupoTarifaId";
    sql += " WHERE tfl.articuloId = ?";
    sql = mysql.format(sql, articuloId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}




module.exports.getTarifasGrupo = function(grupoId, callback){
    var connection = getConnection();
    sql = "SELECT * FROM tarifas";
    sql += " WHERE grupoTarifaId = ?";
    sql = mysql.format(sql, grupoId);
    connection.query(sql, function (err, result){
        closeConnectionCallback(connection, callback);
        if(err) {
            return callback(err, null);
        }
        callback(null, result);
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
module.exports.deleteTarifa = function (id, callback) {
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


// comprobarTarifaLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTarifaLinea(tarifaLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tarifaLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tarifaLinea.hasOwnProperty("tarifaLineaId"));
    comprobado = (comprobado && tarifaLinea.hasOwnProperty("tarifaId"));
    comprobado = (comprobado && tarifaLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && tarifaLinea.hasOwnProperty("precioUnitario"));
    return comprobado;
}


// getTarifaLineas
// Devuelve todas las líneas de una tarifa
module.exports.getTarifaLineas = function (id, callback) {
    var connection = getConnection();
    var tarifas = null;
    sql = "SELECT CONCAT(a.nombre,' ( ',gr.nombre,' )') AS unidadConstructiva, tf.* FROM tarifas_lineas AS tf";
    sql += " INNER JOIN articulos AS a ON a.articuloId = tf.articuloId";
    sql += " INNER JOIN grupo_articulo AS gr ON a.grupoArticuloId = gr.grupoArticuloId";
    sql += " WHERE tf.tarifaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// getTarifaLinea
// Devuelve la línea de tarifa solcitada por su id.
module.exports.getTarifaLinea = function (id, callback) {
    var connection = getConnection();
    var tarifas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId FROM tarifas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " WHERE pfl.tarifaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

module.exports.getArticuloTarifa= function (articuloId, tarifaId, callback){
    var connection = getConnection();
    sql = "SELECT * FROM tarifas_lineas";
    sql += " WHERE articuloId = ?";
    sql += " AND tarifaId = ?";
    sql = mysql.format(sql, [articuloId, tarifaId]);
    connection.query(sql, function(err, result){
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })

}

// postTarifaLinea
// crear en la base de datos la linea de tarifa pasada
module.exports.postTarifaLinea = function (tarifaLinea, callback) {
    if (!comprobarTarifaLinea(tarifaLinea)) {
        var err = new Error("La linea de tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    tarifaLinea.tarifaLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tarifas_lineas SET ?";
    sql = mysql.format(sql, tarifaLinea);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaLinea);
    });
}


// putTarifaLinea
// Modifica la linea de tarifa según los datos del objeto pasao
module.exports.putTarifaLinea = function (id, tarifaLinea, callback) {
    if (!comprobarTarifaLinea(tarifaLinea)) {
        var err = new Error("La linea de tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tarifaLinea.tarifaLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE tarifas_lineas SET ? WHERE tarifaLineaId = ?";
    sql = mysql.format(sql, [tarifaLinea, tarifaLinea.tarifaLineaId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaLinea);
    });
}

// deleteTarifaLinea
// Elimina la linea de tarifa con el id pasado
module.exports.deleteTarifaLinea = function (id, tarifaLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from tarifas_lineas WHERE tarifaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


