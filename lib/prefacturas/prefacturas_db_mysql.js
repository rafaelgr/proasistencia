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
    comprobado = (comprobado && prefactura.hasOwnProperty("nombre"));
    comprobado = (comprobado && prefactura.hasOwnProperty("nif"));
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
