// prefacturas_db_mysql
// Manejo de la tabla prefacturas en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

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
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function(err) {
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
// lee todos los registros de la tabla prefacturas y
// los devuelve como una lista de objetos
module.exports.getPrefacturas = function(callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT * FROM prefacturas";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        prefacturas = result;
        callback(null, prefacturas);
    });
}

// getPrefactura
// busca  el prefactura con id pasado
module.exports.getPrefactura = function(id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT *";
    sql += " FROM prefacturas";
    sql += " WHERE prefacturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
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


// postPrefactura
// crear en la base de datos el prefactura pasado
module.exports.postPrefactura = function(prefactura, callback) {
    if (!comprobarPrefactura(prefactura)) {
        var err = new Error("El prefactura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    prefactura.prefacturaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO prefacturas SET ?";
    sql = mysql.format(sql, prefactura);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        prefactura.prefacturaId = result.insertId;
        callback(null, prefactura);
    });
}

// putPrefactura
// Modifica el prefactura según los datos del objeto pasao
module.exports.putPrefactura = function(id, prefactura, callback) {
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
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, prefactura);
    });
}

// deletePrefactura
// Elimina el prefactura con el id pasado
module.exports.deletePrefactura = function(id, prefactura, callback) {
    // TODO:
    // Habrá que controlar la eliminación de las líneas.
    var connection = getConnection();
    sql = "DELETE from prefacturas WHERE prefacturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
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
module.exports.getNextPrefacturaLineas= function(id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT MAX(linea) as maxline FROM prefacturas_lineas"
    sql += " WHERE prefacturaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
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

// getPrefacturaLineas
// Devuelve todas las líneas de una prefacttura
module.exports.getPrefacturaLineas = function(id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT * FROM prefacturas_lineas"
    sql += " WHERE prefacturaId = ?";
    sql += " ORDER by linea";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// getPrefacturaLinea
// Devuelve la línea de prefactura solcitada por su id.
module.exports.getPrefacturaLinea = function(id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT * FROM prefacturas_lineas"
    sql += " WHERE prefacturaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// postPrefacturaLinea
// crear en la base de datos la linea de prefactura pasada
module.exports.postPrefacturaLinea = function(prefacturaLinea, callback) {
    if (!comprobarPrefacturaLinea(prefacturaLinea)) {
        var err = new Error("La linea de prefactura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    prefacturaLinea.prefacturaLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO prefacturas_lineas SET ?";
    sql = mysql.format(sql, prefacturaLinea);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        prefacturaLinea.prefacturaLineaId = result.insertId;
        callback(null, prefacturaLinea);
    });
}

// putPrefacturaLinea
// Modifica la linea de prefactura según los datos del objeto pasao
module.exports.putPrefacturaLinea = function(id, prefacturaLinea, callback) {
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
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, prefacturaLinea);
    });
}

// deletePrefacturaLinea
// Elimina la linea de prefactura con el id pasado
module.exports.deletePrefacturaLinea = function(id, prefacturaLinea, callback) {
    // TODO:
    // Habrá que controlar la eliminación de las líneas.
    var connection = getConnection();
    sql = "DELETE from prefacturas_lineas WHERE prefacturaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}