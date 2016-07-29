// comerciales_db_mysql
// Manejo de la tabla comerciales en la base de datos
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

// comprobarComercial
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarComercial(comercial) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof comercial;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && comercial.hasOwnProperty("comercialId"));
    comprobado = (comprobado && comercial.hasOwnProperty("nombre"));
    comprobado = (comprobado && comercial.hasOwnProperty("nif"));
    return comprobado;
}


// getComerciales
// lee todos los registros de la tabla comerciales y
// los devuelve como una lista de objetos
module.exports.getComerciales = function(callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT * FROM comerciales";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        comerciales = result;
        callback(null, comerciales);
    });
}

// getAgentes
// lee todos los registros de la tabla comerciales 
// que son agentes (tipoComercialId = 1)  y los devuelve 
// como una lista de objetos
module.exports.getAgentes = function(callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT * FROM comerciales WHERE tipoComercialId = 1";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        comerciales = result;
        callback(null, comerciales);
    });
}


// getComercialesBuscar
// lee todos los registros de la tabla comerciales cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getComercialesBuscar = function(nombre, callback) {
    var connection = getConnection();
    var comerciales = null;
    var sql = "SELECT * FROM comerciales";
    if (nombre !== "*") {
        sql = "SELECT * FROM comerciales WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        comerciales = result;
        callback(null, comerciales);
    });
}

// getComercial
// busca  el comercial con id pasado
module.exports.getComercial = function(id, callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT * FROM comerciales WHERE comercialId = ?";
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


// postComercial
// crear en la base de datos el comercial pasado
module.exports.postComercial = function(comercial, callback) {
    if (!comprobarComercial(comercial)) {
        var err = new Error("El comercial pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    comercial.comercialId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO comerciales SET ?";
    sql = mysql.format(sql, comercial);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        comercial.comercialId = result.insertId;
        callback(null, comercial);
    });
}

// putComercial
// Modifica el comercial según los datos del objeto pasao
module.exports.putComercial = function(id, comercial, callback) {
    if (!comprobarComercial(comercial)) {
        var err = new Error("El comercial pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != comercial.comercialId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE comerciales SET ? WHERE comercialId = ?";
    sql = mysql.format(sql, [comercial, comercial.comercialId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, comercial);
    });
}

// deleteComercial
// Elimina el comercial con el id pasado
module.exports.deleteComercial = function(id, comercial, callback) {
    var connection = getConnection();
    sql = "DELETE from comerciales WHERE comercialId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
