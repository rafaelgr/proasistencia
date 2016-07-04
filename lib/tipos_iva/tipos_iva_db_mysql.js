// tipos_iva_db_mysql
// Manejo de la tabla tipos_iva de la base de datos
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

// comprobarTipoIva
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoIva(tipoIva) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tipoIva;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tipoIva.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && tipoIva.hasOwnProperty("nombre"));
    return comprobado;
}


// getTipoIvas
// lee todos los registros de la tabla tipoIvas y
// los devuelve como una lista de objetos
module.exports.getTiposIva = function(callback) {
    var connection = getConnection();
    var tipoIvas = null;
    sql = "SELECT * FROM tipos_iva";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        tiposIva = result;
        callback(null, tiposIva);
    });
}

// getTipoIvasBuscar
// lee todos los registros de la tabla tipoIvas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposIvaBuscar = function(nombre, callback) {
    var connection = getConnection();
    var tipoIvas = null;
    var sql = "SELECT * from tipos_iva";
    if (nombre !== "*") {
        sql = "SELECT * from tipos_iva";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        tiposIvas = result;
        callback(null, tiposIvas);
    });
}

// getTipoIva
// busca  el tipoIva con id pasado
module.exports.getTipoIva = function(id, callback) {
    var connection = getConnection();
    var tipoIvas = null;
    sql = "SELECT * from tipos_iva";
    sql += "  WHERE tipoIvaId = ?";
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


// postTipoIva
// crear en la base de datos el tipoIva pasado
module.exports.postTipoIva = function(tipoIva, callback) {
    if (!comprobarTipoIva(tipoIva)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    tipoIva.tipoIvaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_iva SET ?";
    sql = mysql.format(sql, tipoIva);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        tipoIva.tipoIvaId = result.insertId;
        callback(null, tipoIva);
    });
}

// putTipoIva
// Modifica el tipoIva según los datos del objeto pasao
module.exports.putTipoIva = function(id, tipoIva, callback) {
    if (!comprobarTipoIva(tipoIva)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tipoIva.tipoIvaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE tipos_iva SET ? WHERE tipoIvaId = ?";
    sql = mysql.format(sql, [tipoIva, tipoIva.tipoIvaId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tipoIva);
    });
}

// deleteTipoIva
// Elimina el tipoIva con el id pasado
module.exports.deleteTipoIva = function(id, tipoIva, callback) {
    var connection = getConnection();
    sql = "DELETE from tipos_iva WHERE tipoIvaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
