// estado_estadoActuacion_db_mysql
// Manejo de la tabla  de estados de estados_actuacion en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

var com = require("../comun/comun");//conexiones con ariconta

//  leer la configurción de MySQL

var sql = "";

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

// comprobarEstadoActuacion
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarEstadoActuacion(estadoActuacion) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof estadoActuacion;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && estadoActuacion.hasOwnProperty("estadoActuacionId"));
    comprobado = (comprobado && estadoActuacion.hasOwnProperty("nombre"));
    return comprobado;
}


// getEstadosActuacion
// lee todos los registros de la tabla estados_actuacion y
// los devuelve como una lista de objetos
module.exports.getEstadosActuacion = function(callback) {
    var connection = getConnection();
    var estados_actuacion = null;
    sql = "SELECT * FROM estados_actuacion";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        estados = result;
        callback(null, estados);
    });
}

// getEstadosActuacionBuscar
// lee todos los registros de la tabla estados_actuacion cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getEstadosActuacionBuscar = function(nombre, callback) {
    var connection = getConnection();
    var estados_actuacion = null;
    var sql = "SELECT * FROM estados_actuacion";
    if (nombre !== "*") {
        sql = "SELECT * FROM estados_actuacion";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        estados = result;
        callback(null, estados);
    });
}

// getEstadoActuacion
// busca  el estadoActuacion con id pasado
module.exports.getEstadoActuacion = function(id, callback) {
    var connection = getConnection();
    var estados_actuacion = null;
    sql = "SELECT * FROM estados_actuacion";
    sql += "  WHERE estadoActuacionId = ?";
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


// postEstadoActuacion
// crear en la base de datos el estadoActuacion pasado
module.exports.postEstadoActuacion = function(estadoActuacion, callback) {
    if (!comprobarEstadoActuacion(estadoActuacion)) {
        var err = new Error("El estado pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    estadoActuacion.estadoActuacionId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO estados_actuacion SET ?";
    sql = mysql.format(sql, estadoActuacion);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        estadoActuacion.estadoActuacionId = result.insertId;
        callback(null, estadoActuacion);
    });
}

// putEstadoActuacion
// Modifica el estadoEstadoActuacion según los datos del objeto pasao
module.exports.putEstadoActuacion = function(id, estadoActuacion, callback) {
    if (!comprobarEstadoActuacion(estadoActuacion)) {
        var err = new Error("El estado pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != estadoActuacion.estadoActuacionId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    var resultado = false;
    sql = "UPDATE estados_actuacion SET ? WHERE estadoActuacionId = ?";
    sql = mysql.format(sql, [estadoActuacion, estadoActuacion.estadoActuacionId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, estadoActuacion);
    });
}

// deleteEstadoActuacion
// Elimina el estadoEstadoActuacion con el id pasado
module.exports.deleteEstadoActuacion = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from estados_actuacion WHERE estadoActuacionId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


